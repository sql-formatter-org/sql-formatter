import SqlFormatter, {
  reservedBinaryCommands,
  reservedCommands,
  reservedDependentClauses,
  // reservedLogicalOperators,
  reservedKeywords,
} from 'src/languages/sql.formatter';
import Tokenizer from 'src/core/Tokenizer';
import MooTokenizer, { tokenConverter } from 'src/lexer/tokenizer';

import fs from 'fs';

// import testSql from './test.sql';
const testSql = fs.readFileSync('test/test.sql', 'utf8');

const options = {
  reservedKeywords,
  reservedCommands,
  reservedBinaryCommands,
  reservedDependentClauses,
  // reservedLogicalOperators: ['AND', 'OR'],
  // stringTypes: SqlFormatter.stringTypes as any[],
  identTypes: [],
  stringTypes: [],
  // blockStart: blockStart,
  // blockEnd: blockEnd,
  indexedPlaceholderTypes: ['?'],
  // namedPlaceholderTypes: namedPlaceholderTypes,
  // lineCommentTypes: lineCommentTypes,
};

describe('Moo', () => {
  console.log(testSql);
  const tokenizer = new Tokenizer(options);
  const stream = tokenizer.tokenize(testSql);

  const mooTokenizer = new MooTokenizer(options);
  const mooStream = mooTokenizer.tokenize(testSql);

  const filtered = mooStream.filter(token => token.type !== 'WS' && token.type !== 'NL');
  // console.log('old:', stream.length, 'new:', filtered.length);

  // console.log(filtered.map(({ type, text, value }) => ({ type, text, value })));

  // console.log(filtered.filter(token => token.type === 'WIP').length);

  console.log(stream.length, tokenConverter(mooStream).length);

  console.log(
    stream.map(({ type, text, value, whitespaceBefore }) => ({
      type,
      text,
      value,
      ws: whitespaceBefore,
    }))
  );

  console.log(
    tokenConverter(mooStream).map(({ type, text, value, whitespaceBefore }) => ({
      type,
      text,
      value,
      ws: whitespaceBefore,
    }))
  );

  it('does not have any WIP tokens', () => {
    expect(filtered).not.toContainEqual(
      expect.objectContaining({
        type: 'WIP',
      })
    );
  });
});