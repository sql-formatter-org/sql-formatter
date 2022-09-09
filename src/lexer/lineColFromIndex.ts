/**
 * Determines line and column number of character index in source code.
 */
export function lineColFromIndex(source: string, index: number): LineCol {
  const lines = source.slice(0, index).split(/\n/);
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

export type LineCol = { line: number; col: number };
