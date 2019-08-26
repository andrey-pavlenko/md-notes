import { Note, ErrorCallback, ContentsItem } from './types';
import { load as loadNote } from './note';

function findOrLoadhNote(
  url: string,
  notesRef: Note[],
  errorCallback?: ErrorCallback
): Promise<Note> {
  const exists = notesRef.find(n => n.url === url);
  if (exists) {
    return Promise.resolve(exists);
  } else {
    return new Promise(resolve => {
      loadNote(url, errorCallback).then(notes => {
        notes.forEach(n => notesRef.push(n));
        resolve(notes[0]);
      });
    });
  }
}

function getItem(
  note: Note,
  notesRef: Note[],
  errorCallback?: ErrorCallback
): Promise<ContentsItem> {
  const item: ContentsItem = {
    title: note.meta.title || note.url,
    url: note.url
  };
  if (note.meta.children && note.meta.children.length) {
    return new Promise(resolve => {
      Promise.all(
        note.meta.children.map(c => findOrLoadhNote(c, notesRef, errorCallback))
      ).then(children => {
        Promise.all(
          children
            .filter(n => !!n)
            .map(n => getItem(n, notesRef, errorCallback))
        ).then(i => {
          item.children = i;
          resolve(item);
        });
      });
    });
  }
  return Promise.resolve(item);
}

function load(
  notesRef: Note[],
  errorCallback?: ErrorCallback
): Promise<ContentsItem[]> {
  return Promise.all(notesRef.map(n => getItem(n, notesRef, errorCallback)));
}

export { load };
