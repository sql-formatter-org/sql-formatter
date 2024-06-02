export const keywords: string[] = [
  // Keywords from DuckDB:
  // SELECT upper(keyword_name)
  // FROM duckdb_keywords()
  // WHERE keyword_category = 'reserved'
  // ORDER BY keyword_name
  'ALL',
  'ANALYSE',
  'ANALYZE',
  'AND',
  'ANY',
  'AS',
  'ASC',
  'ASYMMETRIC',
  'BOTH',
  'CASE',
  'CAST',
  'CHECK',
  'COLLATE',
  'COLUMN',
  'CONSTRAINT',
  'CREATE',
  'DEFAULT',
  'DEFERRABLE',
  'DESC',
  'DESCRIBE',
  'DISTINCT',
  'DO',
  'ELSE',
  'END',
  'EXCEPT',
  'FALSE',
  'FETCH',
  'FOR',
  'FOREIGN',
  'FROM',
  'GRANT',
  'GROUP',
  'HAVING',
  'IN',
  'INITIALLY',
  'INTERSECT',
  'INTO',
  'LATERAL',
  'LEADING',
  'LIMIT',
  'NOT',
  'NULL',
  'OFFSET',
  'ON',
  'ONLY',
  'OR',
  'ORDER',
  'PIVOT',
  'PIVOT_LONGER',
  'PIVOT_WIDER',
  'PLACING',
  'PRIMARY',
  'REFERENCES',
  'RETURNING',
  'SELECT',
  'SHOW',
  'SOME',
  'SUMMARIZE',
  'SYMMETRIC',
  'TABLE',
  'THEN',
  'TO',
  'TRAILING',
  'TRUE',
  'UNION',
  'UNIQUE',
  'UNPIVOT',
  'USING',
  'VARIADIC',
  'WHEN',
  'WHERE',
  'WINDOW',
  'WITH',
];

export const dataTypes: string[] = [
  // Types from DuckDB:
  // SELECT DISTINCT upper(type_name)
  // FROM duckdb_types()
  // ORDER BY type_name
  'ARRAY',
  'BIGINT',
  'BINARY',
  'BIT',
  'BITSTRING',
  'BLOB',
  'BOOL',
  'BOOLEAN',
  'BPCHAR',
  'BYTEA',
  'CHAR',
  'DATE',
  'DATETIME',
  'DEC',
  'DECIMAL',
  'DOUBLE',
  'ENUM',
  'FLOAT',
  'FLOAT4',
  'FLOAT8',
  'GUID',
  'HUGEINT',
  'INET',
  'INT',
  'INT1',
  'INT128',
  'INT16',
  'INT2',
  'INT32',
  'INT4',
  'INT64',
  'INT8',
  'INTEGER',
  'INTEGRAL',
  'INTERVAL',
  'JSON',
  'LIST',
  'LOGICAL',
  'LONG',
  'MAP',
  'NULL',
  'NUMERIC',
  'NVARCHAR',
  'OID',
  'REAL',
  'ROW',
  'SHORT',
  'SIGNED',
  'SMALLINT',
  'STRING',
  'STRUCT',
  'TEXT',
  'TIME',
  'TIMESTAMP_MS',
  'TIMESTAMP_NS',
  'TIMESTAMP_S',
  'TIMESTAMP_US',
  'TIMESTAMP',
  'TIMESTAMPTZ',
  'TIMETZ',
  'TINYINT',
  'UBIGINT',
  'UHUGEINT',
  'UINT128',
  'UINT16',
  'UINT32',
  'UINT64',
  'UINT8',
  'UINTEGER',
  'UNION',
  'USMALLINT',
  'UTINYINT',
  'UUID',
  'VARBINARY',
  'VARCHAR',
];
