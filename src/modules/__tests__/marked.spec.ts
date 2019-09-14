import { toHtml, toText } from '../marked';

describe('Marked', () => {
  it('code', () => {
    expect(toHtml('```\nFirst line\nSecond line\n```\n'))
      .toEqual('<pre><code>First line\nSecond line</code></pre>');
    expect(toText('```\nFirst line\nSecond line\n```\n'))
      .toEqual('First line\nSecond line');
  });

  it('blockquote', () => {
    expect(toHtml('> First line\n> Second line\n\n'))
      .toEqual('<blockquote>\n<p>First line\nSecond line</p>\n</blockquote>\n');
    expect(toText('> First line\n> Second line\n\n'))
      .toEqual('First line\nSecond line\n');
  });

  it('html', () => {
    expect(toText('<pre>Some code</pre>')).toEqual('');
    expect(toText('<table>\n<tr>\n<td>Cell 1\n</td>\n<td>Cell 2\n</td>\n</tr>\n</table>')).toEqual('');
    expect(toText('<!-- Html comment\n-->')).toEqual('');
  });

  it('heading', () => {
    [1, 2, 3, 4, 5, 6].forEach(n => {
      let md = '#'.repeat(n) + ' Title';
      expect(toHtml(md)).toEqual(`<h${n} id="title">Title</h${n}>\n`);
      expect(toText(md)).toEqual('Title');
    });
    expect(toHtml('Title\n=====')).toEqual('<h1 id="title">Title</h1>\n');
    expect(toText('Title\n=====')).toEqual('Title');
    expect(toHtml('Title\n-----')).toEqual('<h2 id="title">Title</h2>\n');
    expect(toText('Title\n-----')).toEqual('Title');
  });

  it('hr', () => {
    expect(toText('---')).toEqual('');
  });
  
  it('list', () => {
    const items = [1, 2, 3];
    expect(toText(items.map(n => `* List item ${n}`).join('\n')))
      .toEqual(items.map(n => `List item ${n}\n`).join(''));
    expect(toText(items.map(n => `- List item ${n}`).join('\n')))
      .toEqual(items.map(n => `List item ${n}\n`).join(''));
    expect(toText(items.map(n => `+ List item ${n}`).join('\n')))
      .toEqual(items.map(n => `List item ${n}\n`).join(''));
    expect(toText(items.map(n => `${n}. List item ${n}`).join('\n')))
      .toEqual(items.map(n => `List item ${n}\n`).join(''));
  });

  it('paragraph', () => {
    const items = [1, 2, 3];
    const md = items.map(n => `Paragraph No ${n}\n`).join('');
    expect(toText(md)).toEqual(items.map(n => `Paragraph No ${n}\n`).join(''));
  });

  it('table', () => {
    const cells = [1, 2, 3];
    const header = '| ' + cells.map(n => `Head ${n}`).join(' | ') + ' |\n' +
      '| ' + cells.map(n => '---').join(' | ') + ' |\n';
    const row = '| ' + cells.map(n => `Cell ${n}`).join(' | ') + ' |\n';
    expect(toText(header + row.repeat(3))).toEqual(
      cells.map(n => `Head ${n} `).join('') + '\n' +
      (cells.map(n => `Cell ${n} `).join('') + '\n').repeat(3)
    );
  });

  it('strong', () => {
    expect(toText('Some text, **strong fragment**.\n'))
      .toEqual('Some text, strong fragment.\n');
  });

  it('em', () => {
    expect(toText('Some text, *em fragment*.\n'))
      .toEqual('Some text, em fragment.\n');
    expect(toText('Some text, __em fragment__.\n'))
    .toEqual('Some text, em fragment.\n');
  });

  it('codespan', () => {
    expect(toText('Use the `printf()` function.\n'))
      .toEqual('Use the printf() function.\n');
  });

  it('del', () => {
    expect(toText('~del text~\n')).toEqual('del text\n');
    expect(toText('~~del text~~\n')).toEqual('del text\n');
  });

  it('link', () => {
    expect(toText('[Link Google](https://www.google.com)\n\n[Yandex]\n\n[Yandex]: https://yandex.ru\n')).toEqual('Link Google\nYandex\n');
  });

  it('image', () => {
    expect(toText('![Alt text](/path/to/img.jpg)')).toEqual('\n');
    expect(toText('![Alt text](/path/to/img.jpg "Optional title")')).toEqual('\n');
  });
 });