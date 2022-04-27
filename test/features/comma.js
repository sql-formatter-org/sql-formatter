import dedent from 'dedent-js';

/**
 * Tests support for alias options
 * @param {Function} format
 */
export default function supportsCommaModes(format) {
	it('supports comma after column', () => {
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

	it('accepts comma before column', () => {
		const result = format(
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

	it('supports tabular mode', () => {
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

	it('accepts tabular mode', () => {
		const result = format(
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
}
