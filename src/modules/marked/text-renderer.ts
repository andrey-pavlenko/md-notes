import * as marked from 'marked';

class PlainTextRenderer extends marked.Renderer {
  public code(code: string): string {
    return code + '\n';
  }

  public blockquote(quote: string): string {
    return quote;
  }

  public html(): string {
    return '';
  }

  public heading(text: string): string {
    return text + '\n';
  }

  public hr(): string {
    return '';
  }

  public list(body: string): string {
    return body;
  }

  public listitem(text: string): string {
    return text + '\n';
  }

  public paragraph(text: string): string {
    return text + '\n';
  }

  public table(header: string, body: string): string {
    return header + body;
  }

  public tablerow(content: string): string {
    return content + '\n';
  }

  public tablecell(content: string): string {
    return content + ' ';
  }

  public strong(text: string): string {
    return text;
  }

  public em(text: string): string {
    return text;
  }

  public codespan(code: string): string {
    return code;
  }

  public del(text: string): string {
    return text;
  }

  public link(href: string, title: string, text: string): string {
    return text;
  }

  public image(): string {
    return '';
  }
}

export { PlainTextRenderer };