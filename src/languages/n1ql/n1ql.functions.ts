import { flatKeywordList } from '../../utils.js';

export const functions = flatKeywordList({
  // https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/functions.html
  all: [
    'ABORT',
    'ABS',
    'ACOS',
    'ADVISOR',
    'ARRAY_AGG',
    'ARRAY_AGG',
    'ARRAY_APPEND',
    'ARRAY_AVG',
    'ARRAY_BINARY_SEARCH',
    'ARRAY_CONCAT',
    'ARRAY_CONTAINS',
    'ARRAY_COUNT',
    'ARRAY_DISTINCT',
    'ARRAY_EXCEPT',
    'ARRAY_FLATTEN',
    'ARRAY_IFNULL',
    'ARRAY_INSERT',
    'ARRAY_INTERSECT',
    'ARRAY_LENGTH',
    'ARRAY_MAX',
    'ARRAY_MIN',
    'ARRAY_MOVE',
    'ARRAY_POSITION',
    'ARRAY_PREPEND',
    'ARRAY_PUT',
    'ARRAY_RANGE',
    'ARRAY_REMOVE',
    'ARRAY_REPEAT',
    'ARRAY_REPLACE',
    'ARRAY_REVERSE',
    'ARRAY_SORT',
    'ARRAY_STAR',
    'ARRAY_SUM',
    'ARRAY_SYMDIFF',
    'ARRAY_SYMDIFF1',
    'ARRAY_SYMDIFFN',
    'ARRAY_UNION',
    'ASIN',
    'ATAN',
    'ATAN2',
    'AVG',
    'BASE64',
    'BASE64_DECODE',
    'BASE64_ENCODE',
    'BITAND ',
    'BITCLEAR ',
    'BITNOT ',
    'BITOR ',
    'BITSET ',
    'BITSHIFT ',
    'BITTEST ',
    'BITXOR ',
    'CEIL',
    'CLOCK_LOCAL',
    'CLOCK_MILLIS',
    'CLOCK_STR',
    'CLOCK_TZ',
    'CLOCK_UTC',
    'COALESCE',
    'CONCAT',
    'CONCAT2',
    'CONTAINS',
    'CONTAINS_TOKEN',
    'CONTAINS_TOKEN_LIKE',
    'CONTAINS_TOKEN_REGEXP',
    'COS',
    'COUNT',
    'COUNT',
    'COUNTN',
    'CUME_DIST',
    'CURL',
    'DATE_ADD_MILLIS',
    'DATE_ADD_STR',
    'DATE_DIFF_MILLIS',
    'DATE_DIFF_STR',
    'DATE_FORMAT_STR',
    'DATE_PART_MILLIS',
    'DATE_PART_STR',
    'DATE_RANGE_MILLIS',
    'DATE_RANGE_STR',
    'DATE_TRUNC_MILLIS',
    'DATE_TRUNC_STR',
    'DECODE',
    'DECODE_JSON',
    'DEGREES',
    'DENSE_RANK',
    'DURATION_TO_STR',
    // 'E',
    'ENCODED_SIZE',
    'ENCODE_JSON',
    'EXP',
    'FIRST_VALUE',
    'FLOOR',
    'GREATEST',
    'HAS_TOKEN',
    'IFINF',
    'IFMISSING',
    'IFMISSINGORNULL',
    'IFNAN',
    'IFNANORINF',
    'IFNULL',
    'INITCAP',
    'ISARRAY',
    'ISATOM',
    'ISBITSET',
    'ISBOOLEAN',
    'ISNUMBER',
    'ISOBJECT',
    'ISSTRING',
    'LAG',
    'LAST_VALUE',
    'LEAD',
    'LEAST',
    'LENGTH',
    'LN',
    'LOG',
    'LOWER',
    'LTRIM',
    'MAX',
    'MEAN',
    'MEDIAN',
    'META',
    'MILLIS',
    'MILLIS_TO_LOCAL',
    'MILLIS_TO_STR',
    'MILLIS_TO_TZ',
    'MILLIS_TO_UTC',
    'MILLIS_TO_ZONE_NAME',
    'MIN',
    'MISSINGIF',
    'NANIF',
    'NEGINFIF',
    'NOW_LOCAL',
    'NOW_MILLIS',
    'NOW_STR',
    'NOW_TZ',
    'NOW_UTC',
    'NTH_VALUE',
    'NTILE',
    'NULLIF',
    'NVL',
    'NVL2',
    'OBJECT_ADD',
    'OBJECT_CONCAT',
    'OBJECT_INNER_PAIRS',
    'OBJECT_INNER_VALUES',
    'OBJECT_LENGTH',
    'OBJECT_NAMES',
    'OBJECT_PAIRS',
    'OBJECT_PUT',
    'OBJECT_REMOVE',
    'OBJECT_RENAME',
    'OBJECT_REPLACE',
    'OBJECT_UNWRAP',
    'OBJECT_VALUES',
    'PAIRS',
    'PERCENT_RANK',
    'PI',
    'POLY_LENGTH',
    'POSINFIF',
    'POSITION',
    'POWER',
    'RADIANS',
    'RANDOM',
    'RANK',
    'RATIO_TO_REPORT',
    'REGEXP_CONTAINS',
    'REGEXP_LIKE',
    'REGEXP_MATCHES',
    'REGEXP_POSITION',
    'REGEXP_REPLACE',
    'REGEXP_SPLIT',
    'REGEX_CONTAINS',
    'REGEX_LIKE',
    'REGEX_MATCHES',
    'REGEX_POSITION',
    'REGEX_REPLACE',
    'REGEX_SPLIT',
    'REPEAT',
    'REPLACE',
    'REVERSE',
    'ROUND',
    'ROW_NUMBER',
    'RTRIM',
    'SEARCH',
    'SEARCH_META',
    'SEARCH_SCORE',
    'SIGN',
    'SIN',
    'SPLIT',
    'SQRT',
    'STDDEV',
    'STDDEV_POP',
    'STDDEV_SAMP',
    'STR_TO_DURATION',
    'STR_TO_MILLIS',
    'STR_TO_TZ',
    'STR_TO_UTC',
    'STR_TO_ZONE_NAME',
    'SUBSTR',
    'SUFFIXES',
    'SUM',
    'TAN',
    'TITLE',
    'TOARRAY',
    'TOATOM',
    'TOBOOLEAN',
    'TOKENS',
    'TOKENS',
    'TONUMBER',
    'TOOBJECT',
    'TOSTRING',
    'TRIM',
    'TRUNC',
    // 'TYPE', // disabled
    'UPPER',
    'UUID',
    'VARIANCE',
    'VARIANCE_POP',
    'VARIANCE_SAMP',
    'VAR_POP',
    'VAR_SAMP',
    'WEEKDAY_MILLIS',
    'WEEKDAY_STR',
    // type casting
    // not implemented in N1QL, but added here now for the sake of tests
    // https://docs.couchbase.com/server/current/analytics/3_query.html#Vs_SQL-92
    'CAST',
  ],
});