import axios from 'axios';

interface Success {
  url: string,
  content: any
};

interface Error {
  url: string,
  reason: any
}

interface Results {
  success: Success[],
  error?: Error[]
}

let _base: string;

function init(url): Promise<string[]> {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        _base = response.data.base || '';
        if (!_base.endsWith('/')) _base += '/';
        resolve(response.data.files || []);
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
  if (_base) {
    if (path.startsWith('/'))
      return path;
    return _base  + path.replace(/^\.*\//, '');
  } else {
    return path;
  }
}

function load(target: string | string[]): Promise<Results> {
  const resolvePath = resolve;

  class ErrorLoad {
    readonly reason: any;

    constructor(reason: any) {
      this.reason = reason;
    }
   };

  return new Promise(resolve => {
    const targets: string[] = Array.prototype.concat(target);
    Promise.all(
      targets
        .map(t => axios.get(resolvePath(t)))
        .map(p => p.catch(e => new ErrorLoad(e.response)))
    ).then(rs => {
      const results: Results = {
        success: []
      };
      rs.forEach((r, i) => {
        if (r instanceof ErrorLoad) {
          const error: Error = {
            url: targets[i],
            reason: r.reason
          };
          if (!results.error) {
            results.error = [error];
          } else {
            results.error.push(error);
          }
        } else {
          const success: Success = {
            url: targets[i],
            content: r
          };
          results.success.push(success);
        }
      });
      resolve(results);
    });
  });
}

export { init, resolve, load, Results };
