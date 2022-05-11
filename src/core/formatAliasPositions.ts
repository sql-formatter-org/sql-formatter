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
        aliasLines = [lines[i]]; // add select to aliasLines in case of tabular formats
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

      // break lines into alias with optional AS, and all preceding text
      const splitLines = aliasLines
        .map(line => ({ line, matches: line.match(/(^.*?\S) (AS )?(\S+,?$)/i) }))
        .map(({ line, matches }) => {
          if (!matches) {
            return { precedingText: line };
          }
          return {
            precedingText: matches[1],
            as: matches[2],
            alias: matches[3],
          };
        });

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
