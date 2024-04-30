COPY (
    SELECT DISTINCT upper(function_name) AS function_name
    FROM duckdb_functions()
    WHERE function_name SIMILAR TO '^[a-z].*'
    ORDER BY function_name
) TO 'duckdb_functions.txt' WITH (sep ',', header FALSE);


COPY (
    SELECT upper(keyword_name)
    FROM duckdb_keywords()
    ORDER BY keyword_name
) TO 'duckdb_keywords.txt' WITH (sep ',', header FALSE);


COPY (
    SELECT DISTINCT upper(logical_type)
    FROM duckdb_types()
    ORDER BY logical_type
) TO 'duckdb_types.txt' WITH (sep ',', header FALSE);