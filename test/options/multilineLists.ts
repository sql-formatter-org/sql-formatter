import dedent from 'dedent-js';
import { FormatFn } from '../../src/sqlFormatter';

export default function supportsMultilineLists(format: FormatFn) {
  it('throws error when multilineLists is negative number', () => {
    expect(() => {
      format('SELECT *', { multilineLists: -1 });
    }).toThrowErrorMatchingInlineSnapshot(`"multilineLists config must be a positive number."`);
  });

  it('throws error when multilineLists is zero', () => {
    expect(() => {
      format('SELECT *', { multilineLists: 0 });
    }).toThrowErrorMatchingInlineSnapshot(`"multilineLists config must be a positive number."`);
  });

  describe('multilineLists: always', () => {
    it('always splits to multiple lines, even when just a single clause', () => {
      const result = format('SELECT foo, bar FROM qux;', {
        multilineLists: 'always',
      });
      expect(result).toBe(dedent`
        SELECT
          foo,
          bar
        FROM
          qux;
      `);
    });
  });

  describe('multilineLists: avoid', () => {
    it('does not split to multiple lines, regardless of count', () => {
      const result = format('SELECT foo, bar, baz, qux FROM corge;', {
        multilineLists: 'avoid',
      });
      expect(result).toBe(dedent`
        SELECT foo, bar, baz, qux
        FROM corge;
      `);
    });

    it('places whole CREATE TABLE to single line', () => {
      expect(
        format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);', {
          multilineLists: 'avoid',
        })
      ).toBe('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);');
    });
  });

  describe('multilineLists: number', () => {
    it('splits to multiple lines when more clauses than than the specified number', () => {
      const result = format('SELECT foo, bar, baz, qux FROM corge;', {
        multilineLists: 3,
      });
      expect(result).toBe(dedent`
        SELECT
          foo,
          bar,
          baz,
          qux
        FROM corge;
      `);
    });

    it('does not split to multiple lines when the same number of clauses as specified number', () => {
      const result = format('SELECT foo, bar, baz FROM corge;', {
        multilineLists: 3,
      });
      expect(result).toBe(dedent`
        SELECT foo, bar, baz
        FROM corge;
      `);
    });

    it('does not split to multiple lines when less clauses than than the specified number', () => {
      const result = format('SELECT foo, bar FROM corge;', {
        multilineLists: 3,
      });
      expect(result).toBe(dedent`
        SELECT foo, bar
        FROM corge;
      `);
    });

    it('regardless of count, splits up long clauses (exceeding default expressionWidth 50)', () => {
      const result = format(
        'SELECT customers.phone_number AS phone, customers.address AS addr FROM customers;',
        {
          multilineLists: 3,
        }
      );
      expect(result).toBe(dedent`
        SELECT
          customers.phone_number AS phone,
          customers.address AS addr
        FROM customers;
      `);
    });

    it('does not split smaller nr of clauses when their line width is exactly 50', () => {
      const result = format('SELECT customer.phone phone, customer.addr AS addr FROM customers;', {
        multilineLists: 3,
      });
      expect(result).toBe(dedent`
        SELECT customer.phone phone, customer.addr AS addr
        FROM customers;
      `);
    });

    it('splits up even short clauses when expressionWidth is small', () => {
      const result = format('SELECT foo, bar FROM customers GROUP BY foo, bar;', {
        multilineLists: 3,
        expressionWidth: 10,
      });
      expect(result).toBe(dedent`
        SELECT
          foo,
          bar
        FROM
          customers
        GROUP BY
          foo,
          bar;
      `);
    });

    it('ignores commas inside parenthesis when counting clauses', () => {
      const result = format('SELECT foo, some_function(a, b, c) AS bar FROM table1;', {
        multilineLists: 3,
      });
      expect(result).toBe(dedent`
        SELECT foo, some_function(a, b, c) AS bar
        FROM table1;
      `);
    });

    // TODO: the placement of closing paren is wrong
    it('ignores commas inside nested parenthesis', () => {
      const result = format('SELECT foo, func1(func2(a), b, c, d)) AS bar FROM table1;', {
        multilineLists: 3,
      });
      expect(result).toBe(dedent`
        SELECT foo, func1(func2(a), b, c, d)
        ) AS bar
        FROM table1;
      `);
    });
  });

  describe('multilineLists: expressionWidth', () => {
    it('splits to multiple lines when single line would exceed specified expressionWidth', () => {
      const result = format(
        'SELECT first_field, second_field FROM some_excessively_long_table_name;',
        {
          multilineLists: 'expressionWidth',
          expressionWidth: 20,
        }
      );
      expect(result).toBe(dedent`
        SELECT
          first_field,
          second_field
        FROM
          some_excessively_long_table_name;
      `);
    });

    it('does not split to multiple lines when line at or below specified expressionWidth', () => {
      const result = format('SELECT field1, field2 FROM table_name;', {
        multilineLists: 'expressionWidth',
        expressionWidth: 21,
      });
      expect(result).toBe(dedent`
        SELECT field1, field2
        FROM table_name;
      `);
    });
  });
}
