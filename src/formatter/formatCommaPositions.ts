import { CommaPosition } from '../FormatOptions.js';
import { maxLength } from '../utils.js';

const PRECEDING_WHITESPACE_REGEX = /^\s+/u;

export interface Line {
  originalContent: string;
  commentAtLineStart: string;
  content: string;
  commentAtLineEnd: string;
}

/**
 * Handles comma placement - either before, after or tabulated
 */
export default function formatCommaPositions(
  query: string,
  commaPosition: CommaPosition,
  indent: string
): string {
  const lines = splitContentAndComments(query);
  return groupCommaDelimitedLines(lines)
    .flatMap(commaLines => {
      if (commaLines.length === 1) {
        return commaLines[0].originalContent;
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
 *       [{
 *        originalContent: 'SELECT',
 *        commentAtLineStart: '',
 *        content: 'SELECT',
 *        commentAtLineEnd: '',
 *       }],
 *       [{
 *         originalContent: '  foo,',
 *         commentAtLineStart: '',
 *         content: '  foo,',
 *         commentAtLineEnd: '',
 *       }, {
 *         originalContent: '  bar, --comment',
 *         commentAtLineStart: '  ',
 *         content: 'bar,',
 *         commentAtLineEnd: '--comment',
 *       }, {
 *         originalContent: '  baz',
 *         commentAtLineStart: '  ',
 *         content: 'baz',
 *         commentAtLineEnd: '',
 *       }],
 *       {
 *         originalContent: 'FROM',
 *         commentAtLineStart: '',
 *         content: 'FROM',
 *         commentAtLineEnd: '',
 *       }
 *     ]
 */
function groupCommaDelimitedLines(lines: Line[]): Line[][] {
  const groups: Line[][] = [];
  for (let i = 0; i < lines.length; i++) {
    const group = [lines[i]];
    // when line ends with comma,
    // gather together all following lines that also end with comma,
    // plus one (which doesn't end with comma)
    while (lines[i].content.match(/.*,/)) {
      i++;
      // handle comment before next meanful line
      while (lines[i].content.length === 0) {
        group.push(lines[i]);
        i++;
      }
      group.push(lines[i]);
    }
    groups.push(group);
  }
  return groups;
}

// makes all lines the same length by appending spaces before comma
function formatTabular(commaLines: Line[]): string[] {
  const commaPosition = maxLength(commaLines.map(line => trimTrailingCommas(line.content)));

  return commaLines.map((line, i) => {
    if (i === commaLines.length - 1) {
      return line.originalContent; // do not add comma for last item
    }
    return indentComma(line, commaPosition);
  });
}

function indentComma(line: Line, commaPosition: number) {
  const lineContent = trimTrailingCommas(line.content);

  const spaces = ' '.repeat(
    Math.max(commaPosition - lineContent.length - line.commentAtLineStart.length, 0)
  );
  const commentAtLineEnd = line.commentAtLineEnd.length ? ' ' + line.commentAtLineEnd : '';
  return `${line.commentAtLineStart}${lineContent}${spaces},${commentAtLineEnd}`;
}

function formatBefore(commaLines: Line[], indent: string): string[] {
  return commaLines
    .map((line, i) => {
      if (line.content === '') {
        return line.originalContent;
      }
      const lineContent = trimTrailingCommas(line.content);
      const commentAtLineEnd = line.commentAtLineEnd.length ? ' ' + line.commentAtLineEnd : '';
      if (i === 0) {
        return `${line.commentAtLineStart}${lineContent}${commentAtLineEnd}`; // do not add comma for first item
      }
      const [whitespace] = line.content.match(PRECEDING_WHITESPACE_REGEX) || [''];
      return (
        removeLastIndent(whitespace, indent) +
        indent.replace(/ {2}$/, ', ') + // add comma to the end of last indent
        `${line.commentAtLineStart}${lineContent.trimStart()}${commentAtLineEnd}`
      );
    })
    .filter(line => line !== '');
}

function removeLastIndent(whitespace: string, indent: string): string {
  return whitespace.replace(new RegExp(indent + '$'), '');
}

function trimTrailingCommas(lineContent: string): string {
  return lineContent.replace(/,\s*$/, '');
}

const sqlCommentRegexp = /--(?!.*").*$/gm;
const sqlMultiLineCommentRegexp = /\/\*[\s\S]*?\*\//gm;

function mergeRanges(ranges: { start: number; end: number }[]) {
  const mergedRanges = [] as { start: number; end: number }[];
  let currentRange = null as { start: number; end: number } | null;

  for (let i = 0; i < ranges.length; ++i) {
    const range = ranges[i];
    if (currentRange === null) {
      currentRange = range;
    } else if (range.start <= currentRange.end) {
      currentRange.end = Math.max(currentRange.end, range.end);
    } else {
      mergedRanges.push(currentRange);
      currentRange = range;
    }
  }

  if (currentRange !== null) {
    mergedRanges.push(currentRange);
  }

  return mergedRanges;
}

export function getCommentsRanges(content: string) {
  const ranges = [] as { start: number; end: number }[];

  const matches = [
    ...content.matchAll(sqlCommentRegexp),
    ...content.matchAll(sqlMultiLineCommentRegexp),
  ];

  for (let i = 0; i < matches.length; ++i) {
    const { index } = matches[i];
    if (index !== undefined && index !== null) {
      ranges.push({ start: index, end: index + matches[i][0].length });
    }
  }

  return mergeRanges(ranges.sort((a, b) => a.start - b.start));
}

export function queryToLinesWithIndexes(query: string) {
  const lines = [] as { content: string; lineNumber: number; start: number }[];
  let lineNumber = 1;
  let currentLineContent = '';
  let currentLineStart = 0;

  for (let i = 0; i < query.length; i++) {
    if (query[i] === '\n') {
      lines.push({
        content: currentLineContent,
        lineNumber,
        start: currentLineStart,
      });
      lineNumber++;
      currentLineContent = '';
      currentLineStart = i + 1;
    } else {
      currentLineContent += query[i];
    }
  }
  if (currentLineContent !== '') {
    lines.push({
      content: currentLineContent,
      lineNumber,
      start: currentLineStart,
    });
  }

  return lines;
}

export function splitContentAndComments(query: string) {
  const lines = queryToLinesWithIndexes(query.trim());
  const commentsRanges = getCommentsRanges(query);

  return lines.map(line => {
    const lineContent = line.content;
    const lineStart = line.start;

    const isWholeLineComment = commentsRanges.some(
      range => range.start <= lineStart && range.end >= lineStart + lineContent.length - 1
    );
    if (isWholeLineComment) {
      return {
        commentAtLineStart: lineContent,
        content: '',
        commentAtLineEnd: '',
        originalContent: lineContent,
      };
    }

    const commentRangeAtLineStart = commentsRanges.find(
      range => range.start <= lineStart && range.end >= lineStart
    );
    const commentRangeAtLineEnd = commentsRanges.find(
      range => range.start >= lineStart && range.end >= lineStart + lineContent.length
    );

    const commentAtLineStart = commentRangeAtLineStart
      ? lineContent.slice(0, commentRangeAtLineStart.end - lineStart)
      : '';
    const commentAtLineEnd = commentRangeAtLineEnd
      ? lineContent.slice(commentRangeAtLineEnd.start - lineStart)
      : '';
    const content = lineContent
      .slice(
        commentRangeAtLineStart ? commentRangeAtLineStart.end - lineStart : 0,
        commentRangeAtLineEnd ? commentRangeAtLineEnd.start - lineStart : lineContent.length
      )
      .trimEnd();

    return {
      commentAtLineStart,
      content,
      commentAtLineEnd,
      originalContent: lineContent,
    };
  }) as Line[];
}
