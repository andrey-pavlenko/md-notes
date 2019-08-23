import { init, resolve } from '../repository';

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
  });

  it('init: not found', async () => {
    require('axios').__unset('test');
    try {
      await init('test');
    } catch (e) {
      expect(e.status).toEqual(404);
      expect(e.statusText).toEqual('Not found');
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
  });

 });

