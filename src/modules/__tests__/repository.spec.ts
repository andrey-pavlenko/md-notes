import * as path from 'path';
import { init, resolve, load, Note } from '../repository';
import { notFoundReason  } from './spec-utils';

jest.mock('axios');

describe('Repository', () => {

  it('init: no error', async () => {
    const data = {
      base: '/notes',
      files: ['test1.md', 'test2.md', 'test3.md']
    };
    require('axios').__set('test', { data });
    const files = await init('test');
    expect(files).toEqual(data.files);
    require('axios').__unset('test');
  });

  it('init: not found', async () => {
    try {
      await init('test');
    } catch (e) {
      expect(e).toEqual(notFoundReason);
    }
  });

  it('resolve', async () => {
    const data = {
      base: '/notes',
      files: ['test1.md', 'test2.md', 'test3.md']
    };
    require('axios').__set('test', { data });
    await init('test');
    expect(resolve('test1.md')).toEqual('/notes/test1.md');
    expect(resolve('./test1.md')).toEqual('/notes/test1.md');
    expect(resolve('../test1.md')).toEqual('/notes/test1.md');
    expect(resolve('.test1.md')).toEqual('/notes/.test1.md');
    expect(resolve('/test1.md')).toEqual('/test1.md');
    require('axios').__unset('test');
  });

  it('load: many sussess', async () => { 
    const data = {
      base: path.resolve(__dirname, './cases/notes-00')
    };
    require('axios').__set('notes-00', { data });
    const errorCallback = jest.fn();
    await init('notes-00');
    const notes: Note[] = await load(['test1.md', 'test2.md', 'test3.md'], errorCallback);
    expect(errorCallback).not.toHaveBeenCalled();
    expect(notes.length).toBe(3);
    require('axios').__unset('notes-00');
  });

  it('load: many, one error', async () => { 
    const data = {
      base: path.resolve(__dirname, './cases/notes-00')
    };
    require('axios').__set('notes-00', { data });
    const errorCallback = jest.fn();
    await init('notes-00');
    const notes: Note[] = await load(
      ['test1.md', 'test2.md', 'test3.md', 'test99.md'],
      errorCallback
    );
    expect(notes).toHaveLength(3);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual([{
      url: 'test99.md',
      reason: notFoundReason
    }]);
    require('axios').__unset('notes-00');
  });

  it('load: many, all error', async () => { 
    const data = {
      base: path.resolve(__dirname, './cases/notes-99')
    };
    require('axios').__set('notes-99', { data });
    await init('notes-99');
    const files = ['test1.md', 'test2.md', 'test3.md'];
    const errorCallback = jest.fn();
    const notes: Note[] = await load(files, errorCallback);
    expect(notes).toHaveLength(0);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual(files.map(f => ({
      url: f,
      reason: notFoundReason
    })));
    require('axios').__unset('notes-99');
  });

  it('load: one, success', async () => { 
    const data = {
      base: path.resolve(__dirname, './cases/notes-00')
    };
    require('axios').__set('notes-00', { data });
    await init('notes-00');
    const errorCallback = jest.fn();
    const notes: Note[] = await load('test1.md', errorCallback);
    expect(notes).toHaveLength(1);
    expect(errorCallback).not.toHaveBeenCalled();
    require('axios').__unset('notes-00');
  });

  it('load: one, error', async () => {
    const data = {
      base: path.resolve(__dirname, './cases/notes-00'),
    };
    require('axios').__set('notes-00', { data });
    await init('notes-00');
    const errorCallback = jest.fn();
    const notes: Note[] = await load('test99.md', errorCallback);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual([{
      url: 'test99.md',
      reason: notFoundReason
    }]);
    require('axios').__unset('notes-00');
  });

 });

