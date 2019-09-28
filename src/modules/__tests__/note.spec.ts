import * as path from 'path';
import { init, load } from '../repository';
import { createNote } from '../note';
import { notFoundReason } from './spec-utils/index';

jest.mock('axios');

describe('Note loading', () => {
  beforeAll(async () => {
    require('axios').__set('notes-00', {
      data: {
        base: path.resolve(__dirname, './cases/notes-00'),
      },
    });
    await init('notes-00');
  });

  it('Load notes-00/test1.md', async () => {
    const url = 'test1.md';
    const errorCallback = jest.fn();
    const note = createNote(url, (await load(url, errorCallback))[0]);
    expect(errorCallback).not.toHaveBeenCalled();
    expect(note.content).toEqual('# Simple note, no meta\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
    expect(note.url).toEqual(url);
    expect(note.meta).toEqual({ title: 'Simple note, no meta' });
  });

  it('Load notes-00/test2.md', async () => {
    const url = 'test2.md';
    const errorCallback = jest.fn();
    const note = createNote(url, (await load(url, errorCallback))[0]);
    expect(errorCallback).not.toHaveBeenCalled();
    expect(note.url).toEqual(url);
    expect(note.meta).toEqual({ title: 'Simple note' });
    expect(note.content).toEqual(expect.stringContaining('# Simple note, with meta.title\n\nSome text'));
  });

  it('Load notes-00/test2.md', async () => {
    const url = 'test3.md';
    const errorCallback = jest.fn();
    const note = createNote(url, (await load(url, errorCallback))[0]);
    expect(errorCallback).not.toHaveBeenCalled();
    expect(note.url).toEqual(url);
    expect(note.meta).toEqual({ title: 'Simple note', tags: ['multi', 'meta'] });
    expect(note.content).toEqual(expect.stringContaining('# Simple note, with multiply meta'));
  });

  it('Load notes-00/test99.md -- not exists', async () => {
    const url = 'test99.md';
    const errorCallback = jest.fn();
    const note = createNote(url, (await load(url, errorCallback))[0]);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual([{
      url,
      reason: notFoundReason,
    }]);
    expect(note).toBeNull();
  });
 });
