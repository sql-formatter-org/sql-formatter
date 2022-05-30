import StandardSqlFormatter from '../src/languages/standardsql.formatter';
import Tokenizer from '../src/core/Tokenizer';
import MooTokenizer from '../src/lexer/tokenizer';

import testSql from './test.sql';

const options = {
  reservedCommands: StandardSqlFormatter.reservedCommands,
  reservedBinaryCommands: StandardSqlFormatter.reservedBinaryCommands,
  reservedDependentClauses: StandardSqlFormatter.reservedDependentClauses,
  reservedLogicalOperators: StandardSqlFormatter.reservedLogicalOperators,
  reservedKeywords: StandardSqlFormatter.reservedKeywords,
  stringTypes: StandardSqlFormatter.stringTypes,
  blockStart: StandardSqlFormatter.blockStart,
  blockEnd: StandardSqlFormatter.blockEnd,
  indexedPlaceholderTypes: StandardSqlFormatter.indexedPlaceholderTypes,
  namedPlaceholderTypes: StandardSqlFormatter.namedPlaceholderTypes,
  lineCommentTypes: StandardSqlFormatter.lineCommentTypes,
};

describe('Moo', () => {
  console.log(testSql);
  const tokenizer = new Tokenizer(options);
  const stream = tokenizer.tokenize(testSql);

  const mooTokenizer = new MooTokenizer(options);
  const mooStream = mooTokenizer.tokenize(testSql);

  const filtered = mooStream.filter(token => token.type !== 'WS' && token.type !== 'NL');
  console.log('old:', stream.length, 'new:', filtered.length);

  console.log(filtered.map(({ type, text }) => ({ type, text })));

  console.log(filtered.filter(token => token.type === 'WIP').length);

  it('does not have any WIP tokens', () => {
    expect(filtered).not.toContainEqual(
      expect.objectContaining({
        type: 'WIP',
      })
    );
  });
});
