import { NestedComment } from 'src/lexer/NestedComment.js';

describe('NestedComment', () => {
  const match = (input: string, index: number) => {
    const re = new NestedComment();
    re.lastIndex = index;
    return re.exec(input);
  };

  it('matches comment at the start of a string', () => {
    expect(match('/* comment */ blah...', 0)).toEqual(['/* comment */']);
  });

  it('matches empty comment block', () => {
    expect(match('/**/ blah...', 0)).toEqual(['/**/']);
  });

  it('matches comment containing * and / characters', () => {
    expect(match('/** // */ blah...', 0)).toEqual(['/** // */']);
  });

  it('matches only first comment, when two comments in row', () => {
    expect(match('/*com1*//*com2*/ blah...', 0)).toEqual(['/*com1*/']);
  });

  it('matches comment in the middle of a string', () => {
    expect(match('hello /* comment */ blah...', 6)).toEqual(['/* comment */']);
  });

  it('does not match a comment when index not set to its start position', () => {
    expect(match('hello /* comment */ blah...', 1)).toEqual(null);
  });

  it('does not match unclosed comment', () => {
    expect(match('/* comment blah...', 0)).toEqual(null);
  });

  it('does not match unopened comment', () => {
    expect(match(' comment */ blah...', 0)).toEqual(null);
  });

  it('matches a nested comment', () => {
    expect(match('/* some /* nested */ comment */ blah...', 0)).toEqual([
      '/* some /* nested */ comment */',
    ]);
  });

  it('matches a multi-level nested comment', () => {
    expect(match('/* some /* /* nested */ */ comment */ blah...', 0)).toEqual([
      '/* some /* /* nested */ */ comment */',
    ]);
  });

  it('matches multiple nested comments', () => {
    expect(match('/* some /* n1 */ and /* n2 */ coms */ blah...', 0)).toEqual([
      '/* some /* n1 */ and /* n2 */ coms */',
    ]);
  });

  it('does not match an inproperly nested comment', () => {
    expect(match('/* some /* comment blah...', 0)).toEqual(null);
  });
});
