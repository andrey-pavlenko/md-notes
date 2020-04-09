import Pako from 'pako';

const localStorageKey = 'cachedNotes';

/**
 * @param {string} str
 */
function compress(str) {
  const uint8 = Pako.deflate(str);
  return btoa(String.fromCharCode.apply(null, uint8));
}

/**
 * @param {string} str
 */
function decompress(str) {
  const decoder = new TextDecoder();
  return decoder.decode(Pako.inflate(atob(str)));
}

/**
 * @returns {import('./_types.d').CacheNote[]}
 */
function readNotes() {
  const cachedNotes = localStorage.getItem(localStorageKey);
  if (cachedNotes != null) {
    try {
      const decompressed = decompress(cachedNotes);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('readNotes error:', error);
    }
  }
}

/**
 * @param {import('./_types.d').CacheNote[]} cacheNotes
 */
function writeNotes(cacheNotes) {
  if (Array.isArray(cacheNotes) && cacheNotes.length) {
    const compressed = compress(JSON.stringify(cacheNotes));
    localStorage.setItem(localStorageKey, compressed);
  } else {
    localStorage.removeItem(localStorageKey);
  }
}

export { readNotes, writeNotes };
