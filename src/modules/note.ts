interface Note {
  url: string,
  content: any,
  meta: Meta,
  html?: string
};

interface Meta {
  title?: string,
  tags?: string[],
  related?: string[],
  children?: string[]
};

interface TagItem {
  label: string,
  count: number
};

interface ContentsItem {
  title: string,
  url: string,
  children?: ContentsItem[]
};

function createNote(url: string, content: string): Note | null {
  return content === null ? null : {
    url: url,
    content: content,
    meta: createMeta(content)
  };
}

function createMeta(content: string): Meta | undefined {
  const meta: Meta = getMetaFromComment(content);
  if (!meta.title) {
    const title = getTitle(content);
    if (title) {
      meta.title = title;
    }
  }
  return meta;
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

function tags(notes: Note[]): TagItem[] {
  const tags: TagItem[] = [];

  notes
    .filter(note => note !== null)
    .forEach(note => {
      if (note.meta.tags && note.meta.tags.length) {
        note.meta.tags.forEach(t => {
          const tag: TagItem = tags.find(tag => tag.label === t);
          if (tag) {
            tag.count += 1;
          } else {
            tags.push({
              label: t,
              count: 1,
            });
          }
        });
      }
    });
  return tags;
}

function notesByTag(notes: Note[], tag: string): Note[] {
  return notes.filter(note => note && note.meta && note.meta.tags && note.meta.tags.includes(tag));
}

export { Note, Meta, TagItem, ContentsItem, createNote, tags, notesByTag };
