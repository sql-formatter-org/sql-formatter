import { FormatOptions } from '../sqlFormatter';
import { CommaPosition } from '../types';
import { maxLength } from '../utils';
import Tokenizer from './Tokenizer';

/**
 * Handles comma placement - either before, after or tabulated
 * @param {string} query - input query string
 */
export default function formatCommaPositions(
  query: string,
  cfg: FormatOptions,
  tokenizer: Tokenizer
): string {
  // const trailingComma = /,$/;
  const lines = query.split('\n');
  let newQuery: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    // if line has trailing comma
    if (lines[i].match(/.*,$/)) {
      let commaLines = [lines[i]];
      // find all lines in comma-bound clause, + 1
      while (lines[i++].match(/.*,$/)) {
        commaLines.push(lines[i]);
      }

      if (cfg.commaPosition === CommaPosition.tabular) {
        commaLines = commaLines.map(commaLine => commaLine.replace(/,$/, '')); // trim all trailing commas
        const commaMaxLength = maxLength(commaLines); // get longest for alignment
        // make all lines the same length by appending spaces before comma
        commaLines = commaLines.map((commaLine, j) =>
          j < commaLines.length - 1 // do not add comma for last item
            ? commaLine + ' '.repeat(commaMaxLength - commaLine.length) + ','
            : commaLine
        );
      } else if (cfg.commaPosition === CommaPosition.before) {
        const isTabs = cfg.indent.includes('\t'); // loose tab check
        commaLines = commaLines.map(commaLine => commaLine.replace(/,$/, ''));
        const whitespaceRegex = tokenizer.WHITESPACE_REGEX;

        commaLines = commaLines.map((commaLine, j) => {
          if (!j) {
            // do not add comma for first item
            return commaLine;
          }
          const precedingWhitespace = commaLine.match(new RegExp('^' + whitespaceRegex + ''));
          const trimLastIndent = precedingWhitespace
            ? precedingWhitespace[1].replace(
                new RegExp((isTabs ? '\t' : cfg.indent) + '$'), // remove last tab / last indent
                ''
              )
            : '';
          return (
            trimLastIndent +
            // add comma in place of last indent
            (isTabs ? '    ' : cfg.indent).replace(/ {2}$/, ', ') + // using 4 width tabs
            commaLine.trimStart()
          );
        });
      }

      newQuery = [...newQuery, ...commaLines];
    }
    newQuery.push(lines[i]);
  }

  return newQuery.join('\n');
}
