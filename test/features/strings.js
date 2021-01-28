/**
 * Tests support for various string syntax
 * @param {Function} format
 * @param {String[]} stringTypes
 */
export default function supportsStrings(format, stringTypes = []) {
  if (stringTypes.includes('""')) {
    it('supports double-quoted strings', () => {
      expect(format('"foo JOIN bar"')).toBe('"foo JOIN bar"');
      expect(format('"foo \\" JOIN bar"')).toBe('"foo \\" JOIN bar"');
    });
  }

  if (stringTypes.includes("''")) {
    it('supports single-quoted strings', () => {
      expect(format("'foo JOIN bar'")).toBe("'foo JOIN bar'");
      expect(format("'foo \\' JOIN bar'")).toBe("'foo \\' JOIN bar'");
    });
  }

  if (stringTypes.includes('``')) {
    it('supports backtick-quoted strings', () => {
      expect(format('`foo JOIN bar`')).toBe('`foo JOIN bar`');
      expect(format('`foo `` JOIN bar`')).toBe('`foo `` JOIN bar`');
    });
  }

  if (stringTypes.includes('U&""')) {
    it('supports unicode double-quoted strings', () => {
      expect(format('U&"foo JOIN bar"')).toBe('U&"foo JOIN bar"');
      expect(format('U&"foo \\" JOIN bar"')).toBe('U&"foo \\" JOIN bar"');
    });
  }

  if (stringTypes.includes("U&''")) {
    it('supports single-quoted strings', () => {
      expect(format("U&'foo JOIN bar'")).toBe("U&'foo JOIN bar'");
      expect(format("U&'foo \\' JOIN bar'")).toBe("U&'foo \\' JOIN bar'");
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
    });
  }

  if (stringTypes.includes('[]')) {
    it('supports [bracket-quoted identifiers]', () => {
      expect(format('[foo JOIN bar]')).toBe('[foo JOIN bar]');
      expect(format('[foo ]] JOIN bar]')).toBe('[foo ]] JOIN bar]');
    });
  }

  if (stringTypes.includes("N''")) {
    it('supports T-SQL unicode strings', () => {
      expect(format("N'foo JOIN bar'")).toBe("N'foo JOIN bar'");
      expect(format("N'foo \\' JOIN bar'")).toBe("N'foo \\' JOIN bar'");
    });
  }
}
