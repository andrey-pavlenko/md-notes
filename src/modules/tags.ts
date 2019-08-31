import { Note, TagItem } from './types';

function load(notes: Note[]): TagItem[] {
  const tags: TagItem[] = [];

  notes.forEach(n => {
    if (n.meta.tags && n.meta.tags.length) {
      n.meta.tags.forEach(t => {
        const tag: TagItem = tags.find(tag => tag.label === t);
        if (tag) {
          tag.count += 1;
        } else {
          tags.push({
            label: t,
            count: 1
          });
        }
      });
    }
  });
  return tags;
}

function notesByTag(notes: Note[], tag: string): Note[] {
  return notes.filter(n => n.meta.tags && n.meta.tags.includes(tag));
}

export { load, notesByTag };
