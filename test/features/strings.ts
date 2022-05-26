import { expect } from '@jest/globals';
import dedent from 'dedent-js';
import { FormatFn } from '../../src/sqlFormatter';

export default function supportsStrings(format: FormatFn, stringTypes: string[]) {
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

    it("detects consequitive U&'' strings as separate ones", () => {
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

  if (stringTypes.includes('$$')) {
    it('supports dollar-quoted strings', () => {
      expect(format('$xxx$foo $$ LEFT JOIN $yyy$ bar$xxx$')).toBe(
        '$xxx$foo $$ LEFT JOIN $yyy$ bar$xxx$'
      );
      expect(format('$$foo JOIN bar$$')).toBe('$$foo JOIN bar$$');
      expect(format('$$foo $ JOIN bar$$')).toBe('$$foo $ JOIN bar$$');
      expect(format('$$foo \n bar$$')).toBe('$$foo \n bar$$');
      expect(format('SELECT $$where$$ FROM $$update$$')).toBe(dedent`
        SELECT
          $$where$$
        FROM
          $$update$$
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

    it("detects consequitive N'' strings as separate ones", () => {
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

    it("detects consequitive X'' strings as separate ones", () => {
      expect(format("X'AE01'X'01F6'")).toBe("X'AE01' X'01F6'");
    });
  }

  if (stringTypes.includes("E''")) {
    it('supports strings with C-style escapes', () => {
      expect(format("E'blah blah'")).toBe("E'blah blah'");
      expect(format("E'some \\' FROM escapes'")).toBe("E'some \\' FROM escapes'");
      expect(format("SELECT E'blah' FROM foo")).toBe(dedent`
        SELECT
          E'blah'
        FROM
          foo
      `);
    });

    it("detects consequitive E'' strings as separate ones", () => {
      expect(format("E'foo'E'bar'")).toBe("E'foo' E'bar'");
    });
  }
}
