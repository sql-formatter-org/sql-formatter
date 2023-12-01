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

    it('supports preserving ARRAY[] literals keywords casing', () => {
      expect(
        format(
          `SELECT ArrAy[1, 2] FROM aRRAY['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj'];`,
          {
            dataTypeCase: 'preserve',
          }
        )
      ).toBe(dedent`
        SELECT
          ArrAy[1, 2]
        FROM
          aRRAY[
            'aaa',
            'bbb',
            'ccc',
            'ddd',
            'eee',
            'fff',
            'ggg',
            'hhh',
            'iii',
            'jjj'
          ];
      `);
    });

    it('supports converting ARRAY[] literals keywords to uppercase', () => {
      expect(
        format(
          `SELECT ArrAy[1, 2] FROM aRRAY['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj'];`,
          {
            dataTypeCase: 'upper',
          }
        )
      ).toBe(dedent`
        SELECT
          ARRAY[1, 2]
        FROM
          ARRAY[
            'aaa',
            'bbb',
            'ccc',
            'ddd',
            'eee',
            'fff',
            'ggg',
            'hhh',
            'iii',
            'jjj'
          ];
      `);
    });

    it('supports converting ARRAY[] literals keywords to lowercase', () => {
      expect(
        format(
          `SELECT ArrAy[1, 2] FROM aRRAY['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj'];`,
          {
            dataTypeCase: 'lower',
          }
        )
      ).toBe(dedent`
        SELECT
          array[1, 2]
        FROM
          array[
            'aaa',
            'bbb',
            'ccc',
            'ddd',
            'eee',
            'fff',
            'ggg',
            'hhh',
            'iii',
            'jjj'
          ];
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
