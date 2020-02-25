import Marked from 'marked';
// import { notePaths } from '../store/repository';
import options from '../options';

let htmlRenderer;
let textRenderer;
// let notePaths = [];

/**
 * @returns {Marked.Renderer}
 */
function makeHtmlRenderer() {
  const renderer = new Marked.Renderer();
  renderer.link = function(href, title, text) {
    if (options.notePaths.includes(href)) {
      return `<a href="#/${href}"${
        title ? ` title="${title}"` : ''
      }>${text}</a>`;
    }
    return `<a href="${href}"${
      title ? ` title="${title}"` : ''
    } target="_blank">${text}</a>`;
  };
  return renderer;
}

/**
 * @returns {Marked.Renderer}
 */
function makeTextRenderer() {
  function makeTextFunction(stringToAdd) {
    if (stringToAdd != null) {
      return function(text) {
        return text + stringToAdd;
      };
    } else {
      return function(text) {
        return text;
      };
    }
  }

  const renderer = new Marked.Renderer();
  renderer.code = makeTextFunction('\n');
  renderer.blockquote = makeTextFunction();
  renderer.html = function() {
    return '';
  };
  renderer.heading = makeTextFunction('\n');
  renderer.hr = function() {
    return '';
  };
  renderer.list = makeTextFunction();
  renderer.listitem = makeTextFunction('\n');
  renderer.paragraph = makeTextFunction('\n');
  renderer.table = function(header, body) {
    return header + body;
  };
  renderer.tablerow = makeTextFunction('\n');
  renderer.tablecell = makeTextFunction(' ');
  renderer.strong = makeTextFunction();
  renderer.em = makeTextFunction();
  renderer.codespan = makeTextFunction();
  renderer.del = makeTextFunction();
  renderer.link = function(href, title, text) {
    return text;
  };
  renderer.image = function() {
    return '';
  };
  return renderer;
}

/**
 * @param {string} mdString
 * @returns {string}
 */
function toHtml(mdString) {
  if (htmlRenderer == null) {
    htmlRenderer = makeHtmlRenderer();
  }
  return Marked(mdString, {
    renderer: htmlRenderer,
    baseUrl: options.baseUrl
  });
}

/**
 * @param {string} mdString
 * @returns {string}
 */
function toText(mdString) {
  if (textRenderer == null) {
    textRenderer = makeTextRenderer();
  }
  return Marked(mdString, {
    renderer: textRenderer
  });
}

export { toHtml, toText };
