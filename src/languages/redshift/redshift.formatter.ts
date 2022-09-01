import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './redshift.functions';
import { keywords } from './redshift.keywords';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedCommands = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'PARTITION BY',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  // Data manipulation
  // - insert:
  'INSERT INTO',
  'VALUES',
  // - update:
  'UPDATE',
  'SET',
  // - delete:
  'DELETE [FROM]',
  // - truncate:
  'TRUNCATE [TABLE]',
  // Data definition
  'CREATE [OR REPLACE | MATERIALIZED] VIEW',
  'CREATE [TEMPORARY | TEMP | LOCAL TEMPORARY | LOCAL TEMP] TABLE [IF NOT EXISTS]',
  'DROP TABLE [IF EXISTS]',
  // - alter table:
  'ALTER TABLE',
  'ALTER TABLE APPEND',
  'ADD [COLUMN]',
  'DROP [COLUMN]',
  'RENAME TO',
  'RENAME COLUMN',
  'ALTER COLUMN',
  'TYPE', // for alter column
  'ENCODE', // for alter column

  // https://docs.aws.amazon.com/redshift/latest/dg/c_SQL_commands.html
  'ABORT',
  'ALTER DATABASE',
  'ALTER DATASHARE',
  'ALTER DEFAULT PRIVILEGES',
  'ALTER GROUP',
  'ALTER MATERIALIZED VIEW',
  'ALTER PROCEDURE',
  'ALTER SCHEMA',
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
  'CREATE MODEL',
  'CREATE PROCEDURE',
  'CREATE SCHEMA',
  'CREATE USER',
  'DEALLOCATE',
  'DECLARE',
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
  'DROP USER',
  'DROP VIEW',
  'DROP',
  'EXECUTE',
  'EXPLAIN',
  'FETCH',
  'GRANT',
  'LOCK',
  'PREPARE',
  'REFRESH MATERIALIZED VIEW',
  'RESET',
  'REVOKE',
  'ROLLBACK',
  'SELECT INTO',
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
  'UNLOAD',
  'VACUUM',
  // other
  'ALTER COLUMN',
]);

const reservedSetOperations = expandPhrases(['UNION [ALL]', 'EXCEPT', 'INTERSECT', 'MINUS']);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL [INNER] JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
]);

const reservedPhrases = expandPhrases([
  // https://docs.aws.amazon.com/redshift/latest/dg/copy-parameters-data-conversion.html
  'NULL AS',
  // https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_SCHEMA.html
  'DATA CATALOG',
  'HIVE METASTORE',
  // in window specifications
  '{ROWS | RANGE} BETWEEN',
]);

// https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_SQLCommandRef.html
export default class RedshiftFormatter extends Formatter {
  static operators = ['~', '|/', '||/', '<<', '>>', '||'];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSelect,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedPhrases,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: ["''"],
      identTypes: [`""`],
      identChars: { first: '#' },
      paramTypes: { numbered: ['$'] },
      operators: RedshiftFormatter.operators,
    });
  }
}
