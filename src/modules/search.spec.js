import { tokenize, stem, search, fragmentation } from './search';

describe('tokenize', () => {
  it('latin', () => {
    expect(tokenize('simple test')).toEqual(['simple', 'test']);
    expect(tokenize('it has 123 digits')).toEqual(['it', 'has', '123', 'digits']);
    expect(tokenize('well-known brands. it\'s about coffee')).toEqual(['well', 'known', 'brands', 'it', 's', 'about', 'coffee']);
  });

  it('russian', () => {
    expect(tokenize('несмотря на потрясения в мире')).toEqual(['несмотря', 'на', 'потрясения', 'в', 'мире']);
    expect(
      tokenize(
        'правительство разъяснило, что врачи, медсестры и водители должны получать стимулирующие выплаты'
      )
    ).toEqual([
      'правительство',
      'разъяснило',
      'что',
      'врачи',
      'медсестры',
      'и',
      'водители',
      'должны',
      'получать',
      'стимулирующие',
      'выплаты',
    ]);
  });

  it('complex', () => {
    expect(tokenize('вес составит ~1.9 килограмм')).toEqual([
      'вес',
      'составит',
      '1.9',
      'килограмм',
    ]);
    expect(
      tokenize('мониторинг с открытым исходным кодом zabbix 5.0.3 lts')
    ).toEqual([
      'мониторинг',
      'с',
      'открытым',
      'исходным',
      'кодом',
      'zabbix',
      '5.0.3',
      'lts',
    ]);
    expect(tokenize('at 7 o\'clock')).toEqual(['at', '7', 'o', 'clock']);
    expect(tokenize('ёж начинает в 18:30')).toEqual([
      'ёж',
      'начинает',
      'в',
      '18:30',
    ]);
  });

  it('europian', () => {
    expect(
      tokenize(
        'esmu jūsu menedžeris, atbildēšu uz jūsu jautājumiem, palīdzēšu saplānot jūsu ceļojumu.'
      )
    ).toEqual([
      'esmu',
      'jūsu',
      'menedžeris',
      'atbildēšu',
      'uz',
      'jūsu',
      'jautājumiem',
      'palīdzēšu',
      'saplānot',
      'jūsu',
      'ceļojumu',
    ]);
    expect(
      tokenize(
        'le français est une langue indo-européenne de la famille des langues romanes.'
      )
      ).toEqual([
      'le',
      'français',
      'est',
      'une',
      'langue',
      'indo',
      'européenne',
      'de',
      'la',
      'famille',
      'des',
      'langues',
      'romanes',
    ]);
    expect(
      tokenize('el francés es también uno de los idiomas oficiales de bélgica ')
    ).toEqual([
      'el',
      'francés',
      'es',
      'también',
      'uno',
      'de',
      'los',
      'idiomas',
      'oficiales',
      'de',
      'bélgica',
    ]);
    expect(
      tokenize('розвинулась на території сучасної франції з групи романських діалектів ойль')
    ).toEqual([
      'розвинулась',
      'на',
      'території',
      'сучасної',
      'франції',
      'з',
      'групи',
      'романських',
      'діалектів',
      'ойль',
    ]);
  });
});

describe('stem', () => { 
  it('english', () => {
    expect(['git','allow','unicode','chars'].map(stem)).toEqual([
      'git',
      'allow',
      'unicod',
      'char',
    ]);
    expect(['npm', 'install', 'package', 'grobally'].map(stem)).toEqual([
      'npm',
      'instal',
      'packag',
      'grobal',
    ]);
    
  });

  it('russian', () => { 
    expect(['git', 'использование', 'русских', 'символов'].map(stem)).toEqual([
      'git',
      'использован',
      'русск',
      'символ',
    ]);
    expect(['npm', 'установка', 'пакета', 'глобально'].map(stem)).toEqual([
      'npm',
      'установк',
      'пакет',
      'глобальн',
    ]);
  });
});

describe('search', () => { 
  it('cyrillic', () => { 
    const text =
      'Говорили про ужин.\nДавайте поужинаем?\nЧем, говорю, ужинать будет?\nА поговорить за ужином?\nЗа ужином были разговоры про разное. Слышался одесский говор.';
    let found = search(text, ['говор', 'про', 'ужин']);
    Object.keys(found)
      .forEach(stem => found[stem]
        .forEach(positions => expect(String.prototype.slice.apply(text, positions).toLowerCase().startsWith(stem))
          .toBeTruthy()
      ));
    found = search(text, ['поход', 'доход']);
    expect(found).toEqual({ 'поход': [], 'доход': [] });
    found = search(text, ['был', 'чем', 'поход']);
    expect(found).toEqual({ 'был': [[100, 104]], 'чем': [[38, 41]], 'поход': [] });
    // console.info(found);
  });

  it('latin', () => { 
    const text = 'What\'s interesting about this syntax is that any type other than \'string\' for the key is actually wrong. Makes perfect sense, given that JS maps are explicitly keyed by strings, but it does make the syntax somewhat redundant';
    let found = search(text, ['what', 'string', 'development']);
    expect(found).toEqual({
      'what': [[0, 4]],
      'string': [[66, 72], [169, 176]],
      'development': []
    });
    // console.info(found);
  });
});

describe('fragmentation', () => {
  it('slicing', () => { 
    const text =
      'Сегодня мы рассмотрим ряд базовых операций, которые регулярно потребуется выполнять администратору среды виртуализации.';
    let fragments = fragmentation(text, [[11, 21], [0, 7]]);
    expect(fragments).toEqual([
      [{ fragment: 'Сегодня' }],
      [{ fragment: 'рассмотрим' }]
    ]);
    fragments = fragmentation(text, [[0, 7], [11, 21]]);
    expect(fragments).toEqual([
      [{ fragment: 'Сегодня' }],
      [{ fragment: 'рассмотрим' }]
    ]);
    fragments = fragmentation(text, [[8, 10]]);
    expect(fragments).toEqual([[{ fragment: 'мы' }]]);
    fragments = fragmentation(text, [[8, 10]], 3);
    expect(fragments).toEqual([
      [{ indent: 'ня ' }, { fragment: 'мы' }, { indent: ' ра' }],
    ]);
    fragments = fragmentation(text, [[8, 10], [22, 25], [34, 42], [99, 104]], 16);
    expect(fragments).toEqual([
      [
        { indent: 'Сегодня ' },
        { fragment: 'мы' },
        { indent: ' рассмотрим ' },
        { fragment: 'ряд' },
        { indent: ' базовых ' },
        { fragment: 'операций' },
        { indent: ', которые регуля' }
      ],
      [
        { indent: ' администратору ' },
        { fragment: 'среды' },
        { indent: ' виртуализации.' }
      ]
    ]);
    expect(() => fragmentation(text, [[-10, 10], [22, 25], [34, 42], [99, 999]], 16))
      .toThrow('Negative position not allowed');
    expect(() => fragmentation(text, [[-10, 10], [22, 25], [34, 42], [99, 999]], -16))
      .toThrow('Negative indent not allowed');
    // console.info(fragments);
  });
});

describe('all together', () => {
  it('search', () => {
    const text = 'Node.js делает возможным написание серверных приложений на JavaScript. Он построен на движке JavaScript V8 и написан на C++ — и поэтому он быстрый. Изначально он создавался как серверное окружение для приложений, но разработчики начали использовать его для создания инструментов, помогающих автоматизировать выполнение локальных задач. В итоге возникшая вокруг Node.js новая экосистема инструментов (типа Grunt и Gulp), привела к трансформации процесса фронтенд-разработки.\nЧтобы использовать все эти инструменты (или пакеты) в Node.js нам нужна возможность устанавливать и управлять ими. Для этого создан npm, пакетный менеджер Node.js. Он устанавливает нужные вам пакеты и предоставляет удобный интерфейс для работы с ними. Но перед тем как начать использовать npm, вам надо установить в своей системе Node.js.';
    const stems = search(text, ['приложение', 'пакет', 'инструменты', 'разработка'].map(stem));
    const fragments = fragmentation(text, Object.values(stems).flat(1), 32)
      .map(fragment =>
        fragment
          .map((slice, index, array) => {
            if (slice.indent != null) {
              let prefix = index === 0 ? '...' : '';
              let postfix = (index === array.length - 1) ? '...' : '';
              return prefix + slice.indent + postfix;
            }
            return '<mark>' + slice.fragment + '</mark>';
          })
          .join('')
    );
    expect(fragments).toEqual([
      '...т возможным написание серверных <mark>приложений</mark> на JavaScript. Он построен на д...',
      '...лся как серверное окружение для <mark>приложений</mark>, но разработчики начали использовать его для создания <mark>инструментов</mark>, помогающих автоматизировать вы...',
      '...вокруг Node.js новая экосистема <mark>инструментов</mark> (типа Grunt и Gulp), привела к трансформации процесса фронтенд-<mark>разработки</mark>.\nЧтобы использовать все эти <mark>инструменты</mark> (или <mark>пакеты</mark>) в Node.js нам нужна возможност...',
      '...лять ими. Для этого создан npm, <mark>пакетный</mark> менеджер Node.js. Он устанавливает нужные вам <mark>пакеты</mark> и предоставляет удобный интерфе...',
    ]);
    // console.info(fragments);
   });

});