/**
 * Used source code from the project https://github.com/NaturalNode/natural#stemmers
 */

function attemptReplacePatterns(token: string, patterns: Array<[RegExp, string]>): string {
  let replacement = null;
  let i = 0;
  let isReplaced = false;
  while ((i < patterns.length) && !isReplaced) {
    if (patterns[i][0].test(token)) {
      replacement = token.replace(patterns[i][0], patterns[i][1]);
      isReplaced = true;
    }
    i++;
  }
  return replacement;
}

function perfectiveGerund(token: string): string {
  return attemptReplacePatterns(token, [
    [/[ая]в(ши|шись)$/g, ''],
    [/(ив|ивши|ившись|ывши|ывшись|ыв)$/g, ''],
  ]);
}

function reflexive(token: string): string {
  return attemptReplacePatterns(token, [
    [/(ся|сь)$/g, ''],
  ]);
}

function adjectival(token: string): string {
  let result = adjective(token);
  if (result != null) {
    const pariticipleResult = participle(result);
    result = pariticipleResult ? pariticipleResult : result;
  }
  return result;
}

function adjective(token: string): string {
  return attemptReplacePatterns(token, [
    [/(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$/g, ''],
  ]);
}

function participle(token) {
  return attemptReplacePatterns(token, [
    [/([ая])(ем|нн|вш|ющ|щ)$/g, '$1'],
    [/(ивш|ывш|ующ)$/g, ''],
  ]);
}

function verb(token: string): string {
  return attemptReplacePatterns(token, [
    [/([ая])(ла|на|ете|йте|ли|й|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)$/g, '$1'],
    [/(ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ует|ит|ыт|ены|ить|ыть|ишь|ую|ю)$/g, ''],
  ]);
}

function noun(token: string): string {
  return attemptReplacePatterns(token, [
    // tslint:disable-next-line: max-line-length
    [/(а|ев|ов|ие|ье|е|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$/g, ''],
  ]);
}

function derivational(token: string): string {
  return attemptReplacePatterns(token, [
    [/(ост|ость)$/g, ''],
  ]);
}

function superlative(token: string): string {
  return attemptReplacePatterns(token, [
    [/(ейш|ейше)$/g, ''],
  ]);
}

function stem(token: string): string {
  const volwesRegexp = /^(.*?[аеиоюяуыиэ])(.*)$/g;
  let RV: any = volwesRegexp.exec(token.toLowerCase().replace(/ё/g, 'е'));
  if (!RV || RV.length < 3) {
    return null;
  }
  const head = RV[1];
  RV = RV[2];
  volwesRegexp.lastIndex = 0;
  const R2 = volwesRegexp.exec(RV);
  let result = perfectiveGerund(RV);
  if (result === null) {
    const resultReflexive = reflexive(RV) || RV;
    result = adjectival(resultReflexive);
    if (result === null) {
      result = verb(resultReflexive);
      if (result === null) {
        result = noun(resultReflexive);
        if (result === null) {
          result = resultReflexive;
        }
      }
    }
  }
  result = result.replace(/и$/g, '');
  let derivationalResult = result;
  if (R2 && R2[2]) {
    derivationalResult = derivational(R2[2]);
    if (derivationalResult != null) {
      derivationalResult = derivational(result);
    } else {
      derivationalResult = result;
    }
  }

  let superlativeResult = superlative(derivationalResult) || derivationalResult;

  superlativeResult = superlativeResult.replace(/(н)н/g, '$1');
  superlativeResult = superlativeResult.replace(/ь$/g, '');
  return head + superlativeResult;
}

export { stem };
