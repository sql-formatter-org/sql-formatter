import dedent from 'dedent-js';
import { NewlineMode } from '../../src/types';

/**
 * Tests support for all newline options
 * @param {string} language
 * @param {Function} format
 */
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

  it('supports always mode', () => {
    const result = format('SELECT foo, bar, baz FROM qux;', {
      newline: NewlineMode.always,
    });
    expect(result).toBe(dedent`
      SELECT
        foo,
        bar,
        baz
      FROM
        qux;
    `);
  });

  it('supports never mode', () => {
    const result = format('SELECT foo, bar, baz, qux FROM corge;', { newline: NewlineMode.never });
    expect(result).toBe(dedent`
      SELECT foo, bar, baz, qux
      FROM corge;
    `);
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
      const result = format('SELECT foo, (SELECT a, b, c FROM table2) AS bar FROM table1;', {
        newline: 3,
      });
      expect(result).toBe(dedent`
        SELECT foo, (
            SELECT a, b, c
            FROM table2
          ) AS bar
        FROM table1;
      `);
    });
  });

  it('supports lineWidth mode', () => {
    const result = format('SELECT foo, bar, baz, qux FROM corge;', {
      newline: NewlineMode.lineWidth,
      lineWidth: 20,
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
}
