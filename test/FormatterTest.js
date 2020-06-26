import Formatter from '../src/core/Formatter';

describe('Formatter', () => {
  it('looks back', () => {
    const formatter = new Formatter();
    formatter.tokens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    formatter.index = 0;
    expect(formatter.tokenLookBack()).toStrictEqual([]);
    formatter.index = 3;
    expect(formatter.tokenLookBack()).toStrictEqual([2, 1, 0]);
    expect(formatter.tokenLookBack(2)).toStrictEqual([2, 1]);
    formatter.index = 9;
    expect(formatter.tokenLookBack()).toStrictEqual([8, 7, 6, 5, 4]);
  });

  it('looks ahead', () => {
    const formatter = new Formatter();
    formatter.tokens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    formatter.index = 10;
    expect(formatter.tokenLookAhead()).toStrictEqual([]);
    formatter.index = 7;
    expect(formatter.tokenLookAhead()).toStrictEqual([8, 9, 10]);
    expect(formatter.tokenLookAhead(2)).toStrictEqual([8, 9]);
    formatter.index = 0;
    expect(formatter.tokenLookAhead()).toStrictEqual([1, 2, 3, 4, 5]);
  });
});
