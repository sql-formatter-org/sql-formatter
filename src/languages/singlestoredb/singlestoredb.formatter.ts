import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { EOF_TOKEN, isToken, type Token, TokenType } from 'src/lexer/token';
import { keywords } from './singlestoredb.keywords';
import { functions } from './singlestoredb.functions';

const reservedCommands = expandPhrases([
  // queries
  'WITH',
  'SELECT [ALL | DISTINCT | DISTINCTROW]',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  // Data manipulation
  // - insert:
  'INSERT [IGNORE] [INTO]',
  'VALUES',
  'REPLACE [INTO]',
  // - update:
  'UPDATE',
  'SET',
  // - delete:
  'DELETE [FROM]',
  // - truncate:
  'TRUNCATE [TABLE]',
  // Data definition
  'CREATE VIEW',
  'CREATE [ROWSTORE] [REFERENCE | TEMPORARY | GLOBAL TEMPORARY] TABLE [IF NOT EXISTS]',
  'CREATE [OR REPLACE] [TEMPORARY] PROCEDURE [IF NOT EXISTS]',
  'CREATE [OR REPLACE] [EXTERNAL] FUNCTION',
  'DROP [TEMPORARY] TABLE [IF EXISTS]',
  // - alter table:
  'ALTER [ONLINE] TABLE',
  'ADD [COLUMN]',
  'ADD [UNIQUE]',
  'DROP [COLUMN]',
  'MODIFY [COLUMN]',
  'RENAME [TO | AS]',

  // https://docs.singlestore.com/managed-service/en/reference/sql-reference.html
  'ADD AGGREGATOR',
  'ADD LEAF',
  'AGGREGATOR SET AS MASTER',
  'ALTER DATABASE',
  'ALTER PIPELINE',
  'ALTER RESOURCE POOL',
  'ALTER USER',
  'ALTER VIEW',
  'ANALYZE TABLE',
  'ATTACH DATABASE',
  'ATTACH LEAF',
  'ATTACH LEAF ALL',
  'BACKUP DATABASE',
  'BINLOG',
  'BOOTSTRAP AGGREGATOR',
  'CACHE INDEX',
  'CALL',
  'CHANGE',
  'CHANGE MASTER TO',
  'CHANGE REPLICATION FILTER',
  'CHANGE REPLICATION SOURCE TO',
  'CHECK BLOB CHECKSUM',
  'CHECK TABLE',
  'CHECKSUM TABLE',
  'CLEAR ORPHAN DATABASES',
  'CLONE',
  'COMMIT',
  'CREATE DATABASE',
  'CREATE GROUP',
  'CREATE INDEX',
  'CREATE LINK',
  'CREATE MILESTONE',
  'CREATE PIPELINE',
  'CREATE RESOURCE POOL',
  'CREATE ROLE',
  'CREATE USER',
  'DEALLOCATE PREPARE',
  'DESCRIBE',
  'DETACH DATABASE',
  'DETACH PIPELINE',
  'DO',
  'DROP DATABASE',
  'DROP FUNCTION',
  'DROP INDEX',
  'DROP LINK',
  'DROP PIPELINE',
  'DROP PROCEDURE',
  'DROP RESOURCE POOL',
  'DROP ROLE',
  'DROP USER',
  'DROP VIEW',
  'EXECUTE',
  'EXPLAIN',
  'FLUSH',
  'FORCE',
  'GRANT',
  'HANDLER',
  'HELP',
  'KILL CONNECTION',
  'KILLALL QUERIES',
  'LOAD DATA',
  'LOAD INDEX INTO CACHE',
  'LOAD XML',
  'LOCK INSTANCE FOR BACKUP',
  'LOCK TABLES',
  'MASTER_POS_WAIT',
  'OPTIMIZE TABLE',
  'PREPARE',
  'PURGE BINARY LOGS',
  'REBALANCE PARTITIONS',
  'RELEASE SAVEPOINT',
  'REMOVE AGGREGATOR',
  'REMOVE LEAF',
  'REPAIR TABLE',
  'REPLACE',
  'REPLICATE DATABASE',
  'RESET',
  'RESET MASTER',
  'RESET PERSIST',
  'RESET REPLICA',
  'RESET SLAVE',
  'RESTART',
  'RESTORE DATABASE',
  'RESTORE REDUNDANCY',
  'REVOKE',
  'ROLLBACK',
  'ROLLBACK TO SAVEPOINT',
  'SAVEPOINT',
  'SET CHARACTER SET',
  'SET DEFAULT ROLE',
  'SET NAMES',
  'SET PASSWORD',
  'SET RESOURCE GROUP',
  'SET ROLE',
  'SET TRANSACTION',
  'SHOW',
  'SHOW CHARACTER SET',
  'SHOW COLLATION',
  'SHOW COLUMNS',
  'SHOW CREATE DATABASE',
  'SHOW CREATE FUNCTION',
  'SHOW CREATE PIPELINE',
  'SHOW CREATE PROCEDURE',
  'SHOW CREATE TABLE',
  'SHOW CREATE USER',
  'SHOW CREATE VIEW',
  'SHOW DATABASES',
  'SHOW ENGINE',
  'SHOW ENGINES',
  'SHOW ERRORS',
  'SHOW FUNCTION CODE',
  'SHOW FUNCTION STATUS',
  'SHOW GRANTS',
  'SHOW INDEX',
  'SHOW MASTER STATUS',
  'SHOW OPEN TABLES',
  'SHOW PLUGINS',
  'SHOW PRIVILEGES',
  'SHOW PROCEDURE CODE',
  'SHOW PROCEDURE STATUS',
  'SHOW PROCESSLIST',
  'SHOW PROFILE',
  'SHOW PROFILES',
  'SHOW RELAYLOG EVENTS',
  'SHOW REPLICA STATUS',
  'SHOW REPLICAS',
  'SHOW SLAVE',
  'SHOW SLAVE HOSTS',
  'SHOW STATUS',
  'SHOW TABLE STATUS',
  'SHOW TABLES',
  'SHOW VARIABLES',
  'SHOW WARNINGS',
  'SHUTDOWN',
  'SNAPSHOT DATABASE',
  'SOURCE_POS_WAIT',
  'START GROUP_REPLICATION',
  'START PIPELINE',
  'START REPLICA',
  'START SLAVE',
  'START TRANSACTION',
  'STOP GROUP_REPLICATION',
  'STOP PIPELINE',
  'STOP REPLICA',
  'STOP REPLICATING',
  'STOP SLAVE',
  'TABLE',
  'TEST PIPELINE',
  'TRUNCATE TABLE',
  'UNLOCK INSTANCE',
  'UNLOCK TABLES',
  'USE',
  'XA',
  // flow control
  'ITERATE',
  'LEAVE',
  'LOOP',
  'REPEAT',
  'RETURN',
  'WHILE',
]);

// https://docs.singlestore.com/managed-service/en/reference/sql-reference/data-manipulation-language-dml/union.html
// https://docs.singlestore.com/managed-service/en/reference/sql-reference/data-manipulation-language-dml/intersect.html
// https://docs.singlestore.com/managed-service/en/reference/sql-reference/data-manipulation-language-dml/except-and-minus.html
const reservedSetOperations = expandPhrases([
  'UNION [ALL | DISTINCT]',
  'EXCEPT',
  'INTERSECT',
  'MINUS',
]);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL {LEFT | RIGHT} [OUTER] JOIN',
  // non-standard joins
  'STRAIGHT_JOIN',
]);

const reservedPhrases = ['ON DELETE', 'ON UPDATE', 'CHARACTER SET'];

// https://docs.singlestore.com/managed-service/en/reference/sql-reference/comparison-operators-and-functions.html
export default class SingleStoreDbFormatter extends Formatter {
  static operators = ['=', '<=>', '>', '<'];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE', 'ELSEIF'],
      reservedPhrases,
      reservedLogicalOperators: ['AND', 'OR', 'XOR'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      // TODO: support _ char set prefixes such as _utf8, _latin1, _binary, _utf8mb4, etc.
      stringTypes: [
        { quote: "''", prefixes: ['B', 'N', 'X'] },
        { quote: '""', prefixes: ['B', 'N', 'X'] },
      ],
      identTypes: ['``'],
      identChars: { first: '$', rest: '$', allowFirstCharNumber: true },
      variableTypes: [
        { regex: '@[A-Za-z0-9_.$]+' },
        { quote: '""', prefixes: ['@'], requirePrefix: true },
        { quote: "''", prefixes: ['@'], requirePrefix: true },
        { quote: '``', prefixes: ['@'], requirePrefix: true },
      ],
      lineCommentTypes: ['--', '#'],
      operators: SingleStoreDbFormatter.operators,
      postProcess,
    });
  }
}

function postProcess(tokens: Token[]) {
  return tokens.map((token, i) => {
    const nextToken = tokens[i + 1] || EOF_TOKEN;
    if (isToken.SET(token) && nextToken.text === '(') {
      // This is SET datatype, not SET statement
      return { ...token, type: TokenType.RESERVED_FUNCTION_NAME };
    }
    return token;
  });
}
