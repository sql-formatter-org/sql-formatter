import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './redshift.functions';
import { keywords } from './redshift.keywords';

const reservedCommands = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'SELECT [ALL | DISTINCT]',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  // https://docs.aws.amazon.com/redshift/latest/dg/c_SQL_commands.html
  'ABORT',
  'ALTER DATABASE',
  'ALTER DATASHARE',
  'ALTER DEFAULT PRIVILEGES',
  'ALTER GROUP',
  'ALTER MATERIALIZED VIEW',
  'ALTER PROCEDURE',
  'ALTER SCHEMA',
  'ALTER TABLE',
  'ALTER TABLE APPEND',
  'ALTER USER',
  'ANALYSE',
  'ANALYZE',
  'ANALYSE COMPRESSION',
  'ANALYZE COMPRESSION',
  'BEGIN',
  'CALL',
  'CANCEL',
  'CLOSE',
  'COMMENT',
  'COMMIT',
  'COPY',
  'CREATE DATABASE',
  'CREATE DATASHARE',
  'CREATE EXTERNAL FUNCTION',
  'CREATE EXTERNAL SCHEMA',
  'CREATE EXTERNAL TABLE',
  'CREATE FUNCTION',
  'CREATE GROUP',
  'CREATE LIBRARY',
  'CREATE MATERIALIZED VIEW',
  'CREATE MODEL',
  'CREATE PROCEDURE',
  'CREATE SCHEMA',
  'CREATE TABLE',
  'CREATE TABLE AS',
  'CREATE USER',
  'CREATE VIEW',
  'DEALLOCATE',
  'DECLARE',
  'DELETE',
  'DELETE FROM',
  'DESC DATASHARE',
  'DROP DATABASE',
  'DROP DATASHARE',
  'DROP FUNCTION',
  'DROP GROUP',
  'DROP LIBRARY',
  'DROP MODEL',
  'DROP MATERIALIZED VIEW',
  'DROP PROCEDURE',
  'DROP SCHEMA',
  'DROP TABLE',
  'DROP USER',
  'DROP VIEW',
  'DROP',
  'EXECUTE',
  'EXPLAIN',
  'FETCH',
  'GRANT',
  'INSERT',
  'LOCK',
  'PREPARE',
  'REFRESH MATERIALIZED VIEW',
  'RESET',
  'REVOKE',
  'ROLLBACK',
  'SELECT INTO',
  'SET',
  'SET SESSION AUTHORIZATION',
  'SET SESSION CHARACTERISTICS',
  'SHOW',
  'SHOW EXTERNAL TABLE',
  'SHOW MODEL',
  'SHOW DATASHARES',
  'SHOW PROCEDURE',
  'SHOW TABLE',
  'SHOW VIEW',
  'START TRANSACTION',
  'TRUNCATE',
  'UNLOAD',
  'UPDATE',
  'VACUUM',
  'VALUES',
  // other
  'MODIFY', // verify
  'INSERT INTO', // verify
  'ALTER COLUMN', // verify
  'SET SCHEMA', // verify
]);

const reservedSetOperations = expandPhrases(['UNION [ALL]', 'EXCEPT', 'INTERSECT', 'MINUS']);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL [INNER] JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
]);

// https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_SQLCommandRef.html
export default class RedshiftFormatter extends Formatter {
  static operators = ['~', '|/', '||/', '<<', '>>', '||'];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: ["''"],
      identTypes: [`""`],
      identChars: { first: '#' },
      numberedParamTypes: ['$'],
      operators: RedshiftFormatter.operators,
    });
  }
}
