import { TextDecoder } from 'util';
import Note from './note';
import { makeNoteContent } from './mock-fetch';
import { readNotes, writeNotes } from './cache-storage';

let localStorageSetItem = Storage.prototype.setItem;
let localStorageGetItem = Storage.prototype.getItem;
let localStorageRemoveItem = Storage.prototype.removeItem;
let mockLocalStorage = {};

describe('Cache storage', () => {
  beforeAll(() => {
    Storage.prototype.setItem = jest.fn(
      (key, value) => (mockLocalStorage[key] = value)
    );
    Storage.prototype.getItem = jest.fn(key => mockLocalStorage[key]);
    Storage.prototype.removeItem = jest.fn(
      key => delete mockLocalStorage[key]
    );
    // eslint-disable-next-line no-undef
    global.TextDecoder = TextDecoder;
  });

  afterAll(() => {
    Storage.prototype.setItem = localStorageSetItem;
    Storage.prototype.getItem = localStorageGetItem;
    Storage.prototype.removeItem = localStorageRemoveItem;
    // eslint-disable-next-line no-undef
    delete global.TextDecoder;
  });

  beforeEach(() => {
    mockLocalStorage = {};
  });

  it('write and read normal notes', () => {
    const notes = Array(10)
      .fill({
        url: 'https://repo.com/notes/test.md',
        path: 'test.md',
        content: makeNoteContent(
          {
            tags: 'tag',
            children: 'child.md',
            related: 'related.md'
          },
          `# Заголовок

Текст
`
        )
      })
      .map(info => new Note(info));
    writeNotes(notes.map(note => note.serialize()));
    expect(Object.keys(mockLocalStorage)).toHaveLength(1);
    const readedNotes = readNotes();
    expect(readedNotes.length).toEqual(notes.length);
    readedNotes.map(note => {
      expect(note.url).toEqual('https://repo.com/notes/test.md');
      expect(note.path).toEqual('test.md');
      expect(note.content).toEqual(notes[0].content);
    });
  });

  it('write and read normal note, write empty for clear', () => {
    const note = new Note({
      url: 'https://repo.com/notes/test.md',
      path: 'test.md',
      content: makeNoteContent(
        {
          tags: 'tag',
          children: 'child.md',
          related: 'related.md'
        },
        `# Заголовок

Текст
`
      ),
      isRootTocItem: true
    });
    writeNotes([note.serialize()]);
    expect(Object.keys(mockLocalStorage)).toHaveLength(1);
    const readedNotes = readNotes();
    expect(readedNotes.length).toEqual(1);
    expect(readedNotes[0].url).toEqual(
      'https://repo.com/notes/test.md'
    );
    expect(readedNotes[0].path).toEqual('test.md');
    expect(readedNotes[0].content).toEqual(note.content);
    expect(readedNotes[0].isRootTocItem).toBeTruthy();
    writeNotes([]);
    expect(Object.keys(mockLocalStorage)).toHaveLength(0);
    expect(readNotes()).toBeUndefined();
  });

  it('read brocken compressed', () => {
    const note = new Note({
      url: 'https://repo.com/notes/test.md',
      path: 'test.md',
      content: makeNoteContent(
        {
          tags: 'tag',
          children: 'child.md',
          related: 'related.md'
        },
        `# Заголовок

Текст
`
      ),
      isRootTocItem: true
    });
    writeNotes([note.serialize()]);
    expect(Object.keys(mockLocalStorage)).toHaveLength(1);
    mockLocalStorage[Object.keys(mockLocalStorage)[0]] = 'Test';
    const originalError = console.error;
    console.error = jest.fn();
    const readedNotes = readNotes();
    expect(readedNotes).toBeUndefined();
    expect(console.error).toHaveBeenCalled();
    console.error = originalError;
  });
});
