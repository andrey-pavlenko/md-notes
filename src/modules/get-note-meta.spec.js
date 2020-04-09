import getNoteMeta from './get-note-meta';

describe('getNoteMeta', () => {
  it('has all props', () => {
    const note = `<!---
{
  "title": "Simple note",
  "tags":["simlpe", "note"],
  "children": ["sub/note-1.md", "sub/note-2.md"],
  "related": ["test.md"]
}
-->
# Simple note, with meta.title

Some text
    `;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['simlpe', 'note'],
      children: ['sub/note-1.md', 'sub/note-2.md'],
      related: ['test.md']
    });
  });

  it('related relative path', () => {
    let note = `<!---
{
  "title": "Simple note",
  "tags":["simlpe", "note"],
  "related": "./test.md"
}
-->
# Simple note, with meta.title

Some text
    `;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['simlpe', 'note'],
      related: ['test.md']
    });
    note = `<!---
{
  "title": "Simple note",
  "tags":["simlpe", "note"],
  "related": ["./test.md", "../test-1.md", ".test-2.md"]
}
-->
# Simple note, with meta.title

Some text
    `;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['simlpe', 'note'],
      related: ['test.md', 'test-1.md', '.test-2.md']
    });
  });

  it('unique related', () => {
    const note = `<!---
{
  "title": "Simple note",
  "tags":["simlpe", "note"],
  "related": ["./test.md", "../test.md", "..//test.md"]
}
-->
# Simple note, with meta.title

Some text
    `;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['simlpe', 'note'],
      related: ['test.md']
    });
  });

  it('children, related are not array', () => {
    const note = `<!---
{
  "title": "Simple note",
  "tags": "simlpe",
  "children": "sub/note-1.md",
  "related": "test.md"
}
-->
# Simple note, with meta.title

Some text
    `;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['simlpe'],
      children: ['sub/note-1.md'],
      related: ['test.md']
    });
  });

  it('children relative path', () => {
    let note = `<!---
{
  "title": "Simple note",
  "tags":["simlpe", "note"],
  "children": "./sub/note.md",
  "related": ["test.md"]
}
-->
# Simple note, with meta.title

Some text
    `;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['simlpe', 'note'],
      children: ['sub/note.md'],
      related: ['test.md']
    });
    note = `<!---
{
  "title": "Simple note",
  "tags":["simlpe", "note"],
  "children": ["./sub/note-1.md", "./sub/note-2.md"],
  "related": ["test.md"]
}
-->
# Simple note, with meta.title

Some text
    `;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['simlpe', 'note'],
      children: ['sub/note-1.md', 'sub/note-2.md'],
      related: ['test.md']
    });
  });

  it('unique children', () => {
    const note = `<!---
{
  "title": "Simple note",
  "tags":["simlpe", "note"],
  "children": ["./sub/note.md", "../sub/note.md"],
  "related": ["test.md"]
}
-->
# Simple note, with meta.title

Some text
    `;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['simlpe', 'note'],
      children: ['sub/note.md'],
      related: ['test.md']
    });
  });

  it('title from content', () => {
    const note = `<!---
{
  "tags": "simlpe",
  "children": "sub/note-1.md",
  "related": "test.md"
}
-->
# Simple note

Some text
    `;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['simlpe'],
      children: ['sub/note-1.md'],
      related: ['test.md']
    });
  });

  it('random placed', () => {
    const note = `<!---
{
  "title": "Simple note"
}
-->
# Simple note, with multiply meta
<!---
{
  "tags": ["multi", "meta"]
}
-->
Some text
`;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['multi', 'meta']
    });
  });

  it('redefined props', () => {
    const note = `<!---
{
  "title": "Simple note",
  "tags": ["multi", "meta"]
}
-->
# Simple note, with multiply meta
<!---
{
  "tags": "redefined",
  "related": ["test.md"]
}
-->
Some text
`;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note',
      tags: ['redefined'],
      related: ['test.md']
    });
  });

  it('no meta inside content, but get title', () => {
    const note = `## Simple note, no meta

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    expect(getNoteMeta(note)).toEqual({
      title: 'Simple note, no meta'
    });
  });

  it('no meta inside content', () => {
    const note = `Arch Linux (Русский)
====================

Статья не гарантирует актуальность информации. Помогите русскоязычному сообществу поддержкой подобных страниц. См. [Команда переводчиков ArchWiki](/index.php/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%B0_%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D1%87%D0%B8%D0%BA%D0%BE%D0%B2_ArchWiki "Команда переводчиков ArchWiki")`;
    expect(getNoteMeta(note)).toEqual({});
  });

  it('not all props', () => {
    const note = `<!---
{
  "title": "test1"
}
-->

# Note with tags: test1, test2, test5

<!---
{
  "tags": [
    "test1",
    "test2",
    "test3"
  ]
}
-->

Content
`;
    expect(getNoteMeta(note)).toEqual({
      title: 'test1',
      tags: ['test1', 'test2', 'test3']
    });
  });

  it('bad content', () => {
    expect(getNoteMeta('')).toEqual({});
    expect(getNoteMeta(undefined)).toEqual({});
    expect(getNoteMeta(null)).toEqual({});
  });

  it('broken JSON', () => {
    const note = `<!---
{
  "title": "Simple note
  "tags":["simlpe", "note"],
  "children": ["sub/note-1.md", "sub/note-2.md"],
  "related": ["test.md"]
}
-->
Simple note, invalid JSON

    `;
    let originalError = console.error;
    console.error = jest.fn();
    expect(getNoteMeta(note, { title: 'test-01.md' })).toEqual({
      title: 'test-01.md'
    });
    // @ts-ignore
    expect(console.error.mock.calls[0][1]).toEqual(
      expect.stringMatching(/Unexpected token\s*in JSON/)
    );
    console.error = originalError;
  });
});
