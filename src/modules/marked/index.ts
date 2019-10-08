/* eslint-disable */
import * as marked from 'marked';
import { PlainTextRenderer} from './text-renderer';
import { HtmlRenderer} from './html-renderer';

function toHtml(mdContent: string): string {
  // return marked(mdContent);
  return marked(mdContent, {
    renderer: new HtmlRenderer(),
  });
}

function toText(mdContent: string): string {
  return marked(mdContent, {
    renderer: new PlainTextRenderer(),
  });
}

function setOptions(ops: marked.MarkedOptions): void {
  marked.setOptions(ops);
}

export { toHtml, toText, setOptions };
