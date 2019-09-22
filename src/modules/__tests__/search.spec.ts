import { sentencenize, tokenize, removeStopWords, stopWordsRu } from '../search';
import { Trie, weigth } from '../trie';

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

  it('stop words ru', () => {
    const tokens = tokenize('Александра Габышева вынудили пройти психолого-психиатрическую экспертизу, он находится под подпиской о невыезде. Как и предполагалось, на него заведено уголовное дело о призывах к экстремистской деятельности, но за что конкретно - непонятно.'.toLowerCase());
    expect(removeStopWords(tokens, stopWordsRu))
      .toEqual(['александра', 'габышева',
        'вынудили', 'пройти',
        'психолого', 'психиатрическую',
        'экспертизу', 'находится',
        'подпиской', 'невыезде',
        'предполагалось', 'заведено',
        'уголовное', 'дело',
        'призывах', 'экстремистской',
        'деятельности', 'конкретно',
        'непонятно',
    ]);
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
    const words = ['уж', 'ужин', 'ужинать', 'ужимки', 'конфета', 'конфети', 'шоколад', 'doll', 'dollar', 'ели'];
    const trie = new Trie();
    words.forEach((word) => trie.add(word));
    ['уж', 'конф', 'doll', 'ели'].forEach((prefix) => {
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

  it('weigth', () => {
    const trie = new Trie();
    const sentence = 'аккумулятор аккумулирующий значение возвращает функция callback посещения очередного элемента значение initialValue предоставлено смотрите пояснения'.split(' ');
    trie.add(sentence);
    let word = 'аккумул';
    let matches = trie.match(word);
    expect(weigth(word, matches)).toBeGreaterThan(1);
    word = 'значение';
    matches = trie.match(word);
    expect(weigth(word, matches)).toBeGreaterThanOrEqual(1);
    word = 'метод';
    matches = trie.match(word);
    expect(weigth(word, matches)).toEqual(0);
  });
});
