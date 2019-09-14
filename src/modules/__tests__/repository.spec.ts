import * as path from 'path';
import { Repository } from '../repository';
import { notFoundReason  } from './spec-utils';

jest.mock('axios');

describe('Repository', () => {

  it('contents: no error', async () => {
    const data = {
      base: '/notes',
      files: ['test1.md', 'test2.md', 'test3.md']
    };
    const url = 'http://test.com';
    require('axios').__set(url, { data });
    const repository = new Repository();
    const files = await repository.init(url);
    expect(files).toEqual(data.files);
    expect(repository.files).toEqual(data.files);
    expect(repository.baseUrl).toEqual(data.base + '/');
    expect(repository.contentsUrl).toEqual(url);
    require('axios').__unset(url);
  });

  it('contents: not found', async () => {
    const repository = new Repository();
    try {
      await repository.init('http://test.com');
      fail('No exception');
    } catch (e) {
      expect(e.response).toEqual(notFoundReason);
    }
  });

  it('contents: reload contents and fail', async () => {
    const data = {
      base: '/notes/',
      files: ['test1.md', 'test2.md', 'test3.md']
    };
    const url = 'http://test.com';
    require('axios').__set(url, { data });
    const repository = new Repository();
    // Success load
    await repository.init(url);
    expect(repository.files).toEqual(data.files);
    expect(repository.baseUrl).toEqual(data.base);
    expect(repository.contentsUrl).toEqual(url);
    require('axios').__unset(url);
    // Load fail
    try {
      await repository.init(url);
      fail('No exception');
    } catch (e) {
      expect(e.response).toEqual(notFoundReason);
      expect(repository.files).toEqual(data.files);
      expect(repository.baseUrl).toEqual(data.base);
      expect(repository.contentsUrl).toEqual(url);
    }
  });

  it('resolve', async () => {
    const url = 'http://notes.com';
    const data = {
      base: '/notes',
      files: ['test1.md', 'test2.md', 'test3.md']
    };
    require('axios').__set(url, { data });
    const repository = new Repository();
    await repository.init(url);
    expect(repository.resolve('test1.md')).toEqual('/notes/test1.md');
    expect(repository.resolve('./test1.md')).toEqual('/notes/test1.md');
    expect(repository.resolve('../test1.md')).toEqual('/notes/test1.md');
    expect(repository.resolve('.test1.md')).toEqual('/notes/.test1.md');
    expect(repository.resolve('/test1.md')).toEqual('/test1.md');
    require('axios').__unset(url);
  });

  it('load: many sussess', async () => { 
    const url = 'http://notes.com/notes-00';
    const data = {
      base: path.resolve(__dirname, './cases/notes-00'),
      files: ['test1.md', 'test2.md', 'test3.md']
    };
    require('axios').__set(url, { data });
    const errorCallback = jest.fn();
    const repository = new Repository();
    await repository.init(url);
    const results: string[] = await repository.load(data.files, errorCallback);
    expect(results).toHaveLength(data.files.length);
    results.forEach(result => expect(typeof result).toBe('string'));
    expect(errorCallback).not.toHaveBeenCalled();
    require('axios').__unset(url);
  });

  it('load: many, one error', async () => { 
    const url = 'http://notes.com/notes-00';
    const data = {
      base: path.resolve(__dirname, './cases/notes-00'),
      files: ['test1.md', 'test2.md', 'test3.md', 'test99.md']
    };
    require('axios').__set(url, { data });
    const errorCallback = jest.fn();
    const repository = new Repository();
    await repository.init(url);
    const results: string[] = await repository.load(data.files, errorCallback);
    expect(results).toHaveLength(data.files.length);
    results.slice(0, -1).forEach(result => expect(typeof result).toBe('string'));
    results.slice(-1).forEach(result => expect(result).toBeNull());
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual([{
      url: data.files[3],
      reason: notFoundReason
    }]);
    require('axios').__unset(url);
  });

  it('load: many, all error', async () => { 
    const url = 'http://notes.com/notes-99';
    const data = {
      base: path.resolve(__dirname, './cases/notes-99'),
      files: ['test1.md', 'test2.md', 'test3.md', 'test4.md']
    };
    require('axios').__set(url, { data });
    const errorCallback = jest.fn();
    const repository = new Repository();
    await repository.init(url);
    const results: string[] = await repository.load(data.files, errorCallback);
    expect(results).toHaveLength(data.files.length);
    results.forEach(result => expect(result).toBeNull());
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual(data.files.map(file => ({
      url: file,
      reason: notFoundReason
    })));
    require('axios').__unset(url);
  });

  it('load: one, success', async () => { 
    const url = 'http://notes.com/notes-00';
    const data = {
      base: path.resolve(__dirname, './cases/notes-00')
    };
    require('axios').__set(url, { data });
    const errorCallback = jest.fn();
    const repository = new Repository();
    await repository.init(url);
    const results: string[] = await repository.load('test1.md', errorCallback);
    expect(results).toHaveLength(1);
    expect(typeof results[0]).toEqual('string');
    expect(errorCallback).not.toHaveBeenCalled();
    require('axios').__unset(url);
  });

  it('load: one, error', async () => {
    const url = 'http://notes.com/notes-00';
    const data = {
      base: path.resolve(__dirname, './cases/notes-00')
    };
    require('axios').__set(url, { data });
    const errorCallback = jest.fn();
    const repository = new Repository();
    await repository.init(url);
    const results: string[] = await repository.load('test99.md', errorCallback);
    expect(results).toHaveLength(1);
    expect(results[0]).toBeNull();
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback.mock.calls[0][0]).toEqual([{
      url: 'test99.md',
      reason: notFoundReason
    }]);
    require('axios').__unset(url);
  });

 });

