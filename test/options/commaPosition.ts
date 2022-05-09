import { expect } from '@jest/globals';
import dedent from 'dedent-js';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsCommaPosition(language: SqlLanguage, format: FormatFn) {
  it('defaults to comma after column', () => {
    const result = format(
      'SELECT alpha , MAX(beta) , delta AS d ,epsilon FROM gamma GROUP BY alpha , delta, epsilon'
    );
    expect(result).toBe(
      dedent(`
        SELECT
          alpha,
          MAX(beta),
          delta AS d,
          epsilon
        FROM
          gamma
        GROUP BY
          alpha,
          delta,
          epsilon
      `)
    );
  });

  describe('commaPosition: before', () => {
    it('adds comma before column', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: 'before' }
      );
      expect(result).toBe(
        dedent(`
          SELECT
            alpha
          , MAX(beta)
          , delta AS d
          , epsilon
          FROM
            gamma
          GROUP BY
            alpha
          , delta
          , epsilon
        `)
      );
    });

    it('works with larger indent', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: 'before', indent: '    ' }
      );
      expect(result).toBe(
        dedent(`
          SELECT
              alpha
            , MAX(beta)
            , delta AS d
            , epsilon
          FROM
              gamma
          GROUP BY
              alpha
            , delta
            , epsilon
        `)
      );
    });

    // This style is fundamentally incompatible with tabs
    it('throws error when tabs used for indentation', () => {
      expect(() => {
        format('SELECT alpha, MAX(beta), delta AS d, epsilon', {
          commaPosition: 'before',
          indent: '\t',
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"commaPosition: before does not work when tabs are used for indentation."`
      );
    });
  });

  describe('commaPosition: tabular', () => {
    it('aligns commas to a column', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: 'tabular' }
      );
      expect(result).toBe(
        dedent(`
          SELECT
            alpha     ,
            MAX(beta) ,
            delta AS d,
            epsilon
          FROM
            gamma
          GROUP BY
            alpha  ,
            delta  ,
            epsilon
        `)
      );
    });

    it('is not effected by indent size', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: 'tabular', indent: '      ' }
      );
      expect(result).toBe(
        dedent(`
          SELECT
                alpha     ,
                MAX(beta) ,
                delta AS d,
                epsilon
          FROM
                gamma
          GROUP BY
                alpha  ,
                delta  ,
                epsilon
        `)
      );
    });

    it('handles tabs', () => {
      const result = format('SELECT alpha, MAX(beta), delta AS d, epsilon', {
        commaPosition: 'tabular',
        indent: '\t',
      });
      expect(result).toBe(
        dedent(`
          SELECT
          \talpha     ,
          \tMAX(beta) ,
          \tdelta AS d,
          \tepsilon
        `)
      );
    });
  });
}
