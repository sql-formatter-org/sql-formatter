import { expect } from '@jest/globals';
import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsCommaPosition(format: FormatFn) {
  it('defaults to comma after column', () => {
    const result = format(
      'SELECT alpha , MAX(beta) , delta AS d ,epsilon FROM gamma GROUP BY alpha , delta, epsilon'
    );
    expect(result).toBe(
      dedent`
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
      `
    );
  });

  describe('commaPosition: before', () => {
    it('adds comma before column', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: 'before' }
      );
      expect(result).toBe(
        dedent`
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
        `
      );
    });

    it('handles comments after commas', () => {
      const result = format(
        `SELECT alpha, --comment1
        MAX(beta), --comment2
        delta AS d, epsilon --comment3`,
        { commaPosition: 'before' }
      );
      expect(result).toBe(
        dedent`
          SELECT
            alpha --comment1
          , MAX(beta) --comment2
          , delta AS d
          , epsilon --comment3
        `
      );
    });

    it('works with larger indent', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: 'before', tabWidth: 4 }
      );
      expect(result).toBe(
        dedent`
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
        `
      );
    });

    // This style is fundamentally incompatible with tabs
    it('throws error when tabs used for indentation', () => {
      expect(() => {
        format('SELECT alpha, MAX(beta), delta AS d, epsilon', {
          commaPosition: 'before',
          useTabs: true,
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
        dedent`
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
        `
      );
    });

    it('handles comments after commas', () => {
      const result = format(
        `SELECT alpha, --comment1
        beta,--comment2
        delta, epsilon,--comment3
        iota --comment4`,
        { commaPosition: 'tabular' }
      );
      expect(result).toBe(
        dedent`
          SELECT
            alpha  , --comment1
            beta   , --comment2
            delta  ,
            epsilon, --comment3
            iota --comment4
        `
      );
    });

    it('is not effected by indent size', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: 'tabular', tabWidth: 6 }
      );
      expect(result).toBe(
        dedent`
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
        `
      );
    });

    it('handles tabs', () => {
      const result = format('SELECT alpha, MAX(beta), delta AS d, epsilon', {
        commaPosition: 'tabular',
        useTabs: true,
      });
      expect(result).toBe(
        dedent`
          SELECT
          \talpha     ,
          \tMAX(beta) ,
          \tdelta AS d,
          \tepsilon
        `
      );
    });
  });
}
