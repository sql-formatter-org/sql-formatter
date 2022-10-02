import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter.js';

interface ParamsTypes {
  positional?: boolean;
  numbered?: ('?' | '$' | ':')[];
  named?: (':' | '$' | '@')[];
  quoted?: ('@""' | '@[]' | '@``')[];
}

export default function supportsParams(format: FormatFn, params: ParamsTypes) {
  describe('supports params', () => {
    if (params.positional) {
      it('leaves ? positional placeholders as is when no params config provided', () => {
        const result = format('SELECT ?, ?, ?;');
        expect(result).toBe(dedent`
          SELECT
            ?,
            ?,
            ?;
        `);
      });

      it('replaces ? positional placeholders with param values', () => {
        const result = format('SELECT ?, ?, ?;', {
          params: ['first', 'second', 'third'],
        });
        expect(result).toBe(dedent`
          SELECT
            first,
            second,
            third;
        `);
      });

      // Regression test for issue #316
      it('replaces ? positional placeholders inside BETWEEN expression', () => {
        const result = format('SELECT name WHERE age BETWEEN ? AND ?;', {
          params: ['5', '10'],
        });
        expect(result).toBe(dedent`
          SELECT
            name
          WHERE
            age BETWEEN 5 AND 10;
        `);
      });
    }

    if (params.numbered?.includes('?')) {
      it('recognizes ? numbered placeholders', () => {
        const result = format('SELECT ?1, ?25, ?2;');
        expect(result).toBe(dedent`
          SELECT
            ?1,
            ?25,
            ?2;
        `);
      });

      it('replaces ? numbered placeholders with param values', () => {
        const result = format('SELECT ?1, ?2, ?0;', {
          params: {
            0: 'first',
            1: 'second',
            2: 'third',
          },
        });
        expect(result).toBe(dedent`
          SELECT
            second,
            third,
            first;
        `);
      });
    }

    if (params.numbered?.includes('$')) {
      it('recognizes $n placeholders', () => {
        const result = format('SELECT $1, $2 FROM tbl');
        expect(result).toBe(dedent`
          SELECT
            $1,
            $2
          FROM
            tbl
        `);
      });

      it('replaces $n placeholders with param values', () => {
        const result = format('SELECT $1, $2 FROM tbl', {
          params: { 1: '"variable value"', 2: '"blah"' },
        });
        expect(result).toBe(dedent`
          SELECT
            "variable value",
            "blah"
          FROM
            tbl
        `);
      });
    }

    if (params.numbered?.includes(':')) {
      it('recognizes :n placeholders', () => {
        const result = format('SELECT :1, :2 FROM tbl');
        expect(result).toBe(dedent`
          SELECT
            :1,
            :2
          FROM
            tbl
        `);
      });

      it('replaces :n placeholders with param values', () => {
        const result = format('SELECT :1, :2 FROM tbl', {
          params: { 1: '"variable value"', 2: '"blah"' },
        });
        expect(result).toBe(dedent`
          SELECT
            "variable value",
            "blah"
          FROM
            tbl
        `);
      });
    }

    if (params.named?.includes(':')) {
      it('recognizes :name placeholders', () => {
        expect(format('SELECT :foo, :bar, :baz;')).toBe(dedent`
          SELECT
            :foo,
            :bar,
            :baz;
        `);
      });

      it('replaces :name placeholders with param values', () => {
        expect(
          format(`WHERE name = :name AND age > :current_age;`, {
            params: { name: "'John'", current_age: '10' },
          })
        ).toBe(dedent`
          WHERE
            name = 'John'
            AND age > 10;
        `);
      });
    }

    if (params.named?.includes('$')) {
      it('recognizes $name placeholders', () => {
        expect(format('SELECT $foo, $bar, $baz;')).toBe(dedent`
          SELECT
            $foo,
            $bar,
            $baz;
        `);
      });

      it('replaces $name placeholders with param values', () => {
        expect(
          format(`WHERE name = $name AND age > $current_age;`, {
            params: { name: "'John'", current_age: '10' },
          })
        ).toBe(dedent`
          WHERE
            name = 'John'
            AND age > 10;
        `);
      });
    }
  });

  if (params.named?.includes('@')) {
    it('recognizes @name placeholders', () => {
      expect(format('SELECT @foo, @bar, @baz;')).toBe(dedent`
        SELECT
          @foo,
          @bar,
          @baz;
      `);
    });

    it('replaces @name placeholders with param values', () => {
      expect(
        format(`WHERE name = @name AND age > @current_age;`, {
          params: { name: "'John'", current_age: '10' },
        })
      ).toBe(dedent`
        WHERE
          name = 'John'
          AND age > 10;
      `);
    });
  }

  if (params.quoted?.includes('@""')) {
    it(`recognizes @"name" placeholders`, () => {
      expect(format(`SELECT @"foo", @"foo bar";`)).toBe(dedent`
        SELECT
          @"foo",
          @"foo bar";
      `);
    });

    it(`replaces @"name" placeholders with param values`, () => {
      expect(
        format(`WHERE name = @"name" AND age > @"current age";`, {
          params: { 'name': "'John'", 'current age': '10' },
        })
      ).toBe(dedent`
        WHERE
          name = 'John'
          AND age > 10;
      `);
    });
  }

  if (params.quoted?.includes('@[]')) {
    it(`recognizes @[name] placeholders`, () => {
      expect(format(`SELECT @[foo], @[foo bar];`)).toBe(dedent`
        SELECT
          @[foo],
          @[foo bar];
      `);
    });

    it(`replaces @[name] placeholders with param values`, () => {
      expect(
        format(`WHERE name = @[name] AND age > @[current age];`, {
          params: { 'name': "'John'", 'current age': '10' },
        })
      ).toBe(dedent`
        WHERE
          name = 'John'
          AND age > 10;
      `);
    });
  }

  if (params.quoted?.includes('@``')) {
    it('recognizes @`name` placeholders', () => {
      expect(format('SELECT @`foo`, @`foo bar`;')).toBe(dedent`
        SELECT
          @\`foo\`,
          @\`foo bar\`;
      `);
    });

    it('replaces @`name` placeholders with param values', () => {
      expect(
        format('WHERE name = @`name` AND age > @`current age`;', {
          params: { 'name': "'John'", 'current age': '10' },
        })
      ).toBe(dedent`
        WHERE
          name = 'John'
          AND age > 10;
      `);
    });
  }
}
