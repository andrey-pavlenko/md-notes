import { resolve as resolvePath } from 'path';
import { mockFetchReadFileText } from './utils/mock-fetch';
import { fetchNote } from '../notes';

const casesPath = resolvePath(__dirname, './cases');

describe('Notes module', () => {

  const workPath = resolvePath(casesPath, './notes-00');

  beforeAll(() => {
    window.fetch = jest.fn(p => mockFetchReadFileText(workPath + '/' + p));
  });

  it('Fetch notes-00/test1.md', async () => {
    const path = 'test1.md';
    const note = await fetchNote(path);
    expect(note.path).toEqual(path);
    expect(note.meta).toEqual({ title: 'Simple note, no meta' });
    expect(note.content).toEqual('# Simple note, no meta\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
  });

  it('Fetch notes-00/test2.md', async () => {
    const path = 'test2.md';
    const note = await fetchNote(path);
    expect(note.path).toEqual(path);
    expect(note.meta).toEqual({ title: 'Simple note' });
    expect(note.content).toEqual(expect.stringContaining('# Simple note, with meta.title\n\nSome text'));
  });

  it('Fetch notes-00/test2.md', async () => {
    const path = 'test3.md';
    const note = await fetchNote(path);
    expect(note.path).toEqual(path);
    expect(note.meta).toEqual({ title: 'Simple note', tags: ['multi', 'meta'] });
    expect(note.content).toEqual(expect.stringContaining('# Simple note, with multiply meta'));
  });

 });

