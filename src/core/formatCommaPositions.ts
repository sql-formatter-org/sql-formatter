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
  const maxLineLength = maxLength(commaLines); // get longest for alignment
  // make all lines the same length by appending spaces before comma
  return trimTrailingCommas(commaLines).map((line, i) => {
    if (i === commaLines.length - 1) {
      return line; // do not add comma for last item
    }
    return line + ' '.repeat(maxLineLength - line.length - 1) + ',';
  });
}

function formatBefore(commaLines: string[], cfg: FormatOptions): string[] {
  return trimTrailingCommas(commaLines).map((line, i) => {
    if (i === 0) {
      return line; // do not add comma for first item
    }
    const [whitespace] = line.match(WHITESPACE_REGEX) || [''];
    return (
      removeLastIndent(whitespace, cfg.indent) +
      cfg.indent.replace(/ {2}$/, ', ') + // add comma to the end of last indent
      line.trimStart()
    );
  });
}

function removeLastIndent(whitespace: string, indent: string): string {
  return whitespace.replace(new RegExp(indent + '$'), '');
}

function trimTrailingCommas(lines: string[]): string[] {
  return lines.map(line => line.replace(/,$/, ''));
}
