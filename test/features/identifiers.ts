import { expect } from '@jest/globals';
import dedent from 'dedent-js';
import { FormatFn } from '../../src/sqlFormatter';

export default function supportsIdentifiers(format: FormatFn, identifierTypes: string[]) {
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

    it('supports backticks', () => {
      const result = format(`SELECT \`a\`.\`b\` FROM \`c\`.\`d\`;`);
      expect(result).toBe(dedent`
        SELECT
          \`a\`.\`b\`
        FROM
          \`c\`.\`d\`;
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
  }
}
