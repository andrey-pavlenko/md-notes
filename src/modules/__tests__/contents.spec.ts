import * as path from 'path';
import { init as initRepository } from '../repository';
import { load as loadNote } from '../note';
import { load as loadContents } from '../contents';
import { notFoundReason } from './spec-utils';

jest.mock('axios');

describe('Contents', () => {

  beforeAll(async () => {
    require('axios').__set('toc-00', {
      data: {
        base: path.resolve(__dirname, './cases/toc-00'),
      }
    });
    await initRepository('toc-00');
  });


  it('load: one level', async () => {
    const errorCallback = jest.fn();
    const notes = await loadNote('test1.md', errorCallback);
    const contents = await loadContents(notes, errorCallback);
    expect(contents).toEqual([{ title: 'First item', url: 'test1.md' }]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('load: nested level', async () => {
    const files = ['test1.md', 'test2.md'];
    const notes = await loadNote(files);
    expect(notes.map(n => n.url)).toEqual(files);
    const contents = await loadContents(notes);
    expect(contents.map(t => ({ title: t.title, url: t.url }))).toEqual([
      { title: 'First item', url: 'test1.md' },
      { title: 'Second note', url: 'test2.md' }]);
    expect(contents[1].children).toEqual([
      { title: 'Subnote 2-1', url: 'test2-1.md' },
      { title: 'Subnote 2-2', url: 'test2-2.md' }]);
    expect(notes).toHaveLength(4);
    expect(files.concat(['test2-1.md', 'test2-2.md']).sort())
      .toEqual(notes.map(n => n.url).sort());
  });
  
  it('load: nested level with missing', async () => {
    const files = ['test1.md', 'test2.md', 'test3.md'];
    const errorCallback = jest.fn();
    const notes = await loadNote(files, errorCallback);
    expect(notes.map(n => n.url)).toEqual(files);
    expect(errorCallback).not.toHaveBeenCalled();
    const contents = await loadContents(notes, errorCallback);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual([{
      url: 'test3-2.md',
      reason: notFoundReason
    }]);
    expect(contents.map(t => ({ title: t.title, url: t.url }))).toEqual([
      { title: 'First item', url: 'test1.md' },
      { title: 'Second note', url: 'test2.md' },
      { title: 'Third note', url: 'test3.md' }]);
    expect(contents[1].children).toEqual([
      { title: 'Subnote 2-1', url: 'test2-1.md' },
      { title: 'Subnote 2-2', url: 'test2-2.md' }]);
    expect(notes).toHaveLength(6);
    expect(files.concat(['test2-1.md', 'test2-2.md', 'test3-1.md']).sort())
      .toEqual(notes.map(n => n.url).sort());
  })
});
