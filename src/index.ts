export { supportedDialects, format, formatDialect } from './sqlFormatter.js';
export { expandPhrases } from './expandPhrases.js';
export { ConfigError } from './validateConfig.js';

// When adding a new dialect, be sure to add it to the list of exports below.
export { bigquery } from './languages/bigquery/bigquery.formatter.js';
export { db2 } from './languages/db2/db2.formatter.js';
export { db2i } from './languages/db2i/db2i.formatter.js';
export { hive } from './languages/hive/hive.formatter.js';
export { mariadb } from './languages/mariadb/mariadb.formatter.js';
export { mysql } from './languages/mysql/mysql.formatter.js';
export { tidb } from './languages/tidb/tidb.formatter.js';
export { n1ql } from './languages/n1ql/n1ql.formatter.js';
export { plsql } from './languages/plsql/plsql.formatter.js';
export { postgresql } from './languages/postgresql/postgresql.formatter.js';
export { redshift } from './languages/redshift/redshift.formatter.js';
export { spark } from './languages/spark/spark.formatter.js';
export { sqlite } from './languages/sqlite/sqlite.formatter.js';
export { sql } from './languages/sql/sql.formatter.js';
export { trino } from './languages/trino/trino.formatter.js';
export { transactsql } from './languages/transactsql/transactsql.formatter.js';
export { singlestoredb } from './languages/singlestoredb/singlestoredb.formatter.js';
export { snowflake } from './languages/snowflake/snowflake.formatter.js';

// NB! To re-export types the "export type" syntax is required by webpack.
// Otherwise webpack build will fail.
export type {
  SqlLanguage,
  FormatOptionsWithLanguage,
  FormatOptionsWithDialect,
} from './sqlFormatter.js';
export type {
  IndentStyle,
  KeywordCase,
  DataTypeCase,
  FunctionCase,
  IdentifierCase,
  LogicalOperatorNewline,
  FormatOptions,
} from './FormatOptions.js';
export type { ParamItems } from './formatter/Params.js';
export type { ParamTypes } from './lexer/TokenizerOptions.js';
export type { DialectOptions } from './dialect.js';
