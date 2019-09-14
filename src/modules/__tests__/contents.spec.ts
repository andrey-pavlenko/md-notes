import * as path from 'path';
import { init, load } from '../repository';
import { contents, createNote } from '../note';
import { notFoundReason } from './spec-utils';

jest.mock('axios');

describe('Contents', () => {

  beforeAll(async () => {
    require('axios').__set('toc-00', {
      data: {
        base: path.resolve(__dirname, './cases/toc-00'),
      }
    });
    await init('toc-00');
  });


  it('load: one level', async () => {
    const errorCallback = jest.fn();
    const files = ['test1.md'];
    const notes = (await load('test1.md', errorCallback)).map((text, i) => createNote(files[i], text));
    const cnts = await contents(notes, errorCallback);
    expect(cnts).toEqual([{ title: 'First item', url: 'test1.md' }]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('load: nested level', async () => {
    const files = ['test1.md', 'test2.md'];
    const notes = (await load(files)).map((text, i) => createNote(files[i], text));
    expect(notes.map(note => note.url)).toEqual(files);
    const cnts = await contents(notes);
    expect(cnts.map(t => ({ title: t.title, url: t.url }))).toEqual([
      { title: 'First item', url: 'test1.md' },
      { title: 'Second note', url: 'test2.md' }]);
    expect(cnts[1].children).toEqual([
      { title: 'Subnote 2-1', url: 'test2-1.md' },
      { title: 'Subnote 2-2', url: 'test2-2.md' }]);
    expect(notes).toHaveLength(4);
    expect(files.concat(['test2-1.md', 'test2-2.md']).sort())
      .toEqual(notes.map(n => n.url).sort());
  });
  
  it('load: nested level with missing', async () => {
    const files = ['test1.md', 'test2.md', 'test3.md'];
    const errorCallback = jest.fn();
    const notes = (await load(files, errorCallback)).map((text, i) => createNote(files[i], text));
    expect(notes.map(n => n.url)).toEqual(files);
    expect(errorCallback).not.toHaveBeenCalled();
    const cnts = await contents(notes, errorCallback);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual([{
      url: 'test3-2.md',
      reason: notFoundReason
    }]);
    expect(cnts.map(t => ({ title: t.title, url: t.url }))).toEqual([
      { title: 'First item', url: 'test1.md' },
      { title: 'Second note', url: 'test2.md' },
      { title: 'Third note', url: 'test3.md' }]);
    expect(cnts[1].children).toEqual([
      { title: 'Subnote 2-1', url: 'test2-1.md' },
      { title: 'Subnote 2-2', url: 'test2-2.md' }]);
    expect(notes).toHaveLength(6);
    expect(files.concat(['test2-1.md', 'test2-2.md', 'test3-1.md']).sort())
      .toEqual(notes.map(n => n.url).sort());
  })
});
