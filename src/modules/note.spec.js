import Note from './note';
import { makeNoteContent } from './mock-fetch';

/**
 * @type {import('./_types').NoteInfo}
 * @type {import('./_types').NoteMeta}
 */

describe('Note', () => {
  it('no errors, check title, tags, children, related', () => {
    /** @type {NoteMeta} */
    const meta = {
      title: 'Simple note',
      tags: ['test', 'note'],
      children: 'sub/subnote.md',
      related: 'sub/related.md'
    };
    /** @type {NoteInfo} */
    const info = {
      url: 'https://store.com/notes/test-01.md',
      path: 'test-01.md',
      content: makeNoteContent(meta),
      isRootTocItem: true
    };
    const note = new Note(info);
    expect(note.title).toEqual('Simple note');
    expect(note.tags).toEqual(['test', 'note']);
    expect(note.children).toEqual(['sub/subnote.md']);
    expect(note.related).toEqual(['sub/related.md']);
  });

  it('no errors, no meta', () => {
    /** @type {NoteInfo} */
    const info = {
      url: 'https://store.com/notes/test-01.md',
      path: 'test-01.md',
      etag: '11111',
      content: 'Note content',
      isRootTocItem: true
    };
    const note = new Note(info);
    expect(note.title).toEqual('test-01.md');
    expect(note.tags).toBeUndefined();
    expect(note.children).toBeUndefined();
    expect(note.related).toBeUndefined();
  });

  it('has error, should hsa no meta', () => {
    /** @type {NoteMeta} */
    const meta = {
      title: 'Simple note',
      tags: ['test', 'note'],
      children: 'sub/subnote.md',
      related: 'sub/related.md'
    };
    /** @type {NoteInfo} */
    const info = {
      url: 'https://store.com/notes/test-01.md',
      path: 'test-01.md',
      etag: '11111',
      error: '404: Not found',
      content: makeNoteContent(meta),
      isRootTocItem: true
    };
    const note = new Note(info);
    expect(note.error).toEqual('404: Not found');
    expect(note.title).toEqual('test-01.md');
    expect(note.tags).toBeUndefined();
    expect(note.children).toBeUndefined();
    expect(note.related).toBeUndefined();
  });

  it('serialize normal note', () => {
    const info = {
      url: 'https://store.com/notes/test.md',
      path: 'test.md',
      etag: '11111',
      content: makeNoteContent({
        title: 'Test note',
        tags: 'test'
      }),
      isRootTocItem: true
    };
    const note = new Note(info);
    const serialized = note.serialize();
    expect(serialized).toEqual(info);
    expect(Object.keys(serialized).sort()).toEqual(
      Object.keys(info).sort()
    );
  });

  it('serialize error note', () => {
    const info = {
      url: 'https://store.com/notes/test.md',
      path: 'test.md',
      error: '404: Not found'
    };
    const note = new Note(info);
    const serialized = note.serialize();
    expect(serialized).toEqual(info);
    expect(Object.keys(serialized).sort()).toEqual(
      Object.keys(info).sort()
    );
  });

  it('deserialize normal note with isRootTocItem', () => {
    const serial = {
      url: 'https://store.com/notes/test.md',
      path: 'test.md',
      content: makeNoteContent({
        title: 'Test note',
        children: 'child.md',
        related: 'related.md'
      }),
      etag: '11111',
      isRootTocItem: true
    };
    const note = Note.deserialize(serial);
    expect(note.url).toEqual('https://store.com/notes/test.md');
    expect(note.path).toEqual('test.md');
    expect(note.title).toEqual('Test note');
    expect(note.children).toEqual(['child.md']);
    expect(note.related).toEqual(['related.md']);
    expect(note.etag).toEqual('11111');
    expect(note.isRootTocItem).toEqual(true);
  });

  it('deserialize normal note without isRootTocItem', () => {
    const serial = {
      url: 'https://store.com/notes/test.md',
      path: 'test.md',
      content: makeNoteContent({
        title: 'Test note',
        children: 'child.md',
        related: 'related.md'
      }),
      etag: '11111'
    };
    const note = Note.deserialize(serial);
    expect(note.url).toEqual('https://store.com/notes/test.md');
    expect(note.path).toEqual('test.md');
    expect(note.title).toEqual('Test note');
    expect(note.children).toEqual(['child.md']);
    expect(note.related).toEqual(['related.md']);
    expect(note.etag).toEqual('11111');
    expect(note.isRootTocItem).toBeUndefined();
  });

  it('deserialize normal note with error', () => {
    const serial = {
      url: 'https://store.com/notes/test.md',
      path: 'test.md',
      error: '404: Not found'
    };
    const note = Note.deserialize(serial);
    expect(note.url).toEqual('https://store.com/notes/test.md');
    expect(note.path).toEqual('test.md');
    expect(note.title).toEqual('test.md');
    expect(note.children).toBeUndefined();
    expect(note.related).toBeUndefined();
    expect(note.etag).toBeUndefined();
    expect(note.isRootTocItem).not.toBeTruthy();
  });

  it('get HTML, check cache', () => {
    const note = new Note({
      url: 'https://store.com/notes/test.md',
      path: 'test.md',
      content: makeNoteContent(null, 'Content')
    });
    expect(note.html).toEqual('<p>Content</p>\n');
    note.content = 'Test';
    expect(note.html).toEqual('<p>Content</p>\n');
  });

  it('get HTML from error note', () => {
    const info = {
      url: 'https://store.com/notes/test.md',
      path: 'test.md',
      error: '404: Not found'
    };
    const note = new Note(info);
    expect(note.html).toEqual('');
  });
});
