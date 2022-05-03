import dedent from 'dedent-js';
import { NewlineMode } from '../../src/types';

export default function supportsNewlineOptions(language, format) {
  it('throws error when newline is negative number', () => {
    expect(() => {
      format('SELECT *', { newline: -1 });
    }).toThrowErrorMatchingInlineSnapshot(`"newline config must be a positive number."`);
  });

  it('throws error when newline is zero', () => {
    expect(() => {
      format('SELECT *', { newline: 0 });
    }).toThrowErrorMatchingInlineSnapshot(`"newline config must be a positive number."`);
  });

  it('throws error when lineWidth negative number', () => {
    expect(() => {
      format('SELECT *', { newline: NewlineMode.lineWidth, lineWidth: -2 });
    }).toThrowErrorMatchingInlineSnapshot(
      `"lineWidth config must be positive number. Received -2 instead."`
    );
  });

  it('throws error when lineWidth is zero', () => {
    expect(() => {
      format('SELECT *', { newline: NewlineMode.lineWidth, lineWidth: 0 });
    }).toThrowErrorMatchingInlineSnapshot(
      `"lineWidth config must be positive number. Received 0 instead."`
    );
  });

  describe('newline: always', () => {
    it('always splits to multiple lines, even when just a single clause', () => {
      const result = format('SELECT foo, bar FROM qux;', {
        newline: NewlineMode.always,
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

  describe('newline: never', () => {
    it('never splits to multiple lines, regardless of count', () => {
      const result = format('SELECT foo, bar, baz, qux FROM corge;', {
        newline: NewlineMode.never,
      });
      expect(result).toBe(dedent`
        SELECT foo, bar, baz, qux
        FROM corge;
      `);
    });

    it('places whole CREATE TABLE to single line', () => {
      expect(
        format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);', {
          newline: NewlineMode.never,
        })
      ).toBe('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);');
    });
  });

  describe('newline: number', () => {
    it('splits to multiple lines when more clauses than than the specified number', () => {
      const result = format('SELECT foo, bar, baz, qux FROM corge;', {
        newline: 3,
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
        newline: 3,
      });
      expect(result).toBe(dedent`
        SELECT foo, bar, baz
        FROM corge;
      `);
    });

    it('does not split to multiple lines when less clauses than than the specified number', () => {
      const result = format('SELECT foo, bar FROM corge;', {
        newline: 3,
      });
      expect(result).toBe(dedent`
        SELECT foo, bar
        FROM corge;
      `);
    });

    it('regardless of count, splits up long clauses (exceeding default lineWidth 50)', () => {
      const result = format(
        'SELECT customers.phone_number AS phone, customers.address AS addr FROM customers;',
        {
          newline: 3,
        }
      );
      expect(result).toBe(dedent`
        SELECT
          customers.phone_number AS phone,
          customers.address AS addr
        FROM customers;
      `);
    });

    it('does not smaller nr of clauses when their line width is exactly 50', () => {
      const result = format('SELECT customer.phone phone, customer.addr AS addr FROM customers;', {
        newline: 3,
      });
      expect(result).toBe(dedent`
        SELECT customer.phone phone, customer.addr AS addr
        FROM customers;
      `);
    });

    it('splits up even short clauses when lineWidth is small', () => {
      const result = format('SELECT foo, bar FROM customers GROUP BY foo, bar;', {
        newline: 3,
        lineWidth: 10,
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
        newline: 3,
      });
      expect(result).toBe(dedent`
        SELECT foo, some_function(a, b, c) AS bar
        FROM table1;
      `);
    });

    // TODO: the placement of closing paren is wrong
    it('ignores commas inside nested parenthesis', () => {
      const result = format('SELECT foo, func1(func2(a), b, c, d)) AS bar FROM table1;', {
        newline: 3,
      });
      expect(result).toBe(dedent`
        SELECT foo, func1(func2(a), b, c, d)
        ) AS bar
        FROM table1;
      `);
    });
  });

  describe('newline: lineWidth', () => {
    it('splits to multiple lines when single line would exceed specified lineWidth', () => {
      const result = format(
        'SELECT first_field, second_field FROM some_excessively_long_table_name;',
        {
          newline: NewlineMode.lineWidth,
          lineWidth: 20,
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
  });
}
