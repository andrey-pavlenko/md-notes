import {
  mockFecth,
  unmockFecth,
  clearResponses,
  setResponseJson,
  setResponseText,
  setResponse404,
  makeNoteContent
} from './mock-fetch';
import options from '../options';
import Repository from './repository';
import Note from './note';

const optionsContentsUrl = options.contentsUrl;
const contentsUrl = 'https://repo.com';
const baseUrl = 'https://repo.com/notes/';

describe('Repository', () => {
  beforeAll(() => {
    options.contentsUrl = contentsUrl;
    mockFecth();
  });

  afterAll(() => {
    options.contentsUrl = optionsContentsUrl;
    unmockFecth();
  });

  beforeEach(clearResponses);

  it('bad param in constructor', () => {
    expect(Array.isArray(new Repository()._notes)).toBeTruthy();
    expect(new Repository()._notes).toEqual([]);
    expect(Array.isArray(new Repository(10)._notes)).toBeTruthy();
    expect(new Repository(10)._notes).toEqual([]);
  });

  it('success load notes, children, related', async () => {
    const notePaths = ['test-01.md', 'test-02.md', 'test-03.md'];
    const childrenPaths = ['child-01.md', 'child-02.md'];
    const relatedPaths = ['related-01.md', 'related-02.md'];
    const noteContents = [
      {
        title: 'Simple note',
        tags: ['test', 'note']
      },
      {
        children: childrenPaths
      },
      {
        related: relatedPaths
      }
    ];
    const childrenContents = [
      {
        title: 'Child note 1',
        tags: ['child', 'note']
      },
      {
        title: 'Child note 2',
        tags: ['child', 'note']
      }
    ];
    const relatedContents = [
      {
        title: 'Related note 1',
        tags: ['related', 'note']
      },
      {
        title: 'Related note 2',
        tags: ['related', 'note']
      }
    ];
    setResponseJson(contentsUrl, {
      base: baseUrl,
      files: notePaths
    });
    notePaths.forEach((path, index) =>
      setResponseText(
        baseUrl + path,
        makeNoteContent(noteContents[index])
      )
    );
    childrenPaths.forEach((path, index) =>
      setResponseText(
        baseUrl + path,
        makeNoteContent(childrenContents[index])
      )
    );
    relatedPaths.forEach((path, index) =>
      setResponseText(
        baseUrl + path,
        makeNoteContent(relatedContents[index])
      )
    );
    const repository = await Repository.load();
    expect(
      repository._notes.filter(note => note.path.startsWith('test'))
    ).toHaveLength(notePaths.length);
    expect(
      repository._notes.filter(note => note.path.startsWith('child'))
    ).toHaveLength(childrenPaths.length);
    expect(
      repository._notes.filter(note =>
        note.path.startsWith('related')
      )
    ).toHaveLength(relatedPaths.length);
    repository._notes.forEach(note => {
      function findNote(path) {
        return repository._notes.find(note => note.path === path);
      }
      if (note.children) {
        note.children.forEach(child => {
          expect(findNote(child)).toBeDefined();
        });
      }
      if (note.related) {
        note.related.forEach(related => {
          expect(findNote(related)).toBeDefined();
        });
      }
    });
  });

  it('Error while loading children', async () => {
    setResponseJson(contentsUrl, {
      base: baseUrl,
      files: ['test.md']
    });
    setResponseText(
      baseUrl + 'test.md',
      makeNoteContent({
        title: 'Simple note',
        tags: ['test', 'note'],
        children: 'child.md',
        related: 'related.md'
      }),
      {
        headers: {
          get: () => '11111'
        }
      }
    );
    setResponse404(baseUrl + 'child.md');
    setResponse404(baseUrl + 'related.md');
    const repository = await Repository.load();
    expect(repository._notes).toHaveLength(3);
    expect(repository._notes[0].children).toEqual(['child.md']);
    expect(repository._notes[0].related).toEqual(['related.md']);
    expect(repository.findNote('path', 'child.md').error).toEqual(
      '404: Not found'
    );
    expect(repository.findNote('path', 'related.md').error).toEqual(
      '404: Not found'
    );
  });

  it('merge: unique repositories, add', () => {
    let notes = Array(10)
      .fill()
      .map(
        (_, index) =>
          new Note({
            url: `https://repo.com/notes/note-${String(
              index
            ).padStart(2, '0')}.md`,
            path: `note-${String(index).padStart(2, '0')}.md`,
            etag: (10001 + index).toString(),
            content: makeNoteContent({
              title: `Note ${index + 1}`
            })
          })
      );
    let repo = new Repository(notes);
    const otherRepo = new Repository(
      Array(5)
        .fill()
        .map(
          (_, index) =>
            new Note({
              url: `https://repo.com/notes/note-${String(
                index + 10
              ).padStart(2, '0')}.md`,
              path: `note-${String(index + 10).padStart(2, '0')}.md`,
              etag: (10011 + index).toString(),
              content: makeNoteContent({
                title: `Note ${index + 11}`
              })
            })
        )
    );
    expect(repo._notes).toHaveLength(10);
    repo._notes.forEach((note, index) => {
      expect(note.url).toEqual(
        `https://repo.com/notes/note-${String(index).padStart(
          2,
          '0'
        )}.md`
      );
      expect(note.path).toEqual(
        `note-${String(index).padStart(2, '0')}.md`
      );
      expect(note.etag).toEqual((10001 + index).toString());
      expect(note.title).toEqual(`Note ${index + 1}`);
    });
    repo.merge(otherRepo);
    expect(repo._notes).toHaveLength(15);
    repo._notes.forEach((note, index) => {
      expect(note.url).toEqual(
        `https://repo.com/notes/note-${String(index).padStart(
          2,
          '0'
        )}.md`
      );
      expect(note.path).toEqual(
        `note-${String(index).padStart(2, '0')}.md`
      );
      expect(note.etag).toEqual((10001 + index).toString());
      expect(note.title).toEqual(`Note ${index + 1}`);
    });
  });

  it('merge: not unique repositories, overwrite', () => {
    let notes = Array(10)
      .fill()
      .map(
        (_, index) =>
          new Note({
            url: `https://repo.com/notes/note-${String(
              index
            ).padStart(2, '0')}.md`,
            path: `note-${String(index).padStart(2, '0')}.md`,
            etag: (10001 + index).toString(),
            content: makeNoteContent({
              title: `Note ${index + 1}`
            })
          })
      );
    let repo = new Repository(notes);
    let otherRepo = new Repository(
      Array(4)
        .fill()
        .map(
          (_, index) =>
            new Note({
              url: `https://repo.com/notes/note-${String(
                index
              ).padStart(2, '0')}.md`,
              path: `note-${String(index).padStart(2, '0')}.md`,
              etag: (10011 + index).toString(),
              content: makeNoteContent({
                title: `Note ${index + 10}`
              })
            })
        )
    );
    repo._notes.forEach((note, index) => {
      expect(note.url).toEqual(
        `https://repo.com/notes/note-${String(index).padStart(
          2,
          '0'
        )}.md`
      );
      expect(note.path).toEqual(
        `note-${String(index).padStart(2, '0')}.md`
      );
      expect(note.etag).toEqual((10001 + index).toString());
      expect(note.title).toEqual(`Note ${index + 1}`);
    });
    repo.merge(otherRepo);
    expect(repo._notes).toHaveLength(10);
    repo._notes.slice(0, 4).forEach((note, index) => {
      expect(note.url).toEqual(
        `https://repo.com/notes/note-${String(index).padStart(
          2,
          '0'
        )}.md`
      );
      expect(note.path).toEqual(
        `note-${String(index).padStart(2, '0')}.md`
      );
      expect(note.etag).toEqual((10011 + index).toString());
      expect(note.title).toEqual(`Note ${index + 10}`);
    });
    repo._notes.slice(4).forEach((note, index) => {
      expect(note.url).toEqual(
        `https://repo.com/notes/note-${String(index + 4).padStart(
          2,
          '0'
        )}.md`
      );
      expect(note.path).toEqual(
        `note-${String(index + 4).padStart(2, '0')}.md`
      );
      expect(note.etag).toEqual((10005 + index).toString());
      expect(note.title).toEqual(`Note ${index + 5}`);
    });
    otherRepo = new Repository(
      Array(2)
        .fill()
        .map(
          (_, index) =>
            new Note({
              url: `https://repo.com/notes/note-${String(
                index + 4
              ).padStart(2, '0')}.md`,
              path: `note-${String(index + 4).padStart(2, '0')}.md`,
              etag: (10015 + index).toString(),
              content: makeNoteContent({
                title: `Note ${index + 14}`
              })
            })
        )
    );
    repo.merge(otherRepo);
    expect(repo._notes).toHaveLength(10);
    repo._notes.slice(0, 6).forEach((note, index) => {
      expect(note.url).toEqual(
        `https://repo.com/notes/note-${String(index).padStart(
          2,
          '0'
        )}.md`
      );
      expect(note.path).toEqual(
        `note-${String(index).padStart(2, '0')}.md`
      );
      expect(note.etag).toEqual((10011 + index).toString());
      expect(note.title).toEqual(`Note ${index + 10}`);
    });
    otherRepo = new Repository(
      Array(4)
        .fill()
        .map(
          (_, index) =>
            new Note({
              url: `https://repo.com/notes/note-${String(
                index + 6
              ).padStart(2, '0')}.md`,
              path: `note-${String(index + 6).padStart(2, '0')}.md`,
              etag: (10017 + index).toString(),
              content: makeNoteContent({
                title: `Note ${index + 16}`
              })
            })
        )
    );
    repo.merge(otherRepo);
    expect(repo._notes).toHaveLength(10);
    repo._notes.forEach((note, index) => {
      expect(note.url).toEqual(
        `https://repo.com/notes/note-${String(index).padStart(
          2,
          '0'
        )}.md`
      );
      expect(note.path).toEqual(
        `note-${String(index).padStart(2, '0')}.md`
      );
      expect(note.etag).toEqual((10011 + index).toString());
      expect(note.title).toEqual(`Note ${index + 10}`);
    });
  });

  it('merge: skip without etag', () => {
    let notes = Array(3)
      .fill()
      .map(
        (_, index) =>
          new Note({
            url: `https://repo.com/notes/note-${String(
              index
            ).padStart(2, '0')}.md`,
            path: `note-${String(index).padStart(2, '0')}.md`,
            etag: (10001 + index).toString(),
            content: makeNoteContent({
              title: `Note ${index + 1}`
            })
          })
      );
    let repo = new Repository(notes);
    repo._notes.forEach((note, index) => {
      expect(note.url).toEqual(
        `https://repo.com/notes/note-${String(index).padStart(
          2,
          '0'
        )}.md`
      );
      expect(note.path).toEqual(
        `note-${String(index).padStart(2, '0')}.md`
      );
      expect(note.etag).toEqual((10001 + index).toString());
      expect(note.title).toEqual(`Note ${index + 1}`);
    });
    let otherRepo = new Repository([
      new Note({
        url: 'https://repo.com/notes/note-00.md',
        path: 'note-00.md',
        etag: '11111',
        content: makeNoteContent({
          title: 'Note 10'
        })
      }),
      new Note({
        url: 'https://repo.com/notes/note-01.md',
        path: 'note-01.md',
        error: '404: Not found'
      }),
      new Note({
        url: 'https://repo.com/notes/note-02.md',
        path: 'note-02.md',
        etag: '22222',
        content: makeNoteContent({
          title: 'Note 12'
        })
      })
    ]);
    repo.merge(otherRepo);
    expect(repo._notes[0].url).toEqual(
      'https://repo.com/notes/note-00.md'
    );
    expect(repo._notes[0].path).toEqual('note-00.md');
    expect(repo._notes[0].etag).toEqual('11111');
    expect(repo._notes[0].title).toEqual('Note 10');
    expect(repo._notes[1].url).toEqual(
      'https://repo.com/notes/note-01.md'
    );
    expect(repo._notes[1].path).toEqual('note-01.md');
    expect(repo._notes[1].etag).toEqual('10002');
    expect(repo._notes[1].title).toEqual('Note 2');
    expect(repo._notes[2].url).toEqual(
      'https://repo.com/notes/note-02.md'
    );
    expect(repo._notes[2].path).toEqual('note-02.md');
    expect(repo._notes[2].etag).toEqual('22222');
    expect(repo._notes[2].title).toEqual('Note 12');
    repo.merge(otherRepo);
    expect(repo._notes[0].path).toEqual('note-00.md');
    expect(repo._notes[0].etag).toEqual('11111');
    expect(repo._notes[0].title).toEqual('Note 10');
    expect(repo._notes[1].url).toEqual(
      'https://repo.com/notes/note-01.md'
    );
    expect(repo._notes[1].path).toEqual('note-01.md');
    expect(repo._notes[1].etag).toEqual('10002');
    expect(repo._notes[1].title).toEqual('Note 2');
    expect(repo._notes[2].url).toEqual(
      'https://repo.com/notes/note-02.md'
    );
    expect(repo._notes[2].path).toEqual('note-02.md');
    expect(repo._notes[2].etag).toEqual('22222');
    expect(repo._notes[2].title).toEqual('Note 12');
  });

  it('tags: normal', () => {
    const notes = [
      new Note({
        url: 'https://repo.com/note1.md',
        path: 'note1.md',
        etag: '111',
        content: makeNoteContent({
          tags: ['one1', 'many1']
        })
      }),
      new Note({
        url: 'https://repo.com/note2.md',
        path: 'note2.md',
        etag: '112',
        content: makeNoteContent({
          tags: ['one2', 'many1']
        })
      }),
      new Note({
        url: 'https://repo.com/note3.md',
        path: 'note3.md',
        etag: '113',
        content: makeNoteContent({
          tags: ['one3', 'many1']
        })
      }),
      new Note({
        url: 'https://repo.com/note3.md',
        path: 'note4.md',
        etag: '114',
        content: makeNoteContent({
          tags: 'one4'
        })
      })
    ];
    const repo = new Repository(notes);
    const tags = repo.tags;
    expect(tags).toHaveLength(5);
    expect(tags[0]).toEqual({ title: 'many1', referenceCount: 3 });
    expect(tags[1]).toEqual({ title: 'one1', referenceCount: 1 });
    expect(tags[2]).toEqual({ title: 'one2', referenceCount: 1 });
    expect(tags[3]).toEqual({ title: 'one3', referenceCount: 1 });
    expect(tags[4]).toEqual({ title: 'one4', referenceCount: 1 });
  });

  it('tags: broken', () => {
    const notes = [
      new Note({
        url: 'https://repo.com/note1.md',
        path: 'note1.md',
        etag: '111',
        content: makeNoteContent({
          tags: ['one1', 'many1']
        })
      }),
      new Note({
        url: 'https://repo.com/note2.md',
        path: 'note2.md',
        error: '404: Not found'
      }),
      new Note({
        url: 'https://repo.com/note3.md',
        path: 'note3.md',
        etag: '113',
        content: makeNoteContent({
          related: ['related1.md', 'related2.md']
        })
      }),
      new Note({
        url: 'https://repo.com/note3.md',
        path: 'note4.md',
        etag: '114',
        content: makeNoteContent({
          tags: 'one4'
        })
      })
    ];
    const repo = new Repository(notes);
    const tags = repo.tags;
    expect(tags).toHaveLength(3);
    expect(tags[0]).toEqual({ title: 'many1', referenceCount: 1 });
    expect(tags[1]).toEqual({ title: 'one1', referenceCount: 1 });
    expect(tags[2]).toEqual({ title: 'one4', referenceCount: 1 });
  });

  it('tags: all broken', () => {
    const notes = [
      new Note({
        url: 'https://repo.com/note1.md',
        path: 'note1.md',
        error: '404: Not found'
      }),
      new Note({
        url: 'https://repo.com/note2.md',
        path: 'note2.md',
        error: '404: Not found'
      }),
      new Note({
        url: 'https://repo.com/note3.md',
        path: 'note3.md',
        etag: '113',
        content: makeNoteContent({
          related: ['related1.md', 'related2.md']
        })
      }),
      new Note({
        url: 'https://repo.com/note3.md',
        path: 'note4.md',
        etag: '114',
        content: makeNoteContent({
          children: 'child.md'
        })
      })
    ];
    const repo = new Repository(notes);
    const tags = repo.tags;
    expect(tags).toEqual([]);
  });

  it('toc: all normal', () => {
    const notes = [
      new Note({
        url: 'https://repo.com/note1.md',
        path: 'note1.md',
        etag: '111',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 1',
          children: ['children/child1.md', 'children/child2.md']
        })
      }),
      new Note({
        url: 'https://repo.com/note2.md',
        path: 'note2.md',
        etag: '112',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 2',
          children: ['children/child3.md', 'children/child4.md']
        })
      }),
      new Note({
        url: 'https://repo.com/note3.md',
        path: 'note3.md',
        etag: '113',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 3',
          children: 'children/child5.md'
        })
      }),
      new Note({
        url: 'https://repo.com/note4.md',
        path: 'note4.md',
        etag: '114',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 4'
        })
      }),
      ...[1, 2, 3, 4, 5].map(
        num =>
          new Note({
            url: `https://repo.com/children/child${num}.md`,
            path: `children/child${num}.md`,
            etag: (114 + num).toString(),
            content: makeNoteContent({
              title: `Child ${num}`
            })
          })
      )
    ];
    const repo = new Repository(notes);
    const toc = repo.toc;
    expect(toc).toHaveLength(4);
    expect(toc[0].path).toEqual('note1.md');
    expect(toc[0].children).toHaveLength(2);
    expect(toc[0].children[0].path).toEqual('children/child1.md');
    expect(toc[0].children[0].children).toBeUndefined();
    expect(toc[0].children[1].path).toEqual('children/child2.md');
    expect(toc[0].children[1].children).toBeUndefined();
    expect(toc[1].children).toHaveLength(2);
    expect(toc[1].children[0].path).toEqual('children/child3.md');
    expect(toc[1].children[0].children).toBeUndefined();
    expect(toc[1].children[1].path).toEqual('children/child4.md');
    expect(toc[1].children[1].children).toBeUndefined();
    expect(toc[2].children).toHaveLength(1);
    expect(toc[2].children[0].path).toEqual('children/child5.md');
    expect(toc[2].children[0].children).toBeUndefined();
    expect(toc[3].children).toBeUndefined();
  });

  it('toc: one root with error, some missing, one child with error', () => {
    const notes = [
      new Note({
        url: 'https://repo.com/note1.md',
        path: 'note1.md',
        etag: '111',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 1',
          children: ['children/child1.md', 'children/child2.md']
        })
      }),
      new Note({
        url: 'https://repo.com/note2.md',
        path: 'note2.md',
        etag: '112',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 2',
          children: ['children/child3.md', 'children/child4.md']
        })
      }),
      new Note({
        url: 'https://repo.com/note3.md',
        path: 'note3.md',
        etag: '113',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 3',
          children: 'children/child5.md'
        })
      }),
      new Note({
        url: 'https://repo.com/note4.md',
        path: 'note4.md',
        isRootTocItem: true,
        error: '404: Not found'
      }),
      ...[1, 3].map(
        num =>
          new Note({
            url: `https://repo.com/children/child${num}.md`,
            path: `children/child${num}.md`,
            etag: (114 + num).toString(),
            content: makeNoteContent({
              title: `Child ${num}`
            })
          })
      ),
      new Note({
        url: 'https://repo.com/children/child5.md',
        path: 'children/child5.md',
        error: '404: Not found'
      })
    ];
    const repo = new Repository(notes);
    const toc = repo.toc;
    expect(toc).toHaveLength(3);
    expect(toc[0].path).toEqual('note1.md');
    expect(toc[0].children).toHaveLength(1);
    expect(toc[0].children[0].path).toEqual('children/child1.md');
    expect(toc[0].children[0].children).toBeUndefined();
    expect(toc[1].children).toHaveLength(1);
    expect(toc[1].children[0].path).toEqual('children/child3.md');
    expect(toc[1].children[0].children).toBeUndefined();
    expect(toc[2].children).toBeUndefined();
  });

  it('toc: deep sub children', () => {
    const notes = [
      new Note({
        url: 'https://repo.com/note1.md',
        path: 'note1.md',
        etag: '111',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 1',
          children: ['children/child1.md']
        })
      }),
      new Note({
        url: 'https://repo.com/children/child1.md',
        path: 'children/child1.md',
        etag: '112',
        content: makeNoteContent({
          title: 'Child 1',
          children: [
            'children/sub/subchild1.md',
            'children/sub/subchild2.md'
          ]
        })
      }),
      new Note({
        url: 'https://repo.com/children/sub/subchild1.md',
        path: 'children/sub/subchild1.md',
        etag: '113',
        content: makeNoteContent({
          title: 'Subchild 1',
          children: 'children/sub/sub-subchild1.md'
        })
      }),
      new Note({
        url: 'https://repo.com/children/sub/subchild2.md',
        path: 'children/sub/subchild2.md',
        etag: '114',
        content: makeNoteContent({
          title: 'Subchild 2'
        })
      }),
      new Note({
        url: 'https://repo.com/children/sub/sub-subchild1.md',
        path: 'children/sub/sub-subchild1.md',
        etag: '115',
        content: makeNoteContent({
          title: 'Sub-Subchild 1'
        })
      })
    ];
    const repo = new Repository(notes);
    const toc = repo.toc;
    expect(toc).toHaveLength(1);
    expect(toc[0].path).toEqual('note1.md');
    expect(toc[0].children).toHaveLength(1);
    expect(toc[0].children[0].path).toEqual('children/child1.md');
    expect(toc[0].children[0].children).toHaveLength(2);
    expect(toc[0].children[0].children[0].path).toEqual(
      'children/sub/subchild1.md'
    );
    expect(toc[0].children[0].children[1].path).toEqual(
      'children/sub/subchild2.md'
    );
    expect(toc[0].children[0].children[1].children).toBeUndefined();
    expect(toc[0].children[0].children[0].children).toHaveLength(1);
    expect(toc[0].children[0].children[0].children[0].path).toEqual(
      'children/sub/sub-subchild1.md'
    );
    expect(
      toc[0].children[0].children[0].children[0].children
    ).toBeUndefined();
  });

  it('toc: circular children zero level', () => {
    const notes = [
      new Note({
        url: 'https://repo.com/note1.md',
        path: 'note1.md',
        etag: '111',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 1',
          children: 'note1.md'
        })
      })
    ];
    const repo = new Repository(notes);
    const toc = repo.toc;
    expect(toc).toHaveLength(1);
    expect(toc[0].path).toEqual('note1.md');
    expect(toc[0].children).toBeUndefined();
  });

  it('toc: circular children one level', () => {
    const notes = [
      new Note({
        url: 'https://repo.com/note1.md',
        path: 'note1.md',
        etag: '111',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 1',
          children: 'child1.md'
        })
      }),
      new Note({
        url: 'https://repo.com/child1.md',
        path: 'child1.md',
        etag: '112',
        content: makeNoteContent({
          title: 'Child 1',
          children: 'note1.md'
        })
      })
    ];
    const repo = new Repository(notes);
    const toc = repo.toc;
    expect(toc).toHaveLength(1);
    expect(toc[0].path).toEqual('note1.md');
    expect(toc[0].children).toHaveLength(1);
    expect(toc[0].children[0].path).toEqual('child1.md');
    expect(toc[0].children[0].children).toBeUndefined();
  });

  it('toc: circular children two level', () => {
    const notes = [
      new Note({
        url: 'https://repo.com/note1.md',
        path: 'note1.md',
        etag: '111',
        isRootTocItem: true,
        content: makeNoteContent({
          title: 'Note 1',
          children: 'child1.md'
        })
      }),
      new Note({
        url: 'https://repo.com/child1.md',
        path: 'child1.md',
        etag: '112',
        content: makeNoteContent({
          title: 'Child 1',
          children: 'subchild1.md'
        })
      }),
      new Note({
        url: 'https://repo.com/subchild1.md',
        path: 'subchild1.md',
        etag: '113',
        content: makeNoteContent({
          title: 'Subchild 1',
          children: 'note1.md'
        })
      })
    ];
    const repo = new Repository(notes);
    const toc = repo.toc;
    expect(toc).toHaveLength(1);
    expect(toc[0].path).toEqual('note1.md');
    expect(toc[0].children).toHaveLength(1);
    expect(toc[0].children[0].path).toEqual('child1.md');
    expect(toc[0].children[0].children).toHaveLength(1);
    expect(toc[0].children[0].children[0].path).toEqual(
      'subchild1.md'
    );
    expect(toc[0].children[0].children[0].children).toBeUndefined();
  });
});
