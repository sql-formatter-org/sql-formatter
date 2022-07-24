import { expect } from '@jest/globals';
// import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';
import type { QuoteType } from 'src/lexer/regexTypes';

export default function supportsStrings(format: FormatFn, stringTypes: QuoteType[]) {
  const baseTestString = 'foo JOIN bar';

  // for each valid string type
  for (const quoteType of stringTypes) {
    const quoteString = typeof quoteType === 'string' ? quoteType : quoteType.quote;
    it(`supports ${quoteString} strings`, () => {
      const testString = [
        quoteString.slice(0, quoteString.length / 2).replace(/[.]/g, ''),
        baseTestString,
        quoteString.slice(quoteString.length / 2).replace(/[.]/g, ''),
      ].join('');

      expect(format(testString)).toBe(testString);

      // for complex quote types
      if (typeof quoteType !== 'string') {
        if (quoteType.escapes) {
          for (const escape of quoteType.escapes) {
            expect(testString.replace('JOIN', escape)).toBe(testString.replace('JOIN', escape));
          }
        }

        // for prefixed quote types
        if ('prefixes' in quoteType) {
          for (const prefix of quoteType.prefixes) {
            expect(`${prefix}${testString}`).toBe(`${prefix}${testString}`);
          }
        }
      }
    });
  }
}
