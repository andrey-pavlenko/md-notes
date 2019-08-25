import * as path from 'path';
import { init, resolve, load, Results } from '../repository';
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
    await init('notes-00');
    const results: Results = await load(['test1.md', 'test2.md', 'test3.md']);
    expect(results).not.toHaveProperty('errors');
    expect(Array.isArray(results.notes)).toBeTruthy();
    expect(results.notes.length).toBe(3);
    require('axios').__unset('notes-00');
  });

  it('load: many, one error', async () => { 
    const data = {
      base: path.resolve(__dirname, './cases/notes-00')
    };
    require('axios').__set('notes-00', { data });
    await init('notes-00');
    const results: Results = await load(['test1.md', 'test2.md', 'test3.md', 'test99.md']);
    expect(results.errors).toEqual([{
      url: 'test99.md',
      reason: notFoundReason
    }]);
    expect(Array.isArray(results.notes)).toBeTruthy();
    expect(results.notes.length).toBe(3);
    require('axios').__unset('notes-00');
  });

  it('load: many, all error', async () => { 
    const data = {
      base: path.resolve(__dirname, './cases/notes-99')
    };
    require('axios').__set('notes-99', { data });
    await init('notes-99');
    const files = ['test1.md', 'test2.md', 'test3.md'];
    const results: Results = await load(files);
    expect(results.errors).toEqual(files.map(f => ({
      url: f,
      reason: notFoundReason
    })));
    expect(Array.isArray(results.notes)).toBeTruthy();
    expect(results.notes.length).toBe(0);
    require('axios').__unset('notes-99');
  });

  it('load: one, success', async () => { 
    const data = {
      base: path.resolve(__dirname, './cases/notes-00')
    };
    require('axios').__set('notes-00', { data });
    await init('notes-00');
    const results: Results = await load('test1.md');
    expect(results).not.toHaveProperty('errors');
    expect(Array.isArray(results.notes)).toBeTruthy();
    expect(results.notes.length).toBe(1);
    require('axios').__unset('notes-00');
  });

  it('load: one, error', async () => {
    const data = {
      base: path.resolve(__dirname, './cases/notes-00'),
    };
    require('axios').__set('notes-00', { data });
    await init('notes-00');
    const results: Results = await load('test99.md');
    expect(results.errors).toEqual([{
      url: 'test99.md',
      reason: notFoundReason
    }]);
    expect(Array.isArray(results.notes)).toBeTruthy();
    expect(results.notes.length).toBe(0);
    require('axios').__unset('notes-00');
  });

 });

