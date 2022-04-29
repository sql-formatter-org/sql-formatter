import dedent from 'dedent-js';
import { CommaPosition } from '../../src/types';

export default function supportsCommaModes(language, format) {
  it('defaults to comma after column', () => {
    const result = format(
      'SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon'
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

  it('supports comma before column', () => {
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

  it('supports tabular mode', () => {
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
}
