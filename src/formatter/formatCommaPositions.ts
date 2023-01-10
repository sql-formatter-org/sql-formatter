import { CommaPosition } from '../FormatOptions.js';
import { maxLength } from '../utils.js';

const PRECEDING_WHITESPACE_REGEX = /^\s+/u;

/**
 * Handles comma placement - either before, after or tabulated
 */
export default function formatCommaPositions(
  query: string,
  commaPosition: CommaPosition,
  indent: string
): string {
  return groupCommaDelimitedLines(query.split('\n'))
    .flatMap(commaLines => {
      if (commaLines.length === 1) {
        return commaLines;
      } else if (commaPosition === 'tabular') {
        return formatTabular(commaLines);
      } else if (commaPosition === 'before') {
        return formatBefore(commaLines, indent);
      } else {
        throw new Error(`Unexpected commaPosition: ${commaPosition}`);
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
 *       '  bar, --comment',
 *       '  baz',
 *       'FROM'
 *     ]
 *
 * Returns groups like this:
 *
 *     [
 *       ['SELECT'],
 *       ['  foo,', '  bar, --comment', '  baz'],
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
    while (lines[i].match(/.*,(\s*(--.*)?$)/)) {
      i++;
      group.push(lines[i]);
    }
    groups.push(group);
  }
  return groups;
}

// makes all lines the same length by appending spaces before comma
function formatTabular(commaLines: string[]): string[] {
  const commaLinesWithoutComments = commaLines.map(line => line.replace(/--.*/, ''));
  const maxLineLength = maxLength(commaLinesWithoutComments);
  return trimTrailingCommas(commaLines).map((line, i) => {
    if (i === commaLines.length - 1) {
      return line; // do not add comma for last item
    }
    // find comment match in string
    const commentMatch = /\s*--/.exec(line);
    // if comment found, get its start index to slice string by it
    // if comment not found, get line.length so slice will return whole line
    const endOfContentWithoutCommentPosition = commentMatch ? commentMatch.index : line.length;
    const lineContentWithoutComment = line.slice(0, endOfContentWithoutCommentPosition).trimEnd();
    const spaces = ' '.repeat(maxLineLength - lineContentWithoutComment.length - 1);
    const comment = line.slice(endOfContentWithoutCommentPosition + 1);

    // trim end will handle case without comment
    return `${lineContentWithoutComment}${spaces}, ${comment}`.trimEnd();
  });
}

function formatBefore(commaLines: string[], indent: string): string[] {
  return trimTrailingCommas(commaLines).map((line, i) => {
    if (i === 0) {
      return line; // do not add comma for first item
    }
    const [whitespace] = line.match(PRECEDING_WHITESPACE_REGEX) || [''];
    return (
      removeLastIndent(whitespace, indent) +
      indent.replace(/ {2}$/, ', ') + // add comma to the end of last indent
      line.trimStart()
    );
  });
}

function removeLastIndent(whitespace: string, indent: string): string {
  return whitespace.replace(new RegExp(indent + '$'), '');
}

function trimTrailingCommas(lines: string[]): string[] {
  return lines.map(line => line.replace(/,(\s*(--.*)?$)/, '$1'));
}
