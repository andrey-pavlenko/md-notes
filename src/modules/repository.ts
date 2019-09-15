import axios from 'axios';
import { LoadError } from './repository.d';

const REQUEST_TIMEOUT = 10000;

let _contentsUrl: string = '';
let _baseUrl: string = '';

function contentsUrl(): string {
  return _contentsUrl;
}

function baseUrl(): string {
  return _baseUrl;
}

/**
 * Response should be JSON {
 *   base: '/some/base/url',
 *   files: ['file-01.md', 'file-02.md']
 * }
 * @param url: string
 * @throws axios errors
 */
async function init(url: string): Promise<string[]> {
  const response = await axios.get(url, {
    timeout: REQUEST_TIMEOUT
  });
  _contentsUrl = url;
  let baseUrl = response.data.base || '';
  if (!baseUrl.endsWith('/')) baseUrl += '/';
  _baseUrl = baseUrl;
  return response.data.files || [];
}

/**
 * Bad behavior
 * expect(resolve('../test1.md')).toEqual('/notes/test1.md');
 */
function resolve(path: string): string {
  if (path.startsWith('/')) return path;
  return _baseUrl + path.replace(/^\.*\//, '');
}

class RepositoryLoadError {
  reason: any;
  constructor(reason: any) {
    this.reason = reason;
  }
}

/**
 * Resolves relativeUrls with #resolve, load all, if any file error
 * null placed to results => ['content', null, 'content']
 * @param relativeUrls: string | string []
 * @param errorsCallback: function (errors: LoadError[])
 * @throws Nothing
 */
async function load(
  relativeUrls: string | string[],
  errorsCallback?: (errors: LoadError[]) => void
): Promise<string[]> {
  const urls = Array.prototype.concat(relativeUrls);
  return new Promise(resolvePromise => {
    Promise.all(
      urls
        .map(url => axios.get(resolve(url), { timeout: REQUEST_TIMEOUT }))
        .map(promise =>
          promise.catch(error => new RepositoryLoadError(error.response))
        )
    ).then(results => {
      const datas: string[] = [];
      const errors = [];
      results.forEach((result, idx) => {
        if (result instanceof RepositoryLoadError) {
          errors.push({
            url: urls[idx],
            reason: result.reason
          });
          datas.push(null);
        } else {
          datas.push(result.data);
        }
      });
      if (errors.length && errorsCallback) errorsCallback(errors);
      resolvePromise(datas);
    });
  });
}

export { init, resolve, load, contentsUrl, baseUrl };
