import axios from 'axios';

const REQUEST_TIMEOUT = 10000;

class RepositoryLoadError {
  constructor(public reason: any) {}
};

interface LoadError {
  url: string,
  reason: any
};

class Repository {
  private _contentsUrl: string = '';
  private _baseUrl: string = '';
  private _files: string[] = [];

  /**
   * Response should be JSON {
   *   base: '/some/base/url',
   *   files: ['file-01.md', 'file-02.md']
   * }
   * @param url: string
   * @throws axios errors
   */
  public async init(url: string): Promise<string[]> {
    const response = await axios.get(url, {
      timeout: REQUEST_TIMEOUT
    });
    this._contentsUrl = url;
    let baseUrl = response.data.base || '';
    if (!baseUrl.endsWith('/')) baseUrl += '/';
    this._baseUrl = baseUrl;
    this._files = response.data.files || [];
    return this._files;
  }

  get contentsUrl(): string {
    return this._contentsUrl;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  get files(): string[] {
    return this._files;
  }
  
  /**
   * Bad behavior
   * expect(resolve('../test1.md')).toEqual('/notes/test1.md');
   */
  resolve(path: string): string {
    if (path.startsWith('/')) return path;
    return this.baseUrl + path.replace(/^\.*\//, '');
  }

  /**
   * Resolves relativeUrls with #resolve, load all, if any file error 
   * null placed to results => ['content', null, 'content']
   * @param relativeUrls: string | string []
   * @param errorsCallback: function (errors: LoadError[])
   * @throws Nothing
   */
  async load(relativeUrls: string | string[], errorsCallback?: (errors: LoadError[]) => void): Promise<string[]> {
    const urls = Array.prototype.concat(relativeUrls);
    return new Promise(resolve => { 
      Promise.all(urls
        .map(url => axios.get(this.resolve(url), { timeout: REQUEST_TIMEOUT }))
        .map(promise => promise.catch(error => new RepositoryLoadError(error.response)))
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
        resolve(datas);
      });
    });
  }
};

export { Repository, LoadError };
