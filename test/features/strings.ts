import { expect } from '@jest/globals';
import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

type StringType =
  // Note: ""-qq and ""-bs can be combined to allow for both types of escaping
  | '""-qq' // with repeated-quote escaping
  | '""-bs' // with backslash escaping
  // Note: ''-qq and ''-bs can be combined to allow for both types of escaping
  | "''-qq" // with repeated-quote escaping
  | "''-bs" // with backslash escaping
  | "U&''" // with repeated-quote escaping
  | '$$' // with repeated-quote escaping
  | "N''" // with escaping style depending on whether also ''-qq or ''-bs was specified
  | "X''" // no escaping
  | 'X""' // no escaping
  | "B''" // no escaping
  | 'B""' // no escaping
  | "R''" // no escaping
  | 'R""'; // no escaping

export default function supportsStrings(format: FormatFn, stringTypes: StringType[]) {
  if (stringTypes.includes('""-qq') || stringTypes.includes('""-bs')) {
    it('supports double-quoted strings', () => {
      expect(format('"foo JOIN bar"')).toBe('"foo JOIN bar"');
      expect(format('SELECT "where" FROM "update"')).toBe(dedent`
        SELECT
          "where"
        FROM
          "update"
      `);
    });
  }

  if (stringTypes.includes('""-qq')) {
    it('supports escaping double-quote by doubling it', () => {
      expect(format('"foo""bar"')).toBe('"foo""bar"');
    });

    if (!stringTypes.includes('""-bs')) {
      it('does not support escaping double-quote with a backslash', () => {
        expect(() => format('"foo \\" JOIN bar"')).toThrowError('Parse error: Unexpected """');
      });
    }
  }

  if (stringTypes.includes('""-bs')) {
    it('supports escaping double-quote with a backslash', () => {
      expect(format('"foo \\" JOIN bar"')).toBe('"foo \\" JOIN bar"');
    });

    if (!stringTypes.includes('""-qq')) {
      it('does not support escaping double-quote by doubling it', () => {
        expect(format('"foo "" JOIN bar"')).toBe('"foo " " JOIN bar"');
      });
    }
  }

  if (stringTypes.includes("''-qq") || stringTypes.includes("''-bs")) {
    it('supports single-quoted strings', () => {
      expect(format("'foo JOIN bar'")).toBe("'foo JOIN bar'");
      expect(format("SELECT 'where' FROM 'update'")).toBe(dedent`
        SELECT
          'where'
        FROM
          'update'
      `);
    });
  }

  if (stringTypes.includes("''-qq")) {
    it('supports escaping single-quote by doubling it', () => {
      expect(format("'foo''bar'")).toBe("'foo''bar'");
    });

    if (!stringTypes.includes("''-bs")) {
      it('does not support escaping single-quote with a backslash', () => {
        expect(() => format("'foo \\' JOIN bar'")).toThrowError(`Parse error: Unexpected "'"`);
      });
    }
  }

  if (stringTypes.includes("''-bs")) {
    it('supports escaping single-quote with a backslash', () => {
      expect(format("'foo \\' JOIN bar'")).toBe("'foo \\' JOIN bar'");
    });

    if (!stringTypes.includes("''-qq")) {
      it('does not support escaping single-quote by doubling it', () => {
        expect(format("'foo '' JOIN bar'")).toBe("'foo ' ' JOIN bar'");
      });
    }
  }

  if (stringTypes.includes("U&''")) {
    it('supports unicode single-quoted strings', () => {
      expect(format("U&'foo JOIN bar'")).toBe("U&'foo JOIN bar'");
      expect(format("SELECT U&'where' FROM U&'update'")).toBe(dedent`
        SELECT
          U&'where'
        FROM
          U&'update'
      `);
    });

    it("supports escaping in U&'' strings with repeated quote", () => {
      expect(format("U&'foo '' JOIN bar'")).toBe("U&'foo '' JOIN bar'");
    });

    it("detects consecutive U&'' strings as separate ones", () => {
      expect(format("U&'foo'U&'bar'")).toBe("U&'foo' U&'bar'");
    });
  }

  if (stringTypes.includes('$$')) {
    it('supports unicode strings between $$', () => {
      expect(format('$$foo JOIN bar$$')).toBe('$$foo JOIN bar$$');
      expect(format(`SELECT $$where🍞$$`)).toBe(dedent`
        SELECT
          $$where🍞$$
      `);
    });

    it('ignores single-quotes inside of the $$ string', () => {
      expect(format("$$'foo' 'bar'$$")).toBe("$$'foo' 'bar'$$");
    });

    it('ignores double-quotes inside of the $$ string', () => {
      expect(format('$$"foo" "bar"$$')).toBe('$$"foo" "bar"$$');
    });

    it('detects consecutive $$ strings as separate ones', () => {
      expect(format('$$foo$$$$bar$$')).toBe('$$foo$$ $$bar$$');
    });
  }
  if (stringTypes.includes("N''")) {
    it('supports T-SQL unicode strings', () => {
      expect(format("N'foo JOIN bar'")).toBe("N'foo JOIN bar'");
      expect(format("SELECT N'where' FROM N'update'")).toBe(dedent`
        SELECT
          N'where'
        FROM
          N'update'
      `);
    });

    if (stringTypes.includes("''-qq")) {
      it("supports escaping in N'' strings with repeated quote", () => {
        expect(format("N'foo '' JOIN bar'")).toBe("N'foo '' JOIN bar'");
      });
    }
    if (stringTypes.includes("''-bs")) {
      it("supports escaping in N'' strings with a backslash", () => {
        expect(format("N'foo \\' JOIN bar'")).toBe("N'foo \\' JOIN bar'");
      });
    }

    it("detects consecutive N'' strings as separate ones", () => {
      expect(format("N'foo'N'bar'")).toBe("N'foo' N'bar'");
    });
  }

  if (stringTypes.includes("X''")) {
    it('supports hex byte sequences', () => {
      expect(format("x'0E'")).toBe("x'0E'");
      expect(format("X'1F0A89C3'")).toBe("X'1F0A89C3'");
      expect(format("SELECT x'2B' FROM foo")).toBe(dedent`
        SELECT
          x'2B'
        FROM
          foo
      `);
    });

    it("detects consecutive X'' strings as separate ones", () => {
      expect(format("X'AE01'X'01F6'")).toBe("X'AE01' X'01F6'");
    });
  }

  if (stringTypes.includes('X""')) {
    it('supports hex byte sequences', () => {
      expect(format(`x"0E"`)).toBe(`x"0E"`);
      expect(format(`X"1F0A89C3"`)).toBe(`X"1F0A89C3"`);
      expect(format(`SELECT x"2B" FROM foo`)).toBe(dedent`
        SELECT
          x"2B"
        FROM
          foo
      `);
    });

    it(`detects consecutive X" strings as separate ones`, () => {
      expect(format(`X"AE01"X"01F6"`)).toBe(`X"AE01" X"01F6"`);
    });
  }

  if (stringTypes.includes("B''")) {
    it('supports bit sequences', () => {
      expect(format("b'01'")).toBe("b'01'");
      expect(format("B'10110'")).toBe("B'10110'");
      expect(format("SELECT b'0101' FROM foo")).toBe(dedent`
        SELECT
          b'0101'
        FROM
          foo
      `);
    });

    it("detects consecutive B'' strings as separate ones", () => {
      expect(format("B'1001'B'0110'")).toBe("B'1001' B'0110'");
    });
  }

  if (stringTypes.includes('B""')) {
    it('supports bit sequences (with double-qoutes)', () => {
      expect(format(`b"01"`)).toBe(`b"01"`);
      expect(format(`B"10110"`)).toBe(`B"10110"`);
      expect(format(`SELECT b"0101" FROM foo`)).toBe(dedent`
        SELECT
          b"0101"
        FROM
          foo
      `);
    });

    it(`detects consecutive B"" strings as separate ones`, () => {
      expect(format(`B"1001"B"0110"`)).toBe(`B"1001" B"0110"`);
    });
  }

  if (stringTypes.includes("R''")) {
    it('supports no escaping in raw strings', () => {
      expect(format("SELECT r'some \\',R'text' FROM foo")).toBe(dedent`
        SELECT
          r'some \\',
          R'text'
        FROM
          foo
      `);
    });

    it("detects consecutive r'' strings as separate ones", () => {
      expect(format("r'a ha'r'hm mm'")).toBe("r'a ha' r'hm mm'");
    });
  }

  if (stringTypes.includes('R""')) {
    it('supports no escaping in raw strings (with double-quotes)', () => {
      expect(format(`SELECT r"some \\", R"text" FROM foo`)).toBe(dedent`
        SELECT
          r"some \\",
          R"text"
        FROM
          foo
      `);
    });

    it(`detects consecutive r"" strings as separate ones`, () => {
      expect(format(`r"a ha"r"hm mm"`)).toBe(`r"a ha" r"hm mm"`);
    });
  }
}
