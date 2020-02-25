import { loadContents, loadFiles } from './remote-storage';
import {
  mockFecth,
  unmockFecth,
  clearResponses,
  setResponseJson,
  setResponseText,
  mockedFecth
} from './mock-fetch';
import options from '../options';

const optionsContentsUrl = options.contentsUrl;

describe('RemoteStorage', () => {
  beforeAll(() => {
    options.contentsUrl = 'https://repo.com';
    mockFecth();
  });
  afterAll(() => {
    unmockFecth();
    options.contentsUrl = optionsContentsUrl;
  });
  beforeEach(clearResponses);

  it('resolveFilePath with base ends "/"', async () => {
    const contents = {
      base: 'https://repo.com/notes/',
      files: []
    };
    setResponseJson(options.contentsUrl, contents);
    expect(await loadContents()).toEqual(contents);
    setResponseText(contents.base + 'test.md', 'File content');
    setResponseText('/test.md', 'File content');
    const loadedFile = {
      url: 'https://repo.com/notes/test.md',
      path: 'test.md',
      content: 'File content'
    };
    expect(await loadFiles('test.md')).toEqual([
      expect.objectContaining(loadedFile)
    ]);
    expect(
      await loadFiles([
        './test.md',
        '../test.md',
        'test.md',
        '/test.md'
      ])
    ).toEqual(Array(4).fill(expect.objectContaining(loadedFile)));
  });

  it('resolveFilePath with base not ends "/"', async () => {
    const contents = {
      base: 'https://repo.com/notes',
      files: []
    };
    setResponseJson(options.contentsUrl, contents);
    expect(await loadContents()).toEqual(contents);
    setResponseText(contents.base + '/test.md', 'File content');
    setResponseText('/test.md', 'File content');
    const loadedFile = {
      url: 'https://repo.com/notes/test.md',
      path: 'test.md',
      content: 'File content'
    };
    expect(await loadFiles('test.md')).toEqual([
      expect.objectContaining(loadedFile)
    ]);
    expect(
      await loadFiles([
        './test.md',
        '../test.md',
        'test.md',
        '/test.md'
      ])
    ).toEqual(Array(4).fill(expect.objectContaining(loadedFile)));
  });

  it('loadContents without base', async () => {
    const contents = {
      files: []
    };
    setResponseJson(options.contentsUrl, contents);
    await loadContents();
    mockedFecth.mockClear();
    setResponseText(options.contentsUrl + '/test.md', 'File content');
    await loadFiles('test.md');
    expect(mockedFecth.mock.calls[0][0]).toEqual(
      options.contentsUrl + '/test.md'
    );
  });

  it('resolveFilePath path contains url', async () => {
    const contents = {
      files: []
    };
    setResponseJson(options.contentsUrl, contents);
    await loadContents();
    mockedFecth.mockClear();
    setResponseText('http://google.com/test.md', 'File content');
    await loadFiles('http://google.com/test.md');
    expect(mockedFecth.mock.calls[0][0]).toEqual(
      'http://google.com/test.md'
    );
    mockedFecth.mockClear();
    setResponseText('https://google.com/test.md', 'File content');
    await loadFiles('https://google.com/test.md');
    expect(mockedFecth.mock.calls[0][0]).toEqual(
      'https://google.com/test.md'
    );
    mockedFecth.mockClear();
    setResponseText('ftp://google.com/test.md', 'File content');
    await loadFiles('ftp://google.com/test.md');
    expect(mockedFecth.mock.calls[0][0]).toEqual(
      'ftp://google.com/test.md'
    );
    mockedFecth.mockClear();
    setResponseText('//google.com/test.md', 'File content');
    await loadFiles('//google.com/test.md');
    expect(mockedFecth.mock.calls[0][0]).toEqual(
      '//google.com/test.md'
    );
  });
});
