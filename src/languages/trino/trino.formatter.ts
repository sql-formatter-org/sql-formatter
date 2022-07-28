import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import type { QuoteType } from 'src/lexer/regexTypes';
import { functions } from './trino.functions';
import { keywords } from './trino.keywords';

// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L41
const reservedCommands = [
  // DDL
  'ALTER SCHEMA',
  'ALTER TABLE',
  'RENAME TO',
  'ADD COLUMN',
  'RENAME COLUMN',
  'DROP COLUMN',
  'SET AUTHORIZATION',
  'SET PROPERTIES',
  'EXECUTE',
  'ALTER MATERIALIZED VIEW',
  'ALTER VIEW',
  'CREATE SCHEMA',
  'CREATE TABLE',
  'CREATE VIEW',
  'CREATE OR REPLACE VIEW',
  'CREATE MATERIALIZED VIEW',
  'CREATE OR REPLACE MATERIALIZED VIEW',
  'CREATE ROLE',
  'DROP SCHEMA',
  'DROP TABLE',
  'DROP COLUMN',
  'DROP MATERIALIZED VIEW',
  'DROP VIEW',
  'DROP ROLE',
  'TRUNCATE TABLE',
  // DML
  'INSERT INTO',
  'MERGE INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  // Data Retrieval
  'WITH',
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'WINDOW',
  'ORDER BY',
  'OFFSET',
  'LIMIT',
  'FETCH',

  'PARTITION BY',

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
];

// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L231-L235
// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L288-L291
const reservedBinaryCommands = expandPhrases([
  'UNION [ALL | DISTINCT]',
  'EXCEPT [ALL | DISTINCT]',
  'INTERSECT [ALL | DISTINCT]',
]);

// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L299-L313
const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL JOIN',
  'NATURAL INNER JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
]);

export default class TrinoFormatter extends Formatter {
  // https://trino.io/docs/current/functions/list.html#id1
  // https://trino.io/docs/current/sql/match-recognize.html#row-pattern-syntax
  static operators = ['||', '->'];
  static stringTypes: QuoteType[] = [{ quote: "''", prefixes: ['X', 'U&'], escapes: ["'"] }];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      // https://trino.io/docs/current/sql/match-recognize.html#row-pattern-syntax
      openParens: ['(', '[', '{', '{-'],
      closeParens: [')', ']', '}', '-}'],
      // https://trino.io/docs/current/language/types.html#string
      // https://trino.io/docs/current/language/types.html#varbinary
      stringTypes: TrinoFormatter.stringTypes,
      // https://trino.io/docs/current/language/reserved.html
      identTypes: ['""'],
      positionalParams: true,
      operators: TrinoFormatter.operators,
    });
  }
}
