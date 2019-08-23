import axios from 'axios';

let _base: string;

async function init(url): Promise<string[]> {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        _base = response.data.base;
        if (!_base.endsWith('/')) _base += '/';
        resolve(response.data.files);
      })
      .catch(error => {
        reject(error.response);
      })
  });
};

/**
 * Bad behavior
 * expect(resolve('../test1.md')).toEqual('/notes/test1.md');
 */
function resolve(path: string): string {
  if (path.startsWith('/'))
    return path;
  return _base + path.replace(/^\.*\//, '');
}

export { init, resolve };
