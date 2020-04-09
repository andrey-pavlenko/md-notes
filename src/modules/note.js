import getNoteMeta from './get-note-meta';
import { toHtml } from './marked';

class Note {
  /**
   * @param {import('./_types.d').NoteInfo} noteInfo
   */
  constructor(noteInfo) {
    this.url = noteInfo.url;
    this.path = noteInfo.path;
    this.content = noteInfo.content;
    this.error = noteInfo.error;
    this.isRootTocItem = noteInfo.isRootTocItem;
    this._meta =
      this.error == null ? getNoteMeta(this.content, { title: this.path }) : {};
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
   * @returns {import('./_types.d').CacheNote}
   */
  serialize() {
    const serial = (({ url, path, content, error, isRootTocItem }) => ({
      url,
      path,
      content,
      error,
      isRootTocItem,
    }))(this);
    Object.keys(serial).forEach((key) => {
      if (serial[key] == undefined) {
        delete serial[key];
      }
    });
    return serial;
  }

  /**
   * @param {import('./_types.d').CacheNote} src
   * @returns {Note}
   */
  static deserialize(src) {
    const deserial = (({ url, path, content, error, isRootTocItem }) => ({
      url,
      path,
      content,
      error,
      isRootTocItem,
    }))(src);
    return new Note(deserial);
  }
}

export default Note;
