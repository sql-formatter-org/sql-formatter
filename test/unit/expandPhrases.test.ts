import { expandSinglePhrase } from '../../src/expandPhrases.js';

describe('expandSinglePhrase()', () => {
  it('returns single item when no [optional blocks] found', () => {
    expect(expandSinglePhrase('INSERT INTO')).toEqual(['INSERT INTO']);
  });

  it('expands expression with one [optional block] at the end', () => {
    expect(expandSinglePhrase('DROP TABLE [IF EXISTS]')).toEqual([
      'DROP TABLE',
      'DROP TABLE IF EXISTS',
    ]);
  });

  it('expands expression with one [optional block] at the middle', () => {
    expect(expandSinglePhrase('CREATE [TEMPORARY] TABLE')).toEqual([
      'CREATE TABLE',
      'CREATE TEMPORARY TABLE',
    ]);
  });

  it('expands expression with one [optional block] at the start', () => {
    expect(expandSinglePhrase('[EXPLAIN] SELECT')).toEqual(['SELECT', 'EXPLAIN SELECT']);
  });

  it('expands multiple [optional] [blocks]', () => {
    expect(expandSinglePhrase('CREATE [OR REPLACE] [MATERIALIZED] VIEW')).toEqual([
      'CREATE VIEW',
      'CREATE OR REPLACE VIEW',
      'CREATE MATERIALIZED VIEW',
      'CREATE OR REPLACE MATERIALIZED VIEW',
    ]);
  });

  it('expands expression with optional [multi|choice|block]', () => {
    expect(expandSinglePhrase('CREATE [TEMP|TEMPORARY|VIRTUAL] TABLE')).toEqual([
      'CREATE TABLE',
      'CREATE TEMP TABLE',
      'CREATE TEMPORARY TABLE',
      'CREATE VIRTUAL TABLE',
    ]);
  });

  it('removes braces around {mandatory} {block}', () => {
    expect(expandSinglePhrase('CREATE {TEMP} {TABLE}')).toEqual(['CREATE TEMP TABLE']);
  });

  it('expands expression with mandatory {multi|choice|block}', () => {
    expect(expandSinglePhrase('CREATE {TEMP|TEMPORARY|VIRTUAL} TABLE')).toEqual([
      'CREATE TEMP TABLE',
      'CREATE TEMPORARY TABLE',
      'CREATE VIRTUAL TABLE',
    ]);
  });

  it('throws error when encountering unbalanced ][-braces', () => {
    expect(() => expandSinglePhrase('CREATE [TABLE')).toThrowErrorMatchingInlineSnapshot(
      `"Unbalanced parenthesis in: CREATE [TABLE"`
    );
    expect(() => expandSinglePhrase('CREATE TABLE]')).toThrowErrorMatchingInlineSnapshot(
      `"Unbalanced parenthesis in: CREATE TABLE]"`
    );
  });

  it('throws error when encountering unbalanced }{-braces', () => {
    expect(() => expandSinglePhrase('CREATE {TABLE')).toThrowErrorMatchingInlineSnapshot(
      `"Unbalanced parenthesis in: CREATE {TABLE"`
    );
    expect(() => expandSinglePhrase('CREATE TABLE}')).toThrowErrorMatchingInlineSnapshot(
      `"Unbalanced parenthesis in: CREATE TABLE}"`
    );
  });
});
