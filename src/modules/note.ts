import { load as loadRepository } from './repository';
import { Meta, Note, ErrorCallback } from './types';

function load(
  target: string | string[],
  errorCallback?: ErrorCallback
): Promise<Note[]> {
  return new Promise(resolve => {
    loadRepository(target, errorCallback).then(notes => {
      resolve(
        notes.map(n => {
          n.meta = getMeta(n.content);
          return n;
        })
      );
    });
  });
}

function getTitle(text: string): string | undefined {
  const titleRegex = /^#+\s*([\s\S]*?)\n\n/m;
  const match = text.match(titleRegex);
  if (match) return match[1].split('\n').join(' ');
}

function getMetaFromComment(text: string): Meta {
  const metaRegex = /^<!-{2,3}\s*(\{[\s\S]*\})\s*-->$/;
  return Object.assign(
    {},
    ...text
      .split(/(<!-{2,3}[\s\S]*?-->)/)
      .filter(s => metaRegex.test(s))
      .map(s => {
        try {
          return JSON.parse(s.replace(metaRegex, '$1'));
        } catch {
          return {};
        }
      })
  );
}

function getMeta(text: string): Meta {
  const meta: Meta = getMetaFromComment(text);
  if (!meta.title) {
    const title = getTitle(text);
    if (title) {
      meta.title = title;
    }
  }
  return meta;
}

export { load };
