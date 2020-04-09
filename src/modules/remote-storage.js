import options from '../options';

/**
 * @typedef {import('./_types.d').StorageContents} StorageContents
 * @returns {Promise<StorageContents>}
 */
async function loadContents() {
  return new Promise((resolve, reject) => {
    fetch(options.contentsUrl, { cache: 'reload' })
      .then(response => response.json())
      .then(data => {
        let baseUrl = data.base || options.contentsUrl;
        if (!baseUrl.endsWith('/')) {
          baseUrl += '/';
        }
        options.baseUrl = baseUrl;
        resolve(data);
      })
      .catch(reject);
  });
}

/**
 * @param {string} base
 * @param {string} path
 * @returns {string}
 */
function resolveFilePath(base, path) {
  if (/^((?:https?|ftp):)?\/\//i.test(path)) {
    return path;
  }
  if (!base.endsWith('/')) {
    base += '/';
  }
  return base + path;
}

/**
 * @typedef {import('./_types.d').StorageFile} StorageFile
 * @param {string} path
 * @returns {Promise<StorageFile>}
 */
async function loadFile(path) {
  path = path.replace(/^\.*\/([^/])/, '$1');
  const url = resolveFilePath(options.baseUrl, path);
  return new Promise(resolve => {
    fetch(url, { cache: 'reload' })
      .then(response => {
        if (response.status >= 400) {
          resolve({
            url,
            path,
            error: `${response.status}: ${response.statusText}`
          });
        } else {
          return response.text();
        }
      })
      .then(text => {
        resolve({
          url,
          path,
          content: text
        });
      });
  });
}

/**
 * @param {string | string[]} paths
 * @returns {Promise<StorageFile[]>}
 */
async function loadFiles(paths) {
  if (!Array.isArray(paths)) {
    paths = [paths];
  }
  return Promise.all(paths.map(async path => loadFile(path)));
}

export { loadContents, loadFiles };
