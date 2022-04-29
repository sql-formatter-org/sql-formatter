import { CommaPosition, FormatOptions } from '../types';
import { maxLength } from '../utils';
import { WHITESPACE_REGEX } from './Tokenizer';

/**
 * Handles comma placement - either before, after or tabulated
 */
export default function formatCommaPositions(query: string, cfg: FormatOptions): string {
  const lines = query.split('\n');
  const newQuery: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    // if line has trailing comma
    if (lines[i].match(/.*,$/)) {
      let commaLines = [lines[i]];
      // find all lines in comma-bound clause, + 1
      while (lines[i++].match(/.*,$/)) {
        commaLines.push(lines[i]);
      }

      if (cfg.commaPosition === CommaPosition.tabular) {
        commaLines = formatTabular(commaLines);
      } else if (cfg.commaPosition === CommaPosition.before) {
        commaLines = formatBefore(commaLines, cfg);
      }

      newQuery.push(...commaLines);
    }
    newQuery.push(lines[i]);
  }

  return newQuery.join('\n');
}

function formatTabular(commaLines: string[]): string[] {
  commaLines = trimTrailingCommas(commaLines);
  const commaMaxLength = maxLength(commaLines); // get longest for alignment
  // make all lines the same length by appending spaces before comma
  return commaLines.map((commaLine, i) =>
    i < commaLines.length - 1 // do not add comma for last item
      ? commaLine + ' '.repeat(commaMaxLength - commaLine.length) + ','
      : commaLine
  );
}

function formatBefore(commaLines: string[], cfg: FormatOptions): string[] {
  const isTabs = cfg.indent.includes('\t'); // loose tab check
  commaLines = trimTrailingCommas(commaLines);

  return commaLines.map((commaLine, i) => {
    if (!i) {
      // do not add comma for first item
      return commaLine;
    }
    const [precedingWhitespace] = commaLine.match(WHITESPACE_REGEX) || [''];
    const trimLastIndent = precedingWhitespace.replace(
      new RegExp((isTabs ? '\t' : cfg.indent) + '$'), // remove last tab / last indent
      ''
    );
    return (
      trimLastIndent +
      // add comma in place of last indent
      (isTabs ? '    ' : cfg.indent).replace(/ {2}$/, ', ') + // using 4 width tabs
      commaLine.trimStart()
    );
  });
}

function trimTrailingCommas(lines: string[]): string[] {
  return lines.map(line => line.replace(/,$/, ''));
}
