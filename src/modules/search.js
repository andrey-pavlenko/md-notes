import { PorterStemmer, PorterStemmerRu } from 'natural';

const latinChars = 'a-z';
const europianChars = 'ā-žà-öø-ÿ';
const cyrillicChars = 'а-яёѐѓєіїј';
const wordChars = `${latinChars}${europianChars}${cyrillicChars}`;
const word = `(?:[0-9]+[.,/:])+[0-9]+|[${wordChars}0-9]+`;

/**
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  const reWord = new RegExp(`(${word})`, 'iu');
  return text.split(reWord)
    .filter(word => reWord.test(word));
}

/**
 * @param {string} word
 * @returns {string}
 */
function stem(word) {
  const reCyrillyc = new RegExp(`[${cyrillicChars}]`, 'iu');
  if (reCyrillyc.test(word)) {
    return PorterStemmerRu.stem(word);
  }
  return PorterStemmer.stem(word);
}

/**
 * @param {string} text
 * @param {import('./_search.d').Position[]} positions
 * @param {number} indent
 * @returns {import('./_search.d').FragmentationSlice[][]}
 * @throws {TypeError} - if indent or position is negative
 */

function fragmentation(text, positions, indent = 0) {
  if (indent < 0) {
    throw new TypeError('Negative indent not allowed');
  }
  return positions
    .sort((a, b) => a[0] - b[0])
    .map(position => {
      if (position[0] < 0 || position[1] < 0) {
        throw new TypeError('Negative position not allowed');
      }
      return position;
    })
    .map(position => ({
      indent: [
        Math.max(0, position[0] - indent),
        Math.min(text.length, position[1] + indent),
      ],
      fragments: [position]
    }))
    .reduce((intersections, fragment, index) => {
      if (index === 0) {
        return [fragment];
      }
      const preIntersection = intersections[intersections.length - 1];
      const [start, end] = fragment.indent;
      if (start >= preIntersection.indent[0] && start <= preIntersection.indent[1]) {
        preIntersection.fragments = preIntersection.fragments.concat(fragment.fragments);
        preIntersection.indent[1] = end;
      } else {
        intersections.push(fragment);
      }
      return intersections;
    }, [])
    .map(intersection => {
      let [start, end] = intersection.indent;
      const slices = intersection.fragments.reduce((slices, positions) => {
        if (start < positions[0]) {
          slices.push({ indent: text.slice(start, positions[0]) });
        }
        slices.push({ fragment: text.slice(positions[0], positions[1]) });
        start = positions[1];
        return slices;
      }, []);
      if (start < end) {
        slices.push({ indent: text.slice(start, end) });
      }
      return slices;
    });
}

/**
 * @param {string} text
 * @param {string[]} stems
 * @returns {import('./_search.d').FoundStems}
 */
function search(text, stems) {
  return stems.reduce((found, stem) => {
    const re = new RegExp(
      `(?<=[^${wordChars}0-9]|^)(${stem}[${wordChars}]*)(?=[^${wordChars}0-9]|$)`,
      'uig'
    );
    found[stem] = found[stem] || [];
    let match = re.exec(text);
    while (match) {
      found[stem].push([match.index, re.lastIndex]);
      match = re.exec(text);
    }
    return found;
  }, {});
}

export { tokenize, stem, search, fragmentation };
