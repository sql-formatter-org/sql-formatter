import { flatKeywordList } from '../../utils.js';

export const functions = flatKeywordList({
  // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_9_set_function_specification
  set: ['GROUPING'],
  // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_10_window_function
  window: ['RANK', 'DENSE_RANK', 'PERCENT_RANK', 'CUME_DIST', 'ROW_NUMBER'],
  // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_27_numeric_value_function
  numeric: [
    'POSITION',
    'OCCURRENCES_REGEX',
    'POSITION_REGEX',
    'EXTRACT',
    'CHAR_LENGTH',
    'CHARACTER_LENGTH',
    'OCTET_LENGTH',
    'CARDINALITY',
    'ABS',
    'MOD',
    'LN',
    'EXP',
    'POWER',
    'SQRT',
    'FLOOR',
    'CEIL',
    'CEILING',
    'WIDTH_BUCKET',
  ],
  // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_29_string_value_function
  string: [
    'SUBSTRING',
    'SUBSTRING_REGEX',
    'UPPER',
    'LOWER',
    'CONVERT',
    'TRANSLATE',
    'TRANSLATE_REGEX',
    'TRIM',
    'OVERLAY',
    'NORMALIZE',
    'SPECIFICTYPE',
  ],
  // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_31_datetime_value_function
  datetime: ['CURRENT_DATE', 'CURRENT_TIME', 'LOCALTIME', 'CURRENT_TIMESTAMP', 'LOCALTIMESTAMP'],
  // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_38_multiset_value_function
  // SET serves multiple roles: a SET() function and a SET keyword e.g. in UPDATE table SET ...
  // multiset: ['SET'], (disabled for now)
  // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_10_9_aggregate_function
  aggregate: [
    'COUNT',
    'AVG',
    'MAX',
    'MIN',
    'SUM',
    // 'EVERY',
    // 'ANY',
    // 'SOME',
    'STDDEV_POP',
    'STDDEV_SAMP',
    'VAR_SAMP',
    'VAR_POP',
    'COLLECT',
    'FUSION',
    'INTERSECTION',
    'COVAR_POP',
    'COVAR_SAMP',
    'CORR',
    'REGR_SLOPE',
    'REGR_INTERCEPT',
    'REGR_COUNT',
    'REGR_R2',
    'REGR_AVGX',
    'REGR_AVGY',
    'REGR_SXX',
    'REGR_SYY',
    'REGR_SXY',
    'PERCENTILE_CONT',
    'PERCENTILE_DISC',
  ],
  // CAST is a pretty complex case, involving multiple forms:
  // - CAST(col AS int)
  // - CAST(...) WITH ...
  // - CAST FROM int
  // - CREATE CAST(mycol AS int) WITH ...
  cast: ['CAST'],
  // Shorthand functions to use in place of CASE expression
  caseAbbrev: ['COALESCE', 'NULLIF'],
  // Non-standard functions that have widespread support
  nonStandard: ['ROUND', 'SIN', 'COS', 'TAN', 'ASIN', 'ACOS', 'ATAN'],
  // Data types with parameters like VARCHAR(100)
  // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#predefined-type
  dataTypes: [
    'CHARACTER',
    'CHAR',
    'CHARACTER VARYING',
    'CHAR VARYING',
    'VARCHAR',
    'CHARACTER LARGE OBJECT',
    'CHAR LARGE OBJECT',
    'CLOB',
    'NATIONAL CHARACTER',
    'NATIONAL CHAR',
    'NCHAR',
    'NATIONAL CHARACTER VARYING',
    'NATIONAL CHAR VARYING',
    'NCHAR VARYING',
    'NATIONAL CHARACTER LARGE OBJECT',
    'NCHAR LARGE OBJECT',
    'NCLOB',
    'BINARY',
    'BINARY VARYING',
    'VARBINARY',
    'BINARY LARGE OBJECT',
    'BLOB',
    'NUMERIC',
    'DECIMAL',
    'DEC',
    'TIME',
    'TIMESTAMP',
  ],
});
