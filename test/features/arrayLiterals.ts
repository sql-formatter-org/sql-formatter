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
          `SELECT ARRAY[1, 2, 3] FROM ARRAY['come-on', 'seriously', 'this', 'is', 'a', 'very', 'very', 'long', 'array'];`
        )
      ).toBe(dedent`
        SELECT
          ARRAY[1, 2, 3]
        FROM
          ARRAY[
            'come-on',
            'seriously',
            'this',
            'is',
            'a',
            'very',
            'very',
            'long',
            'array'
          ];
      `);
    });

    it('dataTypeCase option does NOT affect ARRAY[] literal case', () => {
      expect(
        format(`SELECT ArrAy[1, 2]`, {
          dataTypeCase: 'upper',
        })
      ).toBe(dedent`
        SELECT
          ArrAy[1, 2]
      `);
    });

    it('keywordCase option affects ARRAY[] literal case', () => {
      expect(
        format(`SELECT ArrAy[1, 2]`, {
          keywordCase: 'upper',
        })
      ).toBe(dedent`
        SELECT
          ARRAY[1, 2]
      `);
    });

    it('dataTypeCase option affects ARRAY type case', () => {
      expect(
        format(`CREATE TABLE foo ( items ArrAy )`, {
          dataTypeCase: 'upper',
        })
      ).toBe(dedent`
        CREATE TABLE foo (items ARRAY)
      `);
    });
  }

  if (cfg.withoutArrayPrefix) {
    it('supports array literals', () => {
      expect(
        format(
          `SELECT [1, 2, 3] FROM ['come-on', 'seriously', 'this', 'is', 'a', 'very', 'very', 'long', 'array'];`
        )
      ).toBe(dedent`
        SELECT
          [1, 2, 3]
        FROM
          [
            'come-on',
            'seriously',
            'this',
            'is',
            'a',
            'very',
            'very',
            'long',
            'array'
          ];
      `);
    });
  }
}
