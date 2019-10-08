import * as marked from 'marked';
import { default as store } from '../../store.js';

class HtmlRenderer extends marked.Renderer {
  public link(href: string, title: string, text: string): string {
    if (!!store.getters.noteByUrl(href)) {
      return `<a href="/#/${href}">${text}</a>`;
    } else {
      return super.link(href, title, text);
    }
  }
}

export { HtmlRenderer };
