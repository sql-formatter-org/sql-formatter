import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './trino.functions';
import { keywords } from './trino.keywords';

// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L41
const reservedCommands = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'SELECT [ALL | DISTINCT]',
  'FROM',
  'WHERE',
  'GROUP BY [ALL | DISTINCT]',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'FETCH {FIRST | NEXT}',
  // Data manipulation
  // - insert:
  'INSERT INTO',
  'VALUES',
  // - update:
  'UPDATE',
  'SET',
  // - delete:
  'DELETE FROM',
  // - truncate:
  'TRUNCATE TABLE',
  // Data definition
  'CREATE [OR REPLACE] [MATERIALIZED] VIEW',
  'CREATE TABLE [IF NOT EXISTS]',
  'DROP TABLE [IF EXISTS]',
  // - alter table:
  'ALTER TABLE [IF EXISTS]',
  'ADD COLUMN [IF NOT EXISTS]',
  'DROP COLUMN [IF EXISTS]',
  'RENAME COLUMN [IF EXISTS]',
  'RENAME TO',
  'SET AUTHORIZATION [USER | ROLE]',
  'SET PROPERTIES',
  'EXECUTE',

  'ALTER SCHEMA',
  'ALTER MATERIALIZED VIEW',
  'ALTER VIEW',
  'CREATE SCHEMA',
  'CREATE ROLE',
  'DROP SCHEMA',
  'DROP COLUMN',
  'DROP MATERIALIZED VIEW',
  'DROP VIEW',
  'DROP ROLE',
  // Auxiliary
  'EXPLAIN',
  'ANALYZE',
  'EXPLAIN ANALYZE',
  'EXPLAIN ANALYZE VERBOSE',
  'USE',

  'COMMENT ON TABLE',
  'COMMENT ON COLUMN',
  'DESCRIBE INPUT',
  'DESCRIBE OUTPUT',

  'REFRESH MATERIALIZED VIEW',
  'RESET SESSION',
  'SET SESSION',
  'SET PATH',
  'SET TIME ZONE',

  'SHOW GRANTS',
  'SHOW CREATE TABLE',
  'SHOW CREATE SCHEMA',
  'SHOW CREATE VIEW',
  'SHOW CREATE MATERIALIZED VIEW',
  'SHOW TABLES',
  'SHOW SCHEMAS',
  'SHOW CATALOGS',
  'SHOW COLUMNS',
  'SHOW STATS FOR',
  'SHOW ROLES',
  'SHOW CURRENT ROLES',
  'SHOW ROLE GRANTS',
  'SHOW FUNCTIONS',
  'SHOW SESSION',

  // MATCH_RECOGNIZE
  'MATCH_RECOGNIZE',
  'MEASURES',
  'ONE ROW PER MATCH',
  'ALL ROWS PER MATCH',
  'AFTER MATCH',
  'PATTERN',
  'SUBSET',
  'DEFINE',
]);

// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L231-L235
// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L288-L291
const reservedSetOperations = expandPhrases([
  'UNION [ALL | DISTINCT]',
  'EXCEPT [ALL | DISTINCT]',
  'INTERSECT [ALL | DISTINCT]',
]);

// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L299-L313
const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL [INNER] JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
]);

export default class TrinoFormatter extends Formatter {
  // https://trino.io/docs/current/functions/list.html#id1
  // https://trino.io/docs/current/sql/match-recognize.html#row-pattern-syntax
  static operators = ['||', '->'];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      // https://trino.io/docs/current/sql/match-recognize.html#row-pattern-syntax
      openParens: ['(', '[', '{', '{-'],
      closeParens: [')', ']', '}', '-}'],
      // https://trino.io/docs/current/language/types.html#string
      // https://trino.io/docs/current/language/types.html#varbinary
      stringTypes: [{ quote: "''", prefixes: ['X', 'U&'] }],
      // https://trino.io/docs/current/language/reserved.html
      identTypes: ['""'],
      positionalParams: true,
      operators: TrinoFormatter.operators,
    });
  }
}
