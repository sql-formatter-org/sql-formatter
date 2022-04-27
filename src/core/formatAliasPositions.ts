import { maxLength } from '../utils';

/**
 * Handles select alias placement - tabulates if enabled
 */
export default function formatAliasPositions(query: string): string {
  const lines = query.split('\n');

  let newQuery: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    // find SELECT rows with trailing comma, if no comma (only one row) - no-op
    if (lines[i].match(/^\s*SELECT/i)) {
      let aliasLines: string[] = [];
      if (lines[i].match(/.*,$/)) {
        aliasLines = [lines[i]]; // add select to aliasLines in case of tenSpace formats
      } else {
        newQuery.push(lines[i]); // add select to new query
        if (lines[i].match(/^\s*SELECT\s+.+(?!,$)/i)) {
          continue;
        }
        aliasLines.push(lines[++i]);
      }

      // get all lines in SELECT clause
      while (lines[i++].match(/.*,$/)) {
        aliasLines.push(lines[i]);
      }

      const splitLines = aliasLines
        .map(line => line.split(/(?<=[^\s]+) (AS )?(?=[^\s]+,?$)/i)) // break lines into alias with optional AS, and all preceding text
        .map(slugs => ({
          precedingText: slugs[0], // always first split
          alias: slugs.length > 1 ? slugs[slugs.length - 1] : undefined, // always last in split
          as: slugs.length === 3 ? slugs[1] : undefined, // 2nd if AS is present, else omitted
        }));

      const aliasMaxLength = maxLength(
        splitLines.map(({ precedingText }) => precedingText.replace(/\s*,\s*$/, '')) // get longest of precedingText, trim trailing comma for non-alias columns
      );
      // re-construct line, aligning by inserting space before AS or alias
      aliasLines = splitLines.map(
        ({ precedingText, as, alias }) =>
          precedingText +
          (alias ? ' '.repeat(aliasMaxLength - precedingText.length + 1) + (as ?? '') + alias : '')
      );
      newQuery = [...newQuery, ...aliasLines];
    }
    newQuery.push(lines[i]);
  }

  return newQuery.join('\n');
}
