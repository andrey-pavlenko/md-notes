import { resolve as resolvePath } from 'path';
// import { mockFetchReadFileText } from './utils/mock-fetch';
import mockAxios from 'axios';
import { fetchNote } from '../notes';
import { getToc } from '../toc';

jest.mock('axios');

const casesPath = resolvePath(__dirname, './cases');

describe.skip('TOC module', () => {

  const workPath = resolvePath(casesPath, './toc-00');

  // beforeAll(() => {
  //   window.fetch = jest.fn(p => mockFetchReadFileText(workPath + '/' + p));
  // });

  it('Get TOC: one level', async () => {
    const notes = await Promise.all(['test1.md'].map(n => fetchNote(n)));
    const toc = await getToc(notes);
    expect(toc).toEqual([{ title: 'First item', path: 'test1.md' }]);
  });

  it('Get TOC: nested level', async () => {
    const files = ['test1.md', 'test2.md'];
    const notes = await Promise.all(files.map(n => fetchNote(n)));
    expect(notes.map(n => n.path)).toEqual(files);
    const toc = await getToc(notes);
    expect(toc.map(t => ({ title: t.title, path: t.path }))).toEqual([
      { title: 'First item', path: 'test1.md' },
      { title: 'Second note', path: 'test2.md' }]);
    expect(toc[1].children).toEqual([
      { title: 'Subnote 2-1', path: 'test2-1.md' },
      { title: 'Subnote 2-2', path: 'test2-2.md' }]);
    expect(notes).toHaveLength(4);
    expect(files.concat(['test2-1.md', 'test2-2.md']).sort()).toEqual(notes.map(n => n.path).sort());
  });
  
  it.skip('Get TOC: nested level with missing', async () => {
    const files = ['test1.md', 'test2.md', 'test3.md' ];
    const notes = await Promise.all(files.map(n => fetchNote(n)));
    expect(notes.map(n => n.path)).toEqual(files);
    const toc = await getToc(notes);
    expect(toc.map(t => ({ title: t.title, path: t.path }))).toEqual([
      { title: 'First item', path: 'test1.md' },
      { title: 'Second note', path: 'test2.md' }]);
    expect(toc[1].children).toEqual([
      { title: 'Subnote 2-1', path: 'test2-1.md' },
      { title: 'Subnote 2-2', path: 'test2-2.md' }]);
    expect(notes).toHaveLength(4);
    expect(files.concat(['test2-1.md', 'test2-2.md']).sort()).toEqual(notes.map(n => n.path).sort());
  })
});
