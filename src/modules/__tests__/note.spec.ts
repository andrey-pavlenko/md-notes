import * as path from 'path';
import { init as initRepository } from '../repository';
import { Note } from '../types';
import { load } from '../note';

jest.mock('axios');

describe('Note module', () => {

  beforeAll(async () => {
    require('axios').__set('notes-00', {
      data: {
        base: path.resolve(__dirname, './cases/notes-00'),
      }
    });
    await initRepository('notes-00');
  });

  it('Load notes-00/test1.md', async () => {
    const errorCallback = jest.fn();
    const notes: Note[] = await load('test1.md', errorCallback);
    expect(errorCallback).not.toHaveBeenCalled();
    expect(notes).toHaveLength(1);
    const note = notes[0];
    expect(note.content).toEqual('# Simple note, no meta\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
    expect(note.url).toEqual('test1.md');
    expect(note.meta).toEqual({ title: 'Simple note, no meta' });
  });

  it('Load notes-00/test2.md', async () => {
    const url = 'test2.md';
    const errorCallback = jest.fn();
    const notes: Note[] = await load(url, errorCallback);
    expect(errorCallback).not.toHaveBeenCalled();
    expect(notes).toHaveLength(1);
    const note = notes[0];
    expect(note.url).toEqual(url);
    expect(note.meta).toEqual({ title: 'Simple note' });
    expect(note.content).toEqual(expect.stringContaining('# Simple note, with meta.title\n\nSome text'));
  });

  it('Load notes-00/test2.md', async () => {
    const url = 'test3.md';
    const errorCallback = jest.fn();
    const notes: Note[] = await load(url, errorCallback);
    expect(errorCallback).not.toHaveBeenCalled();
    expect(notes).toHaveLength(1);
    const note = notes[0];
    expect(note.url).toEqual(url);
    expect(note.meta).toEqual({ title: 'Simple note', tags: ['multi', 'meta'] });
    expect(note.content).toEqual(expect.stringContaining('# Simple note, with multiply meta'));
  });

 });

