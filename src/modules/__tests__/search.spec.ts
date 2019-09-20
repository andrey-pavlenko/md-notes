import { sentencenize, tokenize } from '../search';
import { Trie } from '../trie';

describe('Tokenize', () => {
  it('sentencenize', () => {
    const strings = [
      'Первое предложение.',
      'Второе предложение.',
      'Третье предложение.',
      'Длина 11.5 м!',
      'Температура 36.6?',
      'Уголовный кодекс, ст. 315...',
    ];
    expect(sentencenize(strings.join(''))).toEqual(strings);
    expect(sentencenize(strings.join('\n') + '\n')).toEqual(strings);
    expect(sentencenize(strings.join('\r\n') + '\r\n')).toEqual(strings);
  });

  it('tokenize', () => {
    const text = 'Моя почта test@qui-quo.ru, пишите!\nБуду ждать';
    expect(tokenize(text)).toEqual(['Моя', 'почта', 'test', 'qui', 'quo', 'ru', 'пишите', 'Буду', 'ждать']);
  });
});

describe('Trie', () => {

  it('latin', () => {
    const words = ['ball', 'bat', 'boss', 'doll', 'dork', 'do', 'send', 'sense'];
    const trie = new Trie();
    words.forEach((word) => trie.add(word));
    words.forEach((word) => expect(trie.contains(word)).toBeTruthy());
    expect(trie.words).toEqual(words);
    ['ba', 'ballet', 'dor', 'done', 'se', 'sending']
      .forEach((word) => expect(trie.contains(word)).toBeFalsy());
  });

  it('cyrillic', () => {
    const words = ['молоко', 'молочный', 'конфета', 'конфети', 'ужать', 'ужимать', 'уж'];
    const trie = new Trie();
    words.forEach((word) => trie.add(word));
    words.forEach((word) => expect(trie.contains(word)).toBeTruthy());
    expect(trie.words).toEqual(words);
    ['моло', 'молочные', 'конф', 'конференция', 'ужин', 'у']
      .forEach((word) => expect(trie.contains(word)).toBeFalsy());
  });

  it('serialize', () => {
    const words = ['ball', 'bat', 'boss', 'doll', 'dork', 'do', 'send', 'sense', 'молоко', 'молочный', 'конфета', 'конфети', 'ужать', 'ужимать', 'уж'];
    const trie = new Trie();
    words.forEach((word) => trie.add(word));
    const serial = trie.serialize();
    const newTrie = Trie.deserialize(serial);
    const newSerial = newTrie.serialize();
    expect(newSerial).toEqual(serial);
    words.forEach((word) => expect(newTrie.contains(word)).toBeTruthy());
    expect(newTrie.words).toEqual(trie.words);
  });

  it('match', () => {
    const words = ['уж', 'ужин', 'ужинать', 'ужимки', 'конфета', 'конфети', 'шоколад', 'doll', 'dollar'];
    const trie = new Trie();
    words.forEach((word) => trie.add(word));
    ['уж', 'конф', 'doll'].forEach((prefix) => {
      expect(trie.match(prefix).sort())
        .toEqual(words.filter((w) => w.startsWith(prefix)).sort());
    });
  });

  it('add', () => {
    const words = ['уж', 'ужин', 'ужинать', 'ужимки', 'конфета', 'конфети', 'шоколад', 'doll', 'dollar'];
    expect(new Trie().add(words).words.sort())
      .toEqual(words.sort());
  });

  it('clear', () => {
    const words = ['уж', 'ужин', 'ужинать', 'ужимки', 'конфета', 'конфети', 'шоколад', 'doll', 'dollar'];
    const trie = new Trie().add(words);
    expect(trie.words.sort()).toEqual(words.sort());
    expect(trie.clear().words).toEqual([]);
  });
});
