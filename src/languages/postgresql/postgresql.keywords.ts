export const keywords: string[] = [
  // https://www.postgresql.org/docs/14/sql-keywords-appendix.html
  'ALL', // reserved
  'ANALYSE', // reserved
  'ANALYZE', // reserved
  'AND', // reserved
  'ANY', // reserved
  'AS', // reserved, requires AS
  'ASC', // reserved
  'ASYMMETRIC', // reserved
  'AUTHORIZATION', // reserved (can be function or type)
  'BETWEEN', // (cannot be function or type)
  'BINARY', // reserved (can be function or type)
  'BOTH', // reserved
  'CASE', // reserved
  'CAST', // reserved
  'CHECK', // reserved
  'COLLATE', // reserved
  'COLLATION', // reserved (can be function or type)
  'COLUMN', // reserved
  'COMMENT', // reserved
  'CONCURRENTLY', // reserved (can be function or type)
  'CONSTRAINT', // reserved
  'CREATE', // reserved, requires AS
  'CROSS', // reserved (can be function or type)
  'CURRENT_CATALOG', // reserved
  'CURRENT_DATE', // reserved
  'CURRENT_ROLE', // reserved
  'CURRENT_SCHEMA', // reserved (can be function or type)
  'CURRENT_TIME', // reserved
  'CURRENT_TIMESTAMP', // reserved
  'CURRENT_USER', // reserved
  'DAY', // requires AS
  'DEFAULT', // reserved
  'DEFERRABLE', // reserved
  'DESC', // reserved
  'DISTINCT', // reserved
  'DO', // reserved
  'ELSE', // reserved
  'END', // reserved
  'EXCEPT', // reserved, requires AS
  'EXISTS', // (cannot be function or type)
  'FALSE', // reserved
  'FETCH', // reserved, requires AS
  'FILTER', // requires AS
  'FOR', // reserved, requires AS
  'FOREIGN', // reserved
  'FREEZE', // reserved (can be function or type)
  'FROM', // reserved, requires AS
  'FULL', // reserved (can be function or type)
  'GRANT', // reserved, requires AS
  'GROUP', // reserved, requires AS
  'HAVING', // reserved, requires AS
  'HOUR', // requires AS
  'ILIKE', // reserved (can be function or type)
  'IN', // reserved
  'INITIALLY', // reserved
  'INNER', // reserved (can be function or type)
  'INOUT', // (cannot be function or type)
  'INTERSECT', // reserved, requires AS
  'INTO', // reserved, requires AS
  'IS', // reserved (can be function or type)
  'ISNULL', // reserved (can be function or type), requires AS
  'JOIN', // reserved (can be function or type)
  'LATERAL', // reserved
  'LEADING', // reserved
  'LEFT', // reserved (can be function or type)
  'LIKE', // reserved (can be function or type)
  'LIMIT', // reserved, requires AS
  'LOCALTIME', // reserved
  'LOCALTIMESTAMP', // reserved
  'MINUTE', // requires AS
  'MONTH', // requires AS
  'NATURAL', // reserved (can be function or type)
  'NOT', // reserved
  'NOTNULL', // reserved (can be function or type), requires AS
  'NULL', // reserved
  'NULLIF', // (cannot be function or type)
  'OFFSET', // reserved, requires AS
  'ON', // reserved, requires AS
  'ONLY', // reserved
  'OR', // reserved
  'ORDER', // reserved, requires AS
  'OUT', // (cannot be function or type)
  'OUTER', // reserved (can be function or type)
  'OVER', // requires AS
  'OVERLAPS', // reserved (can be function or type), requires AS
  'PLACING', // reserved
  'PRIMARY', // reserved
  'REFERENCES', // reserved
  'RETURNING', // reserved, requires AS
  'RIGHT', // reserved (can be function or type)
  'ROW', // (cannot be function or type)
  'SECOND', // requires AS
  'SELECT', // reserved
  'SESSION_USER', // reserved
  'SIMILAR', // reserved (can be function or type)
  'SOME', // reserved
  'SYMMETRIC', // reserved
  'TABLE', // reserved
  'TABLESAMPLE', // reserved (can be function or type)
  'THEN', // reserved
  'TO', // reserved, requires AS
  'TRAILING', // reserved
  'TRUE', // reserved
  'UNION', // reserved, requires AS
  'UNIQUE', // reserved
  'USER', // reserved
  'USING', // reserved
  'VALUES', // (cannot be function or type)
  'VARIADIC', // reserved
  'VERBOSE', // reserved (can be function or type)
  'WHEN', // reserved
  'WHERE', // reserved, requires AS
  'WINDOW', // reserved, requires AS
  'WITH', // reserved, requires AS
  'WITHIN', // requires AS
  'WITHOUT', // requires AS
  'YEAR', // requires AS
];

export const dataTypes: string[] = [
  // https://www.postgresql.org/docs/current/datatype.html
  'ARRAY', // reserved, requires AS
  'BIGINT', // (cannot be function or type)
  'BIT', // (cannot be function or type)
  'BIT VARYING',
  'BOOL', // (cannot be function or type)
  'BOOLEAN', // (cannot be function or type)
  'CHAR', // (cannot be function or type), requires AS
  'CHARACTER', // (cannot be function or type), requires AS
  'CHARACTER VARYING',
  'DECIMAL', // (cannot be function or type)
  'DEC', // (cannot be function or type)
  'DOUBLE',
  'ENUM',
  'FLOAT', // (cannot be function or type)
  'INT', // (cannot be function or type)
  'INTEGER', // (cannot be function or type)
  'INTERVAL', // (cannot be function or type)
  'NCHAR', // (cannot be function or type)
  'NUMERIC', // (cannot be function or type)
  'JSON',
  'JSONB',
  'PRECISION', // (cannot be function or type), requires AS
  'REAL', // (cannot be function or type)
  'SMALLINT', // (cannot be function or type)
  'TEXT',
  'TIME', // (cannot be function or type)
  'TIMESTAMP', // (cannot be function or type)
  'TIMESTAMPTZ', // (cannot be function or type)
  'UUID',
  'VARCHAR', // (cannot be function or type)
  'XML',
  'ZONE',
];
