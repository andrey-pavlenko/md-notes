/**
 * @typedef StorageContents
 * @property {string} base
 * @property {string[]} files
 */

/**
 * @typedef StorageFile
 * @property {string} url
 * @property {string} path
 * @property {string} content?
 * @property {string} error?
 */

/**
 * @typedef NoteInfo
 * @property {string} url
 * @property {string} path
 * @property {string} content?
 * @property {string} error?
 * @property {boolean} isRootTocItem?
 */

/**
 * @typedef NoteMeta
 * @property {string} title?
 * @property {string[]} children?
 * @property {string[]} related?
 */

/**
 * @typedef CacheNote
 * @property {string} url
 * @property {string} path
 * @property {string} content?
 * @property {string} error?
 * @property {boolean} isRootTocItem?
 */

/**
 * @typedef TagItem
 * @property {string} title
 * @property {number} referenceCount
 */

/**
 * @typedef TocItem
 * @property {string} path
 * @property {string} title
 * @property {TocItem[]} children?
 */
