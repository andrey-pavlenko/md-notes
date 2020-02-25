/**
 * @type {import('./_types').NoteMeta}
 * @param {string} text
 * @param {NoteMeta} defaultMeta
 * @returns {NoteMeta}
 */
function getNoteMeta(text, defaultMeta) {
  function getMetaData(text) {
    const metaRegex = /^<!-{2,3}\s*(\{[\s\S]*\})\s*-->$/;
    return Object.assign(
      {},
      ...text
        .split(/(<!-{2,3}[\s\S]*?-->)/)
        .filter(s => metaRegex.test(s))
        .map(s => {
          try {
            return JSON.parse(s.replace(metaRegex, '$1'));
          } catch (error) {
            console.error('getNoteMeta:', error.toString());
            return {};
          }
        })
    );
  }
  function getFirstHeader(text) {
    const titleRegex = /^#+\s*([\s\S]*?)\n\n/m;
    const match = text.match(titleRegex);
    if (match) {
      return match[1].split('\n').join(' ');
    }
  }

  /** @type {NoteMeta} */
  const meta = Object.assign({}, defaultMeta);
  if (typeof text === 'string') {
    let { title, tags, children, related } = getMetaData(text);
    if (title != null) {
      meta.title = title;
    } else {
      title = getFirstHeader(text);
      if (title != null) {
        meta.title = title;
      }
    }
    if (Array.isArray(tags)) {
      meta.tags = tags;
    } else if (typeof tags === 'string') {
      meta.tags = [tags];
    }
    if (Array.isArray(children)) {
      meta.children = children;
    } else if (typeof children === 'string') {
      meta.children = [children];
    }
    if (Array.isArray(related)) {
      meta.related = related;
    } else if (typeof related === 'string') {
      meta.related = [related];
    }
  }
  return meta;
}

export default getNoteMeta;
