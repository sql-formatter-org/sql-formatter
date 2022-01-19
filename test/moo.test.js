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

const tokenizer = new Tokenizer(options);
const stream = tokenizer.tokenize(testSql);

const mooTokenizer = new MooTokenizer(options);
const mooStream = mooTokenizer.tokenize(testSql);

const filtered = mooStream.filter(token => token.type !== 'WS' && token.type !== 'NL');
console.log(stream.length);
console.log(filtered.length);

stream.forEach((t, i) => {
	console.log(t.value, filtered[i].value);
});
