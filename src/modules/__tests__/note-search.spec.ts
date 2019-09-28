import * as path from 'path';
import * as fs from 'fs';
import { createNote, sentencenize, searchNote } from '../note';

describe('Note indexing', () => {
  it('indexing', () => {
    const text = fs
      .readFileSync(path.resolve(__dirname, './cases/notes-01/archlinux.md'))
      .toString();
    const note = sentencenize(createNote('archlinux.md', text));
    const found = searchNote(note, 'дистрибутив');
    expect(found).toHaveLength(3);
    expect(found.map((f) => f.weigth)).toEqual([1.6923076923076923, 1, 1]);
  });
});
