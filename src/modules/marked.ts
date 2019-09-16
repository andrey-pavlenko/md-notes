import * as marked from 'marked';

function toHtml(mdContent: string): string {
  return marked(mdContent);
}

class PlainTextRenderer extends marked.Renderer {
  code(code: string): string {
    return code + '\n';
  }

  blockquote(quote: string): string {
    return quote;
  }

  html(): string {
    return '';
  }

  heading(text: string): string {
    return text + '\n';
  }

  hr(): string {
    return '';
  }

  list(body: string): string {
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
    return content + '\n';
  }

  tablecell(content: string): string {
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

  image(): string {
    return '';
  }
}

function toText(mdContent: string): string {
  return marked(mdContent, {
    renderer: new PlainTextRenderer()
  });
}

function setOptions(ops: marked.MarkedOptions): void {
  marked.setOptions(ops);
}

export { toHtml, toText, setOptions };
