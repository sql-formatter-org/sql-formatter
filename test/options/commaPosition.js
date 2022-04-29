import dedent from 'dedent-js';
import { CommaPosition } from '../../src/types';

export default function supportsCommaPosition(language, format) {
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
        { commaPosition: CommaPosition.before }
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
        { commaPosition: CommaPosition.before, indent: '    ' }
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

    // It seems that this style is fundamentally incompatible with tabs
    it('does not work with tabs :(', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: CommaPosition.before, indent: '\t' }
      );
      expect(result).toBe(
        [
          'SELECT',
          '\talpha',
          '  , MAX(beta)',
          '  , delta AS d',
          '  , epsilon',
          'FROM',
          '\tgamma',
          'GROUP BY',
          '\talpha',
          '  , delta',
          '  , epsilon',
        ].join('\n')
      );
    });
  });

  describe('commaPosition: tabular', () => {
    it('aligns commas to a column', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: CommaPosition.tabular }
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
            alpha   ,
            delta   ,
            epsilon
        `)
      );
    });

    it('is not effected by indent size', () => {
      const result = format(
        'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: CommaPosition.tabular, indent: '      ' }
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
                alpha   ,
                delta   ,
                epsilon
        `)
      );
    });

    it('handles tabs', () => {
      const result = format('SELECT alpha, MAX(beta), delta AS d, epsilon', {
        commaPosition: CommaPosition.tabular,
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
