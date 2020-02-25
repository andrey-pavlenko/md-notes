import getNoteMeta from './get-note-meta';
import { toHtml } from './marked';

class Note {
  /**
   * @type {import('./_types').NoteInfo}
   * @type {import('./_types').CacheNote}
   * @param {NoteInfo} noteInfo
   */
  constructor(noteInfo) {
    this.url = noteInfo.url;
    this.path = noteInfo.path;
    ['content', 'error', 'etag', 'isRootTocItem'].forEach(key => {
      if (noteInfo[key] != null) {
        this[key] = noteInfo[key];
      }
    });
    this._meta =
      this.error == null
        ? getNoteMeta(this.content, { title: this.path })
        : {};
  }

  /**
   * @returns {string}
   */
  get title() {
    return this._meta.title || this.path;
  }

  /**
   * @returns {string[] | undefined}
   */
  get children() {
    return this._meta.children;
  }

  /**
   * @returns {string[] | undefined}
   */
  get related() {
    return this._meta.related;
  }

  /**
   * @returns {string[] | undefined}
   */
  get tags() {
    return this._meta.tags;
  }

  /**
   * @returns {string}
   */
  get html() {
    if (this.content) {
      if (this._html == null) {
        this._html = toHtml(this.content);
      }
      return this._html;
    }
    return '';
  }

  /**
   * @returns {CacheNote}
   */
  serialize() {
    const serial = (({
      url,
      path,
      content,
      error,
      etag,
      isRootTocItem
    }) => ({
      url,
      path,
      content,
      error,
      etag,
      isRootTocItem
    }))(this);
    Object.keys(serial).forEach(key => {
      if (serial[key] == undefined) {
        delete serial[key];
      }
    });
    return serial;
  }

  /**
   * @param {CacheNote} src
   * @returns {Note}
   */
  static deserialize(src) {
    const deserial = (({
      url,
      path,
      content,
      error,
      etag,
      isRootTocItem
    }) => ({
      url,
      path,
      content,
      error,
      etag,
      isRootTocItem
    }))(src);
    return new Note(deserial);
  }
}

export default Note;
