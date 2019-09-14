import * as marked from 'marked';

function toHtml(mdContent: string): string {
  return marked(mdContent);
}

class PlainTextRenderer extends marked.Renderer {
  code(code: string, language: string, isEscaped: boolean): string {
    return code;
  }
  blockquote(quote: string): string {
    return quote;
  }
  html(html: string): string {
    return '';
  }
  heading(text: string, level: number, raw: string, slugger: marked.Slugger): string {
    return text;
  }
  hr(): string {
    return '';
  }
  list(body: string, ordered: boolean, start: number): string {
    return body;
  }
  listitem(text: string): string {
    return text + '\n';
  }
  paragraph(text: string): string {
    return text + '\n';
  }
  table(header: string, body: string): string {
    return header + body;
  }
  tablerow(content: string): string {
    return content + '\n'
  }
  tablecell(content: string, flags: {
    header: boolean;
    align: string | null;
  }): string {
    return content + ' ';
  }
  strong(text: string): string {
    return text;
  }
  em(text: string): string {
    return text;
  }
  codespan(code: string): string {
    return code;
  }
  del(text: string): string {
    return text;
  }
  link(href: string, title: string, text: string): string {
    return text;
  }
  image(href: string, title: string, text: string): string {
    return '';
  }
}

function toText(mdContent: string): string {
  return marked(mdContent, {
    renderer: new PlainTextRenderer()
  });
}

function setOptions(ops: marked.MarkedOptions): void {
  marked.setOptions(ops)
}

export { toHtml, toText, setOptions };