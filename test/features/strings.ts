import { expect } from '@jest/globals';
import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

type StringType = '""' | "''" | 'U&""' | "U&''" | "N''" | "X''" | "B''" | "R''";

export default function supportsStrings(format: FormatFn, stringTypes: StringType[]) {
  if (stringTypes.includes('""')) {
    it('supports double-quoted strings', () => {
      expect(format('"foo JOIN bar"')).toBe('"foo JOIN bar"');
      expect(format('"foo \\" JOIN bar"')).toBe('"foo \\" JOIN bar"');
      expect(format('SELECT "where" FROM "update"')).toBe(dedent`
        SELECT
          "where"
        FROM
          "update"
      `);
    });

    it('supports escaping double-quote by doubling it', () => {
      expect(format('"foo""bar"')).toBe('"foo""bar"');
    });
  }

  if (stringTypes.includes("''")) {
    it('supports single-quoted strings', () => {
      expect(format("'foo JOIN bar'")).toBe("'foo JOIN bar'");
      expect(format("'foo \\' JOIN bar'")).toBe("'foo \\' JOIN bar'");
      expect(format("SELECT 'where' FROM 'update'")).toBe(dedent`
        SELECT
          'where'
        FROM
          'update'
      `);
    });

    it('supports escaping single-quote by doubling it', () => {
      expect(format("'foo''bar'")).toBe("'foo''bar'");
    });
  }

  if (stringTypes.includes('U&""')) {
    it('supports unicode double-quoted strings', () => {
      expect(format('U&"foo JOIN bar"')).toBe('U&"foo JOIN bar"');
      expect(format('U&"foo \\" JOIN bar"')).toBe('U&"foo \\" JOIN bar"');
      expect(format('SELECT U&"where" FROM U&"update"')).toBe(dedent`
        SELECT
          U&"where"
        FROM
          U&"update"
      `);
    });

    it("detects consecutive U&'' strings as separate ones", () => {
      expect(format("U&'foo'U&'bar'")).toBe("U&'foo' U&'bar'");
    });
  }

  if (stringTypes.includes("U&''")) {
    it('supports single-quoted strings', () => {
      expect(format("U&'foo JOIN bar'")).toBe("U&'foo JOIN bar'");
      expect(format("U&'foo \\' JOIN bar'")).toBe("U&'foo \\' JOIN bar'");
      expect(format("SELECT U&'where' FROM U&'update'")).toBe(dedent`
        SELECT
          U&'where'
        FROM
          U&'update'
      `);
    });
  }

  if (stringTypes.includes("N''")) {
    it('supports T-SQL unicode strings', () => {
      expect(format("N'foo JOIN bar'")).toBe("N'foo JOIN bar'");
      expect(format("N'foo \\' JOIN bar'")).toBe("N'foo \\' JOIN bar'");
      expect(format("SELECT N'where' FROM N'update'")).toBe(dedent`
        SELECT
          N'where'
        FROM
          N'update'
      `);
    });

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

  if (stringTypes.includes("R''")) {
    it('supports raw strings', () => {
      expect(format("r'abc'")).toBe("r'abc'");
      expect(format("R'ha ha'")).toBe("R'ha ha'");
      expect(format("SELECT r'some text' FROM foo")).toBe(dedent`
        SELECT
          r'some text'
        FROM
          foo
      `);
    });

    it("detects consecutive r'' strings as separate ones", () => {
      expect(format("r'a ha'r'hm mm'")).toBe("r'a ha' r'hm mm'");
    });
  }
}
