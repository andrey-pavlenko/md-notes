import { stem } from '../stem-ru';

describe('Stem RU', () => {

  it('stemming', () => {
    expect(stem('Test')).toBeNull();
    expect(stem('Ёлка')).toEqual('елк');
    expect(stem('падший')).toEqual('падш');
    expect(stem('корова')).toEqual('коров');
    expect(stem('коровы')).toEqual('коров');
    expect(stem('коровий')).toEqual('коров');
    expect(stem('молоко')).toEqual('молок');
    expect(stem('молока')).toEqual('молок');
    expect(stem('молоки')).toEqual('молок');
  });
});
