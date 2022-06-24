import Formatter from 'src/core/Formatter';
import Tokenizer from 'src/core/Tokenizer';
import { EOF_TOKEN, TokenType, type Token } from 'src/core/token';
import { dedupe } from 'src/utils';

/**
 * Priority 5 (last)
 * Full list of reserved functions
 * distinct from Keywords due to interaction with parentheses
 */
const reservedFunctions = {
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/aead_encryption_functions
  aead: [
    'KEYS.NEW_KEYSET',
    'KEYS.ADD_KEY_FROM_RAW_BYTES',
    'AEAD.DECRYPT_BYTES',
    'AEAD.DECRYPT_STRING',
    'AEAD.ENCRYPT',
    'KEYS.KEYSET_CHAIN',
    'KEYS.KEYSET_FROM_JSON',
    'KEYS.KEYSET_TO_JSON',
    'KEYS.ROTATE_KEYSET',
    'KEYS.KEYSET_LENGTH',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/aggregate_analytic_functions
  aggregateAnalytic: [
    'ANY_VALUE',
    'ARRAY_AGG',
    'AVG',
    'CORR',
    'COUNT',
    'COUNTIF',
    'COVAR_POP',
    'COVAR_SAMP',
    'MAX',
    'MIN',
    'ST_CLUSTERDBSCAN',
    'STDDEV_POP',
    'STDDEV_SAMP',
    'STRING_AGG',
    'SUM',
    'VAR_POP',
    'VAR_SAMP',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/aggregate_functions
  aggregate: [
    'ANY_VALUE',
    'ARRAY_AGG',
    'ARRAY_CONCAT_AGG',
    'AVG',
    'BIT_AND',
    'BIT_OR',
    'BIT_XOR',
    'COUNT',
    'COUNTIF',
    'LOGICAL_AND',
    'LOGICAL_OR',
    'MAX',
    'MIN',
    'STRING_AGG',
    'SUM',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/approximate_aggregate_functions
  approximateAggregate: [
    'APPROX_COUNT_DISTINCT',
    'APPROX_QUANTILES',
    'APPROX_TOP_COUNT',
    'APPROX_TOP_SUM',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/array_functions
  array: [
    'ARRAY',
    'ARRAY_CONCAT',
    'ARRAY_LENGTH',
    'ARRAY_TO_STRING',
    'GENERATE_ARRAY',
    'GENERATE_DATE_ARRAY',
    'GENERATE_TIMESTAMP_ARRAY',
    'ARRAY_REVERSE',
    'OFFSET',
    'SAFE_OFFSET',
    'ORDINAL',
    'SAFE_ORDINAL',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/bit_functions
  bitwise: ['BIT_COUNT'],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/conversion_functions
  conversion: [
    // 'CASE',
    'PARSE_BIGNUMERIC',
    'PARSE_NUMERIC',
    'SAFE_CAST',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions
  date: [
    'CURRENT_DATE',
    'EXTRACT',
    'DATE',
    'DATE_ADD',
    'DATE_SUB',
    'DATE_DIFF',
    'DATE_TRUNC',
    'DATE_FROM_UNIX_DATE',
    'FORMAT_DATE',
    'LAST_DAY',
    'PARSE_DATE',
    'UNIX_DATE',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/datetime_functions
  datetime: [
    'CURRENT_DATETIME',
    'DATETIME',
    'EXTRACT',
    'DATETIME_ADD',
    'DATETIME_SUB',
    'DATETIME_DIFF',
    'DATETIME_TRUNC',
    'FORMAT_DATETIME',
    'LAST_DAY',
    'PARSE_DATETIME',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/debugging_functions
  debugging: ['ERROR'],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/federated_query_functions
  federatedQuery: ['EXTERNAL_QUERY'],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/geography_functions
  geography: [
    'S2_CELLIDFROMPOINT',
    'S2_COVERINGCELLIDS',
    'ST_ANGLE',
    'ST_AREA',
    'ST_ASBINARY',
    'ST_ASGEOJSON',
    'ST_ASTEXT',
    'ST_AZIMUTH',
    'ST_BOUNDARY',
    'ST_BOUNDINGBOX',
    'ST_BUFFER',
    'ST_BUFFERWITHTOLERANCE',
    'ST_CENTROID',
    'ST_CENTROID_AGG',
    'ST_CLOSESTPOINT',
    'ST_CLUSTERDBSCAN',
    'ST_CONTAINS',
    'ST_CONVEXHULL',
    'ST_COVEREDBY',
    'ST_COVERS',
    'ST_DIFFERENCE',
    'ST_DIMENSION',
    'ST_DISJOINT',
    'ST_DISTANCE',
    'ST_DUMP',
    'ST_DWITHIN',
    'ST_ENDPOINT',
    'ST_EQUALS',
    'ST_EXTENT',
    'ST_EXTERIORRING',
    'ST_GEOGFROM',
    'ST_GEOGFROMGEOJSON',
    'ST_GEOGFROMTEXT',
    'ST_GEOGFROMWKB',
    'ST_GEOGPOINT',
    'ST_GEOGPOINTFROMGEOHASH',
    'ST_GEOHASH',
    'ST_GEOMETRYTYPE',
    'ST_INTERIORRINGS',
    'ST_INTERSECTION',
    'ST_INTERSECTS',
    'ST_INTERSECTSBOX',
    'ST_ISCOLLECTION',
    'ST_ISEMPTY',
    'ST_LENGTH',
    'ST_MAKELINE',
    'ST_MAKEPOLYGON',
    'ST_MAKEPOLYGONORIENTED',
    'ST_MAXDISTANCE',
    'ST_NPOINTS',
    'ST_NUMGEOMETRIES',
    'ST_NUMPOINTS',
    'ST_PERIMETER',
    'ST_POINTN',
    'ST_SIMPLIFY',
    'ST_SNAPTOGRID',
    'ST_STARTPOINT',
    'ST_TOUCHES',
    'ST_UNION',
    'ST_UNION_AGG',
    'ST_WITHIN',
    'ST_X',
    'ST_Y',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/hash_functions
  hash: ['FARM_FINGERPRINT', 'MD5', 'SHA1', 'SHA256', 'SHA512'],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/hll_functions
  hll: ['HLL_COUNT.INIT', 'HLL_COUNT.MERGE', 'HLL_COUNT.MERGE_PARTIAL', 'HLL_COUNT.EXTRACT'],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/interval_functions
  interval: ['MAKE_INTERVAL', 'EXTRACT', 'JUSTIFY_DAYS', 'JUSTIFY_HOURS', 'JUSTIFY_INTERVAL'],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/json_functions
  json: [
    'JSON_EXTRACT',
    'JSON_QUERY',
    'JSON_EXTRACT_SCALAR',
    'JSON_VALUE',
    'JSON_EXTRACT_ARRAY',
    'JSON_QUERY_ARRAY',
    'JSON_EXTRACT_STRING_ARRAY',
    'JSON_VALUE_ARRAY',
    'TO_JSON_STRING',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/mathematical_functions
  math: [
    'ABS',
    'SIGN',
    'IS_INF',
    'IS_NAN',
    'IEEE_DIVIDE',
    'RAND',
    'SQRT',
    'POW',
    'POWER',
    'EXP',
    'LN',
    'LOG',
    'LOG10',
    'GREATEST',
    'LEAST',
    'DIV',
    'SAFE_DIVIDE',
    'SAFE_MULTIPLY',
    'SAFE_NEGATE',
    'SAFE_ADD',
    'SAFE_SUBTRACT',
    'MOD',
    'ROUND',
    'TRUNC',
    'CEIL',
    'CEILING',
    'FLOOR',
    'COS',
    'COSH',
    'ACOS',
    'ACOSH',
    'SIN',
    'SINH',
    'ASIN',
    'ASINH',
    'TAN',
    'TANH',
    'ATAN',
    'ATANH',
    'ATAN2',
    'RANGE_BUCKET',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/navigation_functions
  navigation: [
    'FIRST_VALUE',
    'LAST_VALUE',
    'NTH_VALUE',
    'LEAD',
    'LAG',
    'PERCENTILE_CONT',
    'PERCENTILE_DISC',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/net_functions
  net: [
    'NET.IP_FROM_STRING',
    'NET.SAFE_IP_FROM_STRING',
    'NET.IP_TO_STRING',
    'NET.IP_NET_MASK',
    'NET.IP_TRUNC',
    'NET.IPV4_FROM_INT64',
    'NET.IPV4_TO_INT64',
    'NET.HOST',
    'NET.PUBLIC_SUFFIX',
    'NET.REG_DOMAIN',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/numbering_functions
  numbering: ['RANK', 'DENSE_RANK', 'PERCENT_RANK', 'CUME_DIST', 'NTILE', 'ROW_NUMBER'],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/security_functions
  security: ['SESSION_USER'],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/statistical_aggregate_functions
  statisticalAggregate: [
    'CORR',
    'COVAR_POP',
    'COVAR_SAMP',
    'STDDEV_POP',
    'STDDEV_SAMP',
    'STDDEV',
    'VAR_POP',
    'VAR_SAMP',
    'VARIANCE',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/string_functions
  string: [
    'ASCII',
    'BYTE_LENGTH',
    'CHAR_LENGTH',
    'CHARACTER_LENGTH',
    'CHR',
    'CODE_POINTS_TO_BYTES',
    'CODE_POINTS_TO_STRING',
    'CONCAT',
    'CONTAINS_SUBSTR',
    'ENDS_WITH',
    'FORMAT',
    'FROM_BASE32',
    'FROM_BASE64',
    'FROM_HEX',
    'INITCAP',
    'INSTR',
    'LEFT',
    'LENGTH',
    'LPAD',
    'LOWER',
    'LTRIM',
    'NORMALIZE',
    'NORMALIZE_AND_CASEFOLD',
    'OCTET_LENGTH',
    'REGEXP_CONTAINS',
    'REGEXP_EXTRACT',
    'REGEXP_EXTRACT_ALL',
    'REGEXP_INSTR',
    'REGEXP_REPLACE',
    'REGEXP_SUBSTR',
    'REPLACE',
    'REPEAT',
    'REVERSE',
    'RIGHT',
    'RPAD',
    'RTRIM',
    'SAFE_CONVERT_BYTES_TO_STRING',
    'SOUNDEX',
    'SPLIT',
    'STARTS_WITH',
    'STRPOS',
    'SUBSTR',
    'SUBSTRING',
    'TO_BASE32',
    'TO_BASE64',
    'TO_CODE_POINTS',
    'TO_HEX',
    'TRANSLATE',
    'TRIM',
    'UNICODE',
    'UPPER',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/time_functions
  time: [
    'CURRENT_TIME',
    'TIME',
    'EXTRACT',
    'TIME_ADD',
    'TIME_SUB',
    'TIME_DIFF',
    'TIME_TRUNC',
    'FORMAT_TIME',
    'PARSE_TIME',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/timestamp_functions
  timestamp: [
    'CURRENT_TIMESTAMP',
    'EXTRACT',
    'STRING',
    'TIMESTAMP',
    'TIMESTAMP_ADD',
    'TIMESTAMP_SUB',
    'TIMESTAMP_DIFF',
    'TIMESTAMP_TRUNC',
    'FORMAT_TIMESTAMP',
    'PARSE_TIMESTAMP',
    'TIMESTAMP_SECONDS',
    'TIMESTAMP_MILLIS',
    'TIMESTAMP_MICROS',
    'UNIX_SECONDS',
    'UNIX_MILLIS',
    'UNIX_MICROS',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/uuid_functions
  uuid: ['GENERATE_UUID'],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/conditional_expressions
  conditional: ['COALESCE', 'IF', 'IFNULL', 'NULLIF'],
  // https://cloud.google.com/bigquery/docs/reference/legacy-sql
  legacyAggregate: [
    'AVG',
    'BIT_AND',
    'BIT_OR',
    'BIT_XOR',
    'CORR',
    'COUNT',
    'COVAR_POP',
    'COVAR_SAMP',
    'EXACT_COUNT_DISTINCT',
    'FIRST',
    'GROUP_CONCAT',
    'GROUP_CONCAT_UNQUOTED',
    'LAST',
    'MAX',
    'MIN',
    'NEST',
    'NTH',
    'QUANTILES',
    'STDDEV',
    'STDDEV_POP',
    'STDDEV_SAMP',
    'SUM',
    'TOP',
    'UNIQUE',
    'VARIANCE',
    'VAR_POP',
    'VAR_SAMP',
  ],
  legacyBitwise: ['BIT_COUNT'],
  legacyCasting: ['BOOLEAN', 'BYTES', 'CAST', 'FLOAT', 'HEX_STRING', 'INTEGER', 'STRING'],
  legacyComparison: [
    // expr 'IN',
    'COALESCE',
    'GREATEST',
    'IFNULL',
    'IS_INF',
    'IS_NAN',
    'IS_EXPLICITLY_DEFINED',
    'LEAST',
    'NVL',
  ],
  legacyDatetime: [
    'CURRENT_DATE',
    'CURRENT_TIME',
    'CURRENT_TIMESTAMP',
    'DATE',
    'DATE_ADD',
    'DATEDIFF',
    'DAY',
    'DAYOFWEEK',
    'DAYOFYEAR',
    'FORMAT_UTC_USEC',
    'HOUR',
    'MINUTE',
    'MONTH',
    'MSEC_TO_TIMESTAMP',
    'NOW',
    'PARSE_UTC_USEC',
    'QUARTER',
    'SEC_TO_TIMESTAMP',
    'SECOND',
    'STRFTIME_UTC_USEC',
    'TIME',
    'TIMESTAMP',
    'TIMESTAMP_TO_MSEC',
    'TIMESTAMP_TO_SEC',
    'TIMESTAMP_TO_USEC',
    'USEC_TO_TIMESTAMP',
    'UTC_USEC_TO_DAY',
    'UTC_USEC_TO_HOUR',
    'UTC_USEC_TO_MONTH',
    'UTC_USEC_TO_WEEK',
    'UTC_USEC_TO_YEAR',
    'WEEK',
    'YEAR',
  ],
  legacyIp: ['FORMAT_IP', 'PARSE_IP', 'FORMAT_PACKED_IP', 'PARSE_PACKED_IP'],
  legacyJson: ['JSON_EXTRACT', 'JSON_EXTRACT_SCALAR'],
  legacyMath: [
    'ABS',
    'ACOS',
    'ACOSH',
    'ASIN',
    'ASINH',
    'ATAN',
    'ATANH',
    'ATAN2',
    'CEIL',
    'COS',
    'COSH',
    'DEGREES',
    'EXP',
    'FLOOR',
    'LN',
    'LOG',
    'LOG2',
    'LOG10',
    'PI',
    'POW',
    'RADIANS',
    'RAND',
    'ROUND',
    'SIN',
    'SINH',
    'SQRT',
    'TAN',
    'TANH',
  ],
  legacyRegex: ['REGEXP_MATCH', 'REGEXP_EXTRACT', 'REGEXP_REPLACE'],
  legacyString: [
    'CONCAT',
    // expr CONTAINS 'str'
    'INSTR',
    'LEFT',
    'LENGTH',
    'LOWER',
    'LPAD',
    'LTRIM',
    'REPLACE',
    'RIGHT',
    'RPAD',
    'RTRIM',
    'SPLIT',
    'SUBSTR',
    'UPPER',
  ],
  legacyTableWildcard: ['TABLE_DATE_RANGE', 'TABLE_DATE_RANGE_STRICT', 'TABLE_QUERY'],
  legacyUrl: ['HOST', 'DOMAIN', 'TLD'],
  legacyWindow: [
    'AVG',
    'COUNT',
    'MAX',
    'MIN',
    'STDDEV',
    'SUM',
    'CUME_DIST',
    'DENSE_RANK',
    'FIRST_VALUE',
    'LAG',
    'LAST_VALUE',
    'LEAD',
    'NTH_VALUE',
    'NTILE',
    'PERCENT_RANK',
    'PERCENTILE_CONT',
    'PERCENTILE_DISC',
    'RANK',
    'RATIO_TO_REPORT',
    'ROW_NUMBER',
  ],
  legacyMisc: [
    'CURRENT_USER',
    'EVERY',
    'FROM_BASE64',
    'HASH',
    'FARM_FINGERPRINT',
    'IF',
    'POSITION',
    'SHA1',
    'SOME',
    'TO_BASE64',
  ],
  other: ['BQ.JOBS.CANCEL', 'BQ.REFRESH_MATERIALIZED_VIEW'],
};

/**
 * Priority 5 (last)
 * Full list of reserved words
 * any words that are in a higher priority are removed
 */
const reservedKeywords = {
  keywords: [
    'ALL',
    // 'AND',
    'ANY',
    // 'ARRAY',
    'AS',
    'ASC',
    'ASSERT_ROWS_MODIFIED',
    'AT',
    'BETWEEN',
    'BY',
    // 'CASE',
    'CAST',
    'COLLATE',
    'CONTAINS',
    // 'CREATE',
    // 'CROSS',
    'CUBE',
    'CURRENT',
    'DEFAULT',
    'DEFINE',
    'DESC',
    'DISTINCT',
    // 'ELSE',
    // 'END',
    'ENUM',
    'ESCAPE',
    // 'EXCEPT',
    // 'EXCLUDE',
    'EXISTS',
    'EXTRACT',
    'FALSE',
    // 'FETCH',
    'FOLLOWING',
    'FOR',
    // 'FROM',
    'FULL',
    // 'GROUP',
    'GROUPING',
    'GROUPS',
    'HASH',
    // 'HAVING',
    'IF',
    'IGNORE',
    'IN',
    // 'INNER',
    // 'INTERSECT',
    // 'INTERVAL',
    'INTO',
    'IS',
    // 'JOIN',
    // 'LATERAL',
    // 'LEFT',
    'LIKE',
    // 'LIMIT',
    'LOOKUP',
    // 'MERGE',
    // 'NATURAL',
    'NEW',
    'NO',
    'NOT',
    'NULL',
    'NULLS',
    'OF',
    // 'ON',
    // 'OR',
    // 'ORDER',
    // 'OUTER',
    'OVER',
    'PARTITION',
    'PRECEDING',
    'PROTO',
    'RANGE',
    'RECURSIVE',
    'RESPECT',
    // 'RIGHT',
    'ROLLUP',
    'ROWS',
    // 'SELECT',
    // 'SET',
    'SOME',
    // 'STRUCT',
    'TABLE',
    // 'TABLESAMPLE',
    'THEN',
    'TO',
    'TREAT',
    'TRUE',
    'UNBOUNDED',
    // 'UNION',
    // 'UNNEST',
    // 'USING',
    // 'WHEN',
    // 'WHERE',
    // 'WINDOW',
    // 'WITH',
    'WITHIN',
  ],
  datatypes: [
    'ARRAY', // parametric, ARRAY<T>
    'BOOL',
    'BYTES', // parameterised, BYTES(Length)
    'DATE',
    'DATETIME',
    'GEOGRAPHY',
    'INTERVAL',
    'INT64',
    'INT',
    'SMALLINT',
    'INTEGER',
    'BIGINT',
    'TINYINT',
    'BYTEINT',
    'NUMERIC', // parameterised, NUMERIC(Precision[, Scale])
    'DECIMAL', // parameterised, DECIMAL(Precision[, Scale])
    'BIGNUMERIC', // parameterised, BIGNUMERIC(Precision[, Scale])
    'BIGDECIMAL', // parameterised, BIGDECIMAL(Precision[, Scale])
    'FLOAT64',
    'STRING', // parameterised, STRING(Length)
    'STRUCT', // parametric, STRUCT<T>
    'TIME',
    'TIMEZONE',
  ],
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/conversion_functions#formatting_syntax
  stringFormat: ['HEX', 'BASEX', 'BASE64M', 'ASCII', 'UTF-8', 'UTF8'],
  misc: ['SAFE'],
};

/**
 * Priority 1 (first)
 * keywords that begin a new statement
 * will begin new indented block
 */
const reservedCommands = [
  // DQL, https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax
  'SELECT',
  'FROM',
  'UNNEST',
  'PIVOT',
  'UNPIVOT',
  'TABLESAMPLE SYSTEM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'QUALIFY',
  'WINDOW',
  'LIMIT',
  'OFFSET',
  'WITH',
  'OMIT RECORD IF', // legacy
  // DML, https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax
  'INSERT',
  'INSERT INTO',
  'VALUES',
  'DELETE',
  'DELETE FROM',
  'TRUNCATE TABLE',
  'UPDATE',
  'MERGE',
  'MERGE INTO',
  // 'USING',
  // DDL, https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language
  'SET SCHEMA', // added
  'CREATE SCHEMA',
  'CREATE TABLE',
  'CREATE TABLE LIKE',
  'CREATE TABLE COPY',
  'CREATE SNAPSHOT TABLE',
  'CREATE TABLE CLONE',
  'CREATE VIEW',
  'CREATE MATERIALIZED VIEW',
  'CREATE EXTERNAL TABLE',
  'CREATE FUNCTION',
  'CREATE TABLE FUNCTION',
  'CREATE PROCEDURE',
  'CREATE ROW ACCESS POLICY',
  'ALTER SCHEMA SET OPTIONS',
  'ALTER TABLE SET OPTIONS',
  'ALTER TABLE ADD COLUMN',
  'ALTER TABLE RENAME TO',
  'ALTER TABLE DROP COLUMN',
  'ALTER COLUMN SET OPTIONS',
  'ALTER COLUMN DROP NOT NULL',
  'ALTER COLUMN SET DATA TYPE',
  'ALTER VIEW SET OPTIONS',
  'ALTER MATERIALIZED VIEW SET OPTIONS',
  'DROP SCHEMA',
  'DROP TABLE',
  'DROP SNAPSHOT TABLE',
  'DROP EXTERNAL TABLE',
  'DROP VIEW',
  'DROP MATERIALIZED VIEW',
  'DROP FUNCTION',
  'DROP TABLE FUNCTION',
  'DROP PROCEDURE',
  'DROP ROW ACCESS POLICY',
  // DCL, https://cloud.google.com/bigquery/docs/reference/standard-sql/data-control-language
  'GRANT',
  'REVOKE',
  'CREATE CAPACITY',
  'CREATE RESERVATION',
  'CREATE ASSIGNMENT',
  'DROP CAPACITY',
  'DROP RESERVATION',
  'DROP ASSIGNMENT',
  // Script, https://cloud.google.com/bigquery/docs/reference/standard-sql/scripting
  'DECLARE',
  'SET',
  'EXECUTE IMMEDIATE',
  'LOOP',
  'END LOOP',
  'REPEAT',
  'END REPEAT',
  'WHILE',
  'END WHILE',
  'BREAK',
  'LEAVE',
  'CONTINUE',
  'ITERATE',
  'FOR',
  'END FOR',
  'BEGIN',
  'BEGIN TRANSACTION',
  'COMMIT TRANSACTION',
  'ROLLBACK TRANSACTION',
  'RAISE',
  'RETURN',
  'CALL',
  // Debug, https://cloud.google.com/bigquery/docs/reference/standard-sql/debugging-statements
  'ASSERT',
  // Other, https://cloud.google.com/bigquery/docs/reference/standard-sql/other-statements
  'EXPORT DATA',
];

/**
 * Priority 2
 * commands that operate on two tables or subqueries
 * two main categories: joins and boolean set operators
 */
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
  // joins
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'LEFT OUTER JOIN',
  'RIGHT JOIN',
  'RIGHT OUTER JOIN',
  'FULL JOIN',
  'FULL OUTER JOIN',
  'CROSS JOIN',
];

/**
 * Priority 3
 * keywords that follow a previous Statement, must be attached to subsequent data
 * can be fully inline or on newline with optional indent
 */
const reservedDependentClauses = ['WHEN', 'ELSE'];

// https://cloud.google.com/bigquery/docs/reference/#standard-sql-reference
export default class BigQueryFormatter extends Formatter {
  static operators = ['>>', '<<', '||'];
  // TODO: handle trailing comma in select clause

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedDependentClauses,
      reservedKeywords: dedupe([
        ...Object.values(reservedFunctions).flat(),
        ...Object.values(reservedKeywords).flat(),
      ]),
      openParens: ['(', '['],
      closeParens: [')', ']'],
      stringTypes: [
        // The triple-quoted strings are listed first, so they get matched first.
        // Otherwise the first two quotes of """ will get matched as an empty "" string.
        { quote: '""".."""', prefixes: ['R', 'B', 'RB', 'BR'] },
        { quote: "'''..'''", prefixes: ['R', 'B', 'RB', 'BR'] },
        { quote: '""', prefixes: ['R', 'B', 'RB', 'BR'] },
        { quote: "''", prefixes: ['R', 'B', 'RB', 'BR'] },
      ],
      identTypes: ['``'],
      identChars: { dashes: true },
      positionalParams: true,
      namedParamTypes: ['@'],
      quotedParamTypes: ['@'],
      lineCommentTypes: ['--', '#'],
      operators: BigQueryFormatter.operators,
      preprocess,
    });
  }
}

function preprocess(tokens: Token[]): Token[] {
  return detectArraySubscripts(combineParameterizedTypes(tokens));
}

// Converts OFFSET token inside array from RESERVED_COMMAND to RESERVED_KEYWORD
// See: https://cloud.google.com/bigquery/docs/reference/standard-sql/functions-and-operators#array_subscript_operator
function detectArraySubscripts(tokens: Token[]) {
  let prevToken = EOF_TOKEN;
  return tokens.map(token => {
    if (token.value === 'OFFSET' && prevToken.value === '[') {
      prevToken = token;
      return { ...token, type: TokenType.RESERVED_KEYWORD };
    } else {
      prevToken = token;
      return token;
    }
  });
}

// Combines multiple tokens forming a parameterized type like STRUCT<ARRAY<INT64>> into a single token
function combineParameterizedTypes(tokens: Token[]) {
  const processed: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1] || EOF_TOKEN;

    if ((token.value === 'ARRAY' || token.value === 'STRUCT') && nextToken.value === '<') {
      const endIndex = findClosingAngleBracketIndex(tokens, i + 1);
      const typeDefTokens = tokens.slice(i, endIndex + 1);
      processed.push({
        ...token,
        value: typeDefTokens.map(t => t.value).join(''),
        text: typeDefTokens.map(t => t.text).join(''),
      });
      i = endIndex;
    } else {
      processed.push(token);
    }
  }
  return processed;
}

function findClosingAngleBracketIndex(tokens: Token[], startIndex: number): number {
  let level = 0;
  for (let i = startIndex; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.value === '<') {
      level++;
    } else if (token.value === '>') {
      level--;
    } else if (token.value === '>>') {
      level -= 2;
    }
    if (level === 0) {
      return i;
    }
  }
  return tokens.length - 1;
}
