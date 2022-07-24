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
];

// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L231-L235
// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L288-L291
const reservedBinaryCommands = [
  // set booleans
  'INTERSECT',
  'INTERSECT ALL',
  'INTERSECT DISTINCT',
  'UNION',
  'UNION ALL',
  'UNION DISTINCT',
  'EXCEPT',
  'EXCEPT ALL',
  'EXCEPT DISTINCT',
];

// https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L299-L313
const reservedJoins = [
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'LEFT OUTER JOIN',
  'RIGHT JOIN',
  'RIGHT OUTER JOIN',
  'FULL JOIN',
  'FULL OUTER JOIN',
  'CROSS JOIN',
  'NATURAL JOIN',
  'NATURAL INNER JOIN',
  'NATURAL LEFT JOIN',
  'NATURAL LEFT OUTER JOIN',
  'NATURAL RIGHT JOIN',
  'NATURAL RIGHT OUTER JOIN',
  'NATURAL FULL JOIN',
  'NATURAL FULL OUTER JOIN',
];

export default class TrinoFormatter extends Formatter {
  // https://trino.io/docs/current/functions/list.html#id1
  static operators = ['||', '->'];
  static stringTypes: QuoteType[] = [{ quote: "''", prefixes: ['X', 'U&'] }];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      openParens: ['(', '['],
      closeParens: [')', ']'],
      stringTypes: TrinoFormatter.stringTypes,
      identTypes: ['""', '``'],
      positionalParams: true,
      operators: TrinoFormatter.operators,
    });
  }
}
