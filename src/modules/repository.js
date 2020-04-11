import { loadContents, loadFiles } from './remote-storage';
import { readNotes, writeNotes } from './cache-storage';
import Note from './note';

class Repository {
  /**
   * @param {Note[]} [notes]
   */
  constructor(notes) {
    this._notes = Array.isArray(notes) ? notes : [];
  }

  /**
   * @param {string} key
   * @param {any} value
   * @returns {Note | undefined}
   */
  findNote(key, value) {
    return this._notes.find(note => note[key] === value);
  }

  /**
   * @param {Repository} otherRepo
   * @returns {Repository}
   */
  merge(otherRepo) {
    otherRepo._notes.forEach(otherNote => {
      // console.info('otherNote', otherNote);
      const note = this.findNote('url', otherNote.url);
      if (note == null) {
        // console.info('missing', otherNote);
        this._notes = [...this._notes, otherNote];
      }
    });
    return this;
  }

  /**
   * @returns {Promise<Repository>}
   */
  static async load() {
    /**
     * @param {Note[]} notes
     * @returns {string[]}
     */
    function getMissingPaths(notes) {
      let existsPaths = notes.map(note => note.path);
      return notes.reduce((missing, note) => {
        if (note.children && note.children.length) {
          let missingChildren = [
            ...note.children.filter(
              child => !existsPaths.includes(child)
            )
          ];
          missing = [...missing, ...missingChildren];
        }
        if (note.related && note.related.length) {
          let missingRelated = [
            ...note.related.filter(
              child => !existsPaths.includes(child)
            )
          ];
          missing = [...missing, ...missingRelated];
        }
        return missing;
      }, []);
    }

    const contents = await loadContents();
    let notes = (await loadFiles(contents.files)).map(
      file => new Note({ ...file, isRootTocItem: true })
    );
    let missing = getMissingPaths(notes);
    while (missing.length) {
      // @ts-ignore
      missing = (await loadFiles(missing)).map(
        file => new Note(file)
      );
      // @ts-ignore
      notes = [...notes, ...missing];
      missing = getMissingPaths(notes);
    }
    return new Repository(notes);
  }

  /**
   * @returns {Repository | undefined}
   */
  static read() {
    const readedNotes = readNotes();
    if (readedNotes != null) {
      return new Repository(readedNotes.map(note => new Note(note)));
    }
  }

  write() {
    writeNotes(this._notes.map(note => note.serialize()));
  }

  /**
   * @returns {import('./_types.d').TagItem[]}
   */
  get tags() {
    const tags = []
      .concat(...this._notes.map(note => note.tags))
      .filter(tag => tag != null)
      .reduce((acc, tag) => {
        if (acc[tag] == null) {
          acc[tag] = 1;
        } else {
          acc[tag] += 1;
        }
        return acc;
      }, {});
    return Object.keys(tags)
      .sort((a, b) => a.localeCompare(b))
      .map(key => ({
        title: key,
        referenceCount: tags[key]
      }));
  }

  /**
   * @returns {import('./_types.d').TocItem[]}
   */
  get toc() {
    let alreadyInToc = [];

    const getTocItem = note => {
      if (note.error == null && !alreadyInToc.includes(note.path)) {
        alreadyInToc.push(note.path);
        /** @type {import('./_types.d').TocItem} */
        const tocItem = {
          path: note.path,
          title: note.title
        };
        let children = note.children || [];
        if (children.length) {
          children = children
            .map(childPath => this.findNote('path', childPath))
            .filter(childNote => childNote != null)
            .map(getTocItem)
            .filter(childNote => childNote != null);
        }
        if (children.length) {
          tocItem.children = children;
        }
        alreadyInToc.pop();
        return tocItem;
      }
    };

    return this._notes
      .filter(note => !!note.isRootTocItem)
      .map(getTocItem)
      .filter(tocItem => tocItem != null);
  }

  /**
   * @param {string} tag 
   * @returns {Note[]}
   */
  findNotesByTag(tag) {
    return this._notes.filter(note => note.tags && note.tags.includes(tag));
  }
}

export default Repository;
