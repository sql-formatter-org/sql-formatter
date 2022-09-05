import { expect } from '@jest/globals';
import dedent from 'dedent-js';
import { FormatFn } from 'src/sqlFormatter';

type IdentType =
  | '""-qq' // with repeated-quote escaping
  | '``' // with repeated-quote escaping
  | '[]' // with ]] escaping
  | 'U&""'; // with repeated-quote escaping

export default function supportsIdentifiers(format: FormatFn, identifierTypes: IdentType[]) {
  if (identifierTypes.includes('""-qq')) {
    it('supports double-quoted identifiers', () => {
      expect(format('"foo JOIN bar"')).toBe('"foo JOIN bar"');
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

    it('does not support escaping double-quote with a backslash', () => {
      expect(() => format('"foo \\" JOIN bar"')).toThrowError('Parse error: Unexpected "');
    });
  }

  if (identifierTypes.includes('``')) {
    it('supports backtick-quoted identifiers', () => {
      expect(format('`foo JOIN bar`')).toBe('`foo JOIN bar`');
      expect(format('SELECT `where` FROM `update`')).toBe(dedent`
        SELECT
          \`where\`
        FROM
          \`update\`
      `);
    });

    it('supports escaping backtick by doubling it', () => {
      expect(format('`foo `` JOIN bar`')).toBe('`foo `` JOIN bar`');
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

    it('supports escaping in U&"" strings by repeated quote', () => {
      expect(format('U&"foo "" JOIN bar"')).toBe('U&"foo "" JOIN bar"');
    });

    it('detects consecutive U&"" identifiers as separate ones', () => {
      expect(format('U&"foo"U&"bar"')).toBe('U&"foo" U&"bar"');
    });

    it('does not supports escaping in U&"" strings with a backslash', () => {
      expect(() => format('U&"foo \\" JOIN bar"')).toThrowError('Parse error: Unexpected "');
    });
  }

  if (identifierTypes.includes('[]')) {
    it('supports [bracket-quoted identifiers]', () => {
      expect(format('[foo JOIN bar]')).toBe('[foo JOIN bar]');
      expect(format('SELECT [where] FROM [update]')).toBe(dedent`
        SELECT
          [where]
        FROM
          [update]
      `);
    });

    it('supports escaping close-bracket by doubling it', () => {
      expect(format('[foo ]] JOIN bar]')).toBe('[foo ]] JOIN bar]');
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
