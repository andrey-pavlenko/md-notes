import { Note, Meta } from './types';

const contentsUrl = '/notes/contents.json';

const fetchContents = async function(): Promise<string[]> {
  const response = await fetch(contentsUrl);
  const json = await response.json();
  return json;
};

const fetchNote = async function(url: string): Promise<Note> {
  const response = await fetch(url);
  const text = await response.text();
  return {
    path: url,
    content: text,
    meta: getMeta(text)
  };
};

const getTitle = function(text: string): string | undefined {
  const titleRegex = /^#+\s*([\s\S]*)\n\n/m;
  const match = text.match(titleRegex);
  if (match) return match[1].split('\n').join(' ');
};

const getMetaFromComment = function(text: string): Meta {
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
};

const getMeta = function(text: string): Meta {
  const meta: Meta = getMetaFromComment(text);
  if (!meta.title) {
    const title = getTitle(text);
    if (title) {
      meta.title = title;
    }
  }
  return meta;
};

export { fetchContents, fetchNote };
