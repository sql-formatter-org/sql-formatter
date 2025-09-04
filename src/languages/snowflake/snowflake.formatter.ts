import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { functions } from './snowflake.functions.js';
import { dataTypes, keywords } from './snowflake.keywords.js';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'PARTITION BY',
  'ORDER BY',
  'QUALIFY',
  'LIMIT',
  'OFFSET',
  'FETCH [FIRST | NEXT]',
  // Data manipulation
  // - insert:
  'INSERT [OVERWRITE] [ALL INTO | INTO | ALL | FIRST]',
  '{THEN | ELSE} INTO',
  'VALUES',
  // - update:
  'SET',

  'CLUSTER BY',
  '[WITH] {MASKING POLICY | TAG | ROW ACCESS POLICY}',
  'COPY GRANTS',
  'USING TEMPLATE',
  'MERGE INTO',
  'WHEN MATCHED [AND]',
  'THEN {UPDATE SET | DELETE}',
  'WHEN NOT MATCHED THEN INSERT',
]);

const standardOnelineClauses = expandPhrases([
  'CREATE [OR REPLACE] [VOLATILE] TABLE [IF NOT EXISTS]',
  'CREATE [OR REPLACE] [LOCAL | GLOBAL] {TEMP|TEMPORARY} TABLE [IF NOT EXISTS]',
]);

const tabularOnelineClauses = expandPhrases([
  // - create:
  'CREATE [OR REPLACE] [SECURE] [RECURSIVE] VIEW [IF NOT EXISTS]',
  // - update:
  'UPDATE',
  // - delete:
  'DELETE FROM',
  // - drop table:
  'DROP TABLE [IF EXISTS]',
  // - alter table:
  'ALTER TABLE [IF EXISTS]',
  'RENAME TO',
  'SWAP WITH',
  '[SUSPEND | RESUME] RECLUSTER',
  'DROP CLUSTERING KEY',
  'ADD [COLUMN]',
  'RENAME COLUMN',
  '{ALTER | MODIFY} [COLUMN]',
  'DROP [COLUMN]',
  '{ADD | ALTER | MODIFY | DROP} [CONSTRAINT]',
  'RENAME CONSTRAINT',
  '{ADD | DROP} SEARCH OPTIMIZATION',
  '{SET | UNSET} TAG', // Actually TAG is optional, but that conflicts with UPDATE..SET statement
  '{ADD | DROP} ROW ACCESS POLICY',
  'DROP ALL ROW ACCESS POLICIES',
  '{SET | DROP} DEFAULT', // for alter column
  '{SET | DROP} NOT NULL', // for alter column
  'SET DATA TYPE', // for alter column
  'UNSET COMMENT', // for alter column
  '{SET | UNSET} MASKING POLICY', // for alter column
  // - truncate:
  'TRUNCATE [TABLE] [IF EXISTS]',
  // other
  // https://docs.snowflake.com/en/sql-reference/sql-all.html
  //
  // 1. run in console on this page: $x('//tbody/tr/*[1]//a/span/text()').map(x => x.nodeValue)
  // 2. delete all lines that contain a sting like '(.*)', they are already covered in the list
  // 3. delete all lines that contain a sting like '<.*>', they are already covered in the list
  // 4. delete all lines that contain '…', they are part of a regex statement that can't be covered here
  // 5. Manually add 'COPY INTO'
  // 6. Remove all lines that are already in `reservedClauses`
  //
  // Steps 1-4 can be combined by the following script in the developer console:
  // $x('//tbody/tr/*[1]//a/span/text()').map(x => x.nodeValue) // Step 1
  //   filter(x => !x.match(/\(.*\)/) && !x.match(/…/) && !x.match(/<.*>/)) // Step 2-4
  'ALTER ACCOUNT',
  'ALTER API INTEGRATION',
  'ALTER CONNECTION',
  'ALTER DATABASE',
  'ALTER EXTERNAL TABLE',
  'ALTER FAILOVER GROUP',
  'ALTER FILE FORMAT',
  'ALTER FUNCTION',
  'ALTER INTEGRATION',
  'ALTER MASKING POLICY',
  'ALTER MATERIALIZED VIEW',
  'ALTER NETWORK POLICY',
  'ALTER NOTIFICATION INTEGRATION',
  'ALTER PIPE',
  'ALTER PROCEDURE',
  'ALTER REPLICATION GROUP',
  'ALTER RESOURCE MONITOR',
  'ALTER ROLE',
  'ALTER ROW ACCESS POLICY',
  'ALTER SCHEMA',
  'ALTER SECURITY INTEGRATION',
  'ALTER SEQUENCE',
  'ALTER SESSION',
  'ALTER SESSION POLICY',
  'ALTER SHARE',
  'ALTER STAGE',
  'ALTER STORAGE INTEGRATION',
  'ALTER STREAM',
  'ALTER TAG',
  'ALTER TASK',
  'ALTER USER',
  'ALTER VIEW',
  'ALTER WAREHOUSE',
  'BEGIN',
  'CALL',
  'COMMIT',
  'COPY INTO',
  'CREATE ACCOUNT',
  'CREATE API INTEGRATION',
  'CREATE CONNECTION',
  'CREATE DATABASE',
  'CREATE EXTERNAL FUNCTION',
  'CREATE EXTERNAL TABLE',
  'CREATE FAILOVER GROUP',
  'CREATE FILE FORMAT',
  'CREATE FUNCTION',
  'CREATE INTEGRATION',
  'CREATE MANAGED ACCOUNT',
  'CREATE MASKING POLICY',
  'CREATE MATERIALIZED VIEW',
  'CREATE NETWORK POLICY',
  'CREATE NOTIFICATION INTEGRATION',
  'CREATE PIPE',
  'CREATE PROCEDURE',
  'CREATE REPLICATION GROUP',
  'CREATE RESOURCE MONITOR',
  'CREATE ROLE',
  'CREATE ROW ACCESS POLICY',
  'CREATE SCHEMA',
  'CREATE SECURITY INTEGRATION',
  'CREATE SEQUENCE',
  'CREATE SESSION POLICY',
  'CREATE SHARE',
  'CREATE STAGE',
  'CREATE STORAGE INTEGRATION',
  'CREATE STREAM',
  'CREATE TAG',
  'CREATE TASK',
  'CREATE USER',
  'CREATE WAREHOUSE',
  'DELETE',
  'DESCRIBE DATABASE',
  'DESCRIBE EXTERNAL TABLE',
  'DESCRIBE FILE FORMAT',
  'DESCRIBE FUNCTION',
  'DESCRIBE INTEGRATION',
  'DESCRIBE MASKING POLICY',
  'DESCRIBE MATERIALIZED VIEW',
  'DESCRIBE NETWORK POLICY',
  'DESCRIBE PIPE',
  'DESCRIBE PROCEDURE',
  'DESCRIBE RESULT',
  'DESCRIBE ROW ACCESS POLICY',
  'DESCRIBE SCHEMA',
  'DESCRIBE SEQUENCE',
  'DESCRIBE SESSION POLICY',
  'DESCRIBE SHARE',
  'DESCRIBE STAGE',
  'DESCRIBE STREAM',
  'DESCRIBE TABLE',
  'DESCRIBE TASK',
  'DESCRIBE TRANSACTION',
  'DESCRIBE USER',
  'DESCRIBE VIEW',
  'DESCRIBE WAREHOUSE',
  'DROP CONNECTION',
  'DROP DATABASE',
  'DROP EXTERNAL TABLE',
  'DROP FAILOVER GROUP',
  'DROP FILE FORMAT',
  'DROP FUNCTION',
  'DROP INTEGRATION',
  'DROP MANAGED ACCOUNT',
  'DROP MASKING POLICY',
  'DROP MATERIALIZED VIEW',
  'DROP NETWORK POLICY',
  'DROP PIPE',
  'DROP PROCEDURE',
  'DROP REPLICATION GROUP',
  'DROP RESOURCE MONITOR',
  'DROP ROLE',
  'DROP ROW ACCESS POLICY',
  'DROP SCHEMA',
  'DROP SEQUENCE',
  'DROP SESSION POLICY',
  'DROP SHARE',
  'DROP STAGE',
  'DROP STREAM',
  'DROP TAG',
  'DROP TASK',
  'DROP USER',
  'DROP VIEW',
  'DROP WAREHOUSE',
  'EXECUTE IMMEDIATE',
  'EXECUTE TASK',
  'EXPLAIN',
  'GET',
  'GRANT OWNERSHIP',
  'GRANT ROLE',
  'INSERT',
  'LIST',
  'MERGE',
  'PUT',
  'REMOVE',
  'REVOKE ROLE',
  'ROLLBACK',
  'SHOW COLUMNS',
  'SHOW CONNECTIONS',
  'SHOW DATABASES',
  'SHOW DATABASES IN FAILOVER GROUP',
  'SHOW DATABASES IN REPLICATION GROUP',
  'SHOW DELEGATED AUTHORIZATIONS',
  'SHOW EXTERNAL FUNCTIONS',
  'SHOW EXTERNAL TABLES',
  'SHOW FAILOVER GROUPS',
  'SHOW FILE FORMATS',
  'SHOW FUNCTIONS',
  'SHOW GLOBAL ACCOUNTS',
  'SHOW GRANTS',
  'SHOW INTEGRATIONS',
  'SHOW LOCKS',
  'SHOW MANAGED ACCOUNTS',
  'SHOW MASKING POLICIES',
  'SHOW MATERIALIZED VIEWS',
  'SHOW NETWORK POLICIES',
  'SHOW OBJECTS',
  'SHOW ORGANIZATION ACCOUNTS',
  'SHOW PARAMETERS',
  'SHOW PIPES',
  'SHOW PRIMARY KEYS',
  'SHOW PROCEDURES',
  'SHOW REGIONS',
  'SHOW REPLICATION ACCOUNTS',
  'SHOW REPLICATION DATABASES',
  'SHOW REPLICATION GROUPS',
  'SHOW RESOURCE MONITORS',
  'SHOW ROLES',
  'SHOW ROW ACCESS POLICIES',
  'SHOW SCHEMAS',
  'SHOW SEQUENCES',
  'SHOW SESSION POLICIES',
  'SHOW SHARES',
  'SHOW SHARES IN FAILOVER GROUP',
  'SHOW SHARES IN REPLICATION GROUP',
  'SHOW STAGES',
  'SHOW STREAMS',
  'SHOW TABLES',
  'SHOW TAGS',
  'SHOW TASKS',
  'SHOW TRANSACTIONS',
  'SHOW USER FUNCTIONS',
  'SHOW USERS',
  'SHOW VARIABLES',
  'SHOW VIEWS',
  'SHOW WAREHOUSES',
  'TRUNCATE MATERIALIZED VIEW',
  'UNDROP DATABASE',
  'UNDROP SCHEMA',
  'UNDROP TABLE',
  'UNDROP TAG',
  'UNSET',
  'USE DATABASE',
  'USE ROLE',
  'USE SCHEMA',
  'USE SECONDARY ROLES',
  'USE WAREHOUSE',
]);

const reservedSetOperations = expandPhrases(['UNION [ALL]', 'MINUS', 'EXCEPT', 'INTERSECT']);

const reservedJoins = expandPhrases([
  '[INNER] JOIN',
  '[NATURAL] {LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{CROSS | NATURAL} JOIN',
]);

const reservedKeywordPhrases = expandPhrases([
  '{ROWS | RANGE} BETWEEN',
  'ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]',
]);

const reservedDataTypePhrases = expandPhrases([]);

export const snowflake: DialectOptions = {
  name: 'snowflake',
  tokenizerOptions: {
    reservedSelect,
    reservedClauses: [...reservedClauses, ...standardOnelineClauses, ...tabularOnelineClauses],
    reservedSetOperations,
    reservedJoins,
    reservedKeywordPhrases,
    reservedDataTypePhrases,
    reservedKeywords: keywords,
    reservedDataTypes: dataTypes,
    reservedFunctionNames: functions,
    stringTypes: ['$$', `''-qq-bs`],
    identTypes: ['""-qq'],
    variableTypes: [
      // for accessing columns at certain positons in the table
      { regex: '[$][1-9]\\d*' },
      // identifier style syntax
      { regex: '[$][_a-zA-Z][_a-zA-Z0-9$]*' },
    ],
    extraParens: ['[]'],
    identChars: { rest: '$' },
    lineCommentTypes: ['--', '//'],
    operators: [
      // Modulo
      '%',
      // Type cast
      '::',
      // String concat
      '||',
      // Generators: https://docs.snowflake.com/en/sql-reference/functions/generator.html#generator
      '=>',
      // Assignment https://docs.snowflake.com/en/sql-reference/snowflake-scripting/let
      ':=',
      // Lambda: https://docs.snowflake.com/en/user-guide/querying-semistructured#lambda-expressions
      '->',
    ],
    propertyAccessOperators: [':'],
  },
  formatOptions: {
    alwaysDenseOperators: ['::'],
    onelineClauses: [...standardOnelineClauses, ...tabularOnelineClauses],
    tabularOnelineClauses,
  },
};
