import { expect } from '@jest/globals';
import dedent from 'dedent-js';
import { FormatFn } from 'src/sqlFormatter';

type IdentType = '""' | '``' | '[]' | 'U&""';

export default function supportsIdentifiers(format: FormatFn, identifierTypes: IdentType[]) {
  // regression test for sql-formatter#334
  it.only('supports identifiers that start with numbers', () => {
    expect(format('SELECT 4four FROM tbl')).toBe(
      dedent`
        SELECT
          4four
        FROM
          tbl
      `
    );
    expect(format('SELECT 1, two, 3four FROM tbl')).toBe(
      dedent`
        SELECT
          1,
          two,
          3four
        FROM
          tbl
      `
    );
    expect(format('SELECT one + 2three, 4 + 5six FROM tbl')).toBe(
      dedent`
        SELECT
          one + 2three,
          4 + 5six
        FROM
          tbl
      `
    );
  });

  if (identifierTypes.includes('""')) {
    it('supports double-quoted identifiers', () => {
      expect(format('"foo JOIN bar"')).toBe('"foo JOIN bar"');
      expect(format('"foo \\" JOIN bar"')).toBe('"foo \\" JOIN bar"');
      expect(format('SELECT "where" FROM "update"')).toBe(dedent`
        SELECT
          "where"
        FROM
          "update"
      `);
    });

    it('no space around dot between two double-quoted identifiers', () => {
      const result = format(`SELECT "my table"."col name";`);
      expect(result).toBe(dedent`
        SELECT
          "my table"."col name";
      `);
    });

    it('supports escaping double-quote by doubling it', () => {
      expect(format('"foo""bar"')).toBe('"foo""bar"');
    });
  }

  if (identifierTypes.includes('``')) {
    it('supports backtick-quoted identifiers', () => {
      expect(format('`foo JOIN bar`')).toBe('`foo JOIN bar`');
      expect(format('`foo `` JOIN bar`')).toBe('`foo `` JOIN bar`');
      expect(format('SELECT `where` FROM `update`')).toBe(dedent`
        SELECT
          \`where\`
        FROM
          \`update\`
      `);
    });

    it('no space around dot between two backtick-quoted identifiers', () => {
      const result = format(`SELECT \`my table\`.\`col name\`;`);
      expect(result).toBe(dedent`
        SELECT
          \`my table\`.\`col name\`;
      `);
    });
  }

  if (identifierTypes.includes('U&""')) {
    it('supports unicode double-quoted identifiers', () => {
      expect(format('U&"foo JOIN bar"')).toBe('U&"foo JOIN bar"');
      expect(format('U&"foo \\" JOIN bar"')).toBe('U&"foo \\" JOIN bar"');
      expect(format('SELECT U&"where" FROM U&"update"')).toBe(dedent`
        SELECT
          U&"where"
        FROM
          U&"update"
      `);
    });

    it('no space around dot between unicode double-quoted identifiers', () => {
      const result = format(`SELECT U&"my table".U&"col name";`);
      expect(result).toBe(dedent`
        SELECT
          U&"my table".U&"col name";
      `);
    });

    it('detects consecuitive U&"" identifiers as separate ones', () => {
      expect(format('U&"foo"U&"bar"')).toBe('U&"foo" U&"bar"');
    });
  }

  if (identifierTypes.includes('[]')) {
    it('supports [bracket-quoted identifiers]', () => {
      expect(format('[foo JOIN bar]')).toBe('[foo JOIN bar]');
      expect(format('[foo ]] JOIN bar]')).toBe('[foo ]] JOIN bar]');
      expect(format('SELECT [where] FROM [update]')).toBe(dedent`
        SELECT
          [where]
        FROM
          [update]
      `);
    });

    it('no space around dot between two [bracket-quoted identifiers]', () => {
      const result = format(`SELECT [my table].[col name];`);
      expect(result).toBe(dedent`
        SELECT
          [my table].[col name];
      `);
    });
  }
}
