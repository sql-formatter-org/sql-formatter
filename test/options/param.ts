import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

interface ParamsTypes {
  indexed?: ('?' | '$')[];
  named?: (':' | '$' | '${}' | '@' | '@""' | '@[]')[];
}

export default function supportsParams(format: FormatFn, params: ParamsTypes) {
  describe('supports params', () => {
    if (params.indexed?.includes('?')) {
      it('leaves ? indexed placeholders as is when no params config provided', () => {
        const result = format('SELECT ?, ?, ?;');
        expect(result).toBe(dedent`
          SELECT
            ?,
            ?,
            ?;
        `);
      });

      it('replaces ? indexed placeholders with param values', () => {
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

      it('recognizes ?[0-9]* placeholders', () => {
        const result = format('SELECT ?1, ?25, ?;');
        expect(result).toBe(dedent`
          SELECT
            ?1,
            ?25,
            ?;
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

    if (params.indexed?.includes('$')) {
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

      it(`recognizes :'name' and :"name" placeholders`, () => {
        expect(format(`SELECT :'foo', :"bar", :"baz";`)).toBe(dedent`
          SELECT
            :'foo',
            :"bar",
            :"baz";
        `);
      });

      it(`replaces :'name' and :"name" placeholders with param values`, () => {
        expect(
          format(`WHERE name = :"name" AND age > :'current_age';`, {
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

      it(`recognizes $'name' and $"name" and $\`name\` placeholders`, () => {
        expect(format(`SELECT $'foo', $"bar", $\`baz\`;`)).toBe(dedent`
          SELECT
            $'foo',
            $"bar",
            $\`baz\`;
        `);
      });

      it(`replaces $'name' and $"name" and $\`name\` placeholders with param values`, () => {
        expect(
          format(`WHERE name = $"name" AND age > $'current_age' OR addr = $\`addr\`;`, {
            params: { name: "'John'", current_age: '10', addr: "'Baker street'" },
          })
        ).toBe(dedent`
          WHERE
            name = 'John'
            AND age > 10
            OR addr = 'Baker street';
        `);
      });

      it('replaces $n numbered placeholders with param values', () => {
        const result = format('SELECT $1, $2, $0;', {
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

    if (params.named?.includes('${}')) {
      // eslint-disable-next-line no-template-curly-in-string
      it('recognizes ${name} placeholders', () => {
        // eslint-disable-next-line no-template-curly-in-string
        const result = format('SELECT ${var_name}, ${var name};');
        expect(result).toBe(dedent`
          SELECT
            \${var_name},
            \${var name};
        `);
      });

      // eslint-disable-next-line no-template-curly-in-string
      it('replaces ${variables} with param values', () => {
        // eslint-disable-next-line no-template-curly-in-string
        const result = format('SELECT ${var 1}, ${var2};', {
          params: {
            'var 1': "'var one'",
            'var2': "'var two'",
          },
        });
        expect(result).toBe(dedent`
          SELECT
            'var one',
            'var two';
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

  if (params.named?.includes('@""')) {
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

  if (params.named?.includes('@[]')) {
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
}
