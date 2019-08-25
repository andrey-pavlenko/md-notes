import axios from 'axios';
import { Meta } from './note';

interface Note {
  url: string,
  content: any,
  meta?: Meta,
  html?: string
};

interface Error {
  url: string,
  reason: any
};

type ErrorCallback = (errors: Error[]) => void;

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

function load(target: string | string[], errorCallback?: ErrorCallback): Promise<Note[]> {
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
    ).then(results => {
      const notes: Note[] = [];
      const errors: Error[] = [];
      results.forEach((r, i) => {
        if (r instanceof ErrorLoad) {
          errors.push({
            url: targets[i],
            reason: r.reason
          });
        } else {
          const note: Note = {
            url: targets[i],
            content: r
          };
          notes.push(note);
        }
      });
      if (errorCallback && errors.length) {
        errorCallback(errors);
      }
      resolve(notes);
    });
  });
}

export { init, resolve, load, Note, Error, ErrorCallback };
