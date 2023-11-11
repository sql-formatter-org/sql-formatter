import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

interface ArrayLiteralConfig {
  withArrayPrefix?: boolean;
  withoutArrayPrefix?: boolean;
}

export default function supportsArrayLiterals(format: FormatFn, cfg: ArrayLiteralConfig = {}) {
  if (cfg.withArrayPrefix) {
    it('supports ARRAY[] literals', () => {
      expect(
        format(
          `SELECT ARRAY[1, 2, 3] FROM ARRAY['cammon', 'seriously', 'this', 'is', 'one', 'hello-of-a', 'damn', 'long', 'array'];`
        )
      ).toBe(dedent`
        SELECT
          ARRAY[1, 2, 3]
        FROM
          ARRAY[
            'cammon',
            'seriously',
            'this',
            'is',
            'one',
            'hello-of-a',
            'damn',
            'long',
            'array'
          ];
      `);
    });
  }

  if (cfg.withoutArrayPrefix) {
    it('supports array literals', () => {
      expect(
        format(
          `SELECT [1, 2, 3] FROM ['cammon', 'seriously', 'this', 'is', 'one', 'hello-of-a', 'damn', 'long', 'array'];`
        )
      ).toBe(dedent`
        SELECT
          [1, 2, 3]
        FROM
          [
            'cammon',
            'seriously',
            'this',
            'is',
            'one',
            'hello-of-a',
            'damn',
            'long',
            'array'
          ];
      `);
    });
  }
}
