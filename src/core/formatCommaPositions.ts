import { FormatOptions } from '../types';
import { maxLength } from '../utils';
import { WHITESPACE_REGEX } from './Tokenizer';

/**
 * Handles comma placement - either before, after or tabulated
 */
export default function formatCommaPositions(query: string, cfg: FormatOptions): string {
  return groupCommaDelimitedLines(query.split('\n'))
    .flatMap(commaLines => {
      if (commaLines.length === 1) {
        return commaLines;
      } else if (cfg.commaPosition === 'tabular') {
        return formatTabular(commaLines);
      } else if (cfg.commaPosition === 'before') {
        return formatBefore(commaLines, cfg);
      } else {
        throw new Error(`Unexpected commaPosition: ${cfg.commaPosition}`);
      }
    })
    .join('\n');
}

/**
 * Given lines like this:
 *
 *     [
 *       'SELECT',
 *       '  foo,',
 *       '  bar,',
 *       '  baz',
 *       'FROM'
 *     ]
 *
 * Returns groups like this:
 *
 *     [
 *       ['SELECT'],
 *       ['  foo,', '  bar,', '  baz'],
 *       ['FROM']
 *     ]
 */
function groupCommaDelimitedLines(lines: string[]): string[][] {
  const groups: string[][] = [];
  for (let i = 0; i < lines.length; i++) {
    const group = [lines[i]];
    // when line ends with comma,
    // gather together all following lines that also end with comma,
    // plus one (which doesn't end with comma)
    while (lines[i].match(/.*,$/)) {
      i++;
      group.push(lines[i]);
    }
    groups.push(group);
  }
  return groups;
}

// makes all lines the same length by appending spaces before comma
function formatTabular(commaLines: string[]): string[] {
  const maxLineLength = maxLength(commaLines);
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
