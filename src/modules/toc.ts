import { TocItem, Note } from './types';
import { fetchNote } from './notes';

const findOrFetchNote = async function(
  path: string,
  notesRef: Note[]
): Promise<Note> {
  const exists = notesRef.find(n => n.path === path);
  if (exists) {
    return Promise.resolve(exists);
  } else {
    const fetched = await fetchNote(path);
    notesRef.push(fetched);
    return fetched;
  }
};

const getTocItem = async function(
  note: Note,
  notesRef: Note[]
): Promise<TocItem> {
  const item: TocItem = {
    title: note.meta.title || note.path,
    path: note.path
  };
  if (note.meta.children && note.meta.children.length) {
    const childrenNotes = await Promise.all(
      note.meta.children.map(p => findOrFetchNote(p, notesRef))
    );
    item.children = await Promise.all(
      childrenNotes.map(n => getTocItem(n, notesRef))
    );
  }
  return item;
};

const getToc = async function(notesRef: Note[]): Promise<TocItem[]> {
  return await Promise.all(notesRef.map(n => getTocItem(n, notesRef)));
};

export { getToc };
