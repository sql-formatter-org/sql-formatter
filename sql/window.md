# WINDOW clause

[SQL standard][] defines the following syntax for WINDOW clause:

    WINDOW { identifier AS "(" window_specification ")" } ["," ...]

    window_specification:
      [identifier]
      [PARTITION BY { column [COLLATE collation] } ["," ...]]
      [ORDER BY sort_specification_list]
      [frame_definition]

    frame_definition:
      frame_units {frame_start | frame_between} [frame_exclusion]

    frame_units:
      ROWS | RANGE

    frame_start:
      UNBOUNDED PRECEDING | CURRENT ROW | unsigned_value PRECEDING

    frame_between:
      BETWEEN frame_bound AND frame_bound

    frame_bound:
      frame_start | UNBOUNDED FOLLOWING | unsigned_value FOLLOWING

    frame_exclusion:
        EXCLUDE CURRENT ROW
      | EXCLUDE GROUP
      | EXCLUDE TIES
      | EXCLUDE NO OTHERS

No dialect supports `COLLATE` in `PARTITION BY`.
Other than that, the following dialects support everything else:

- [BigQuery][]
- [Hive][]
- [MySQL][]
- [Transact-SQL][]
- [N1QL][] <sup>1</sup>
- [PostgreSQL][] <sup>1</sup>
- [SQLite][] <sup>1</sup>

1.  These dialects support an extra `GROUPS` option in `frame_units`:

        frame_units:
          ROWS | RANGE | GROUPS

[Spark][] has a rudimentary WINDOW support:

    WINDOW identifier ["," WINDOW identifier ...]

[DB2][], [MariaDB][], [PL/SQL][], [Redshift][] don't support WINDOW clause.
Though they do support window functions.

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_7_11_window_clause
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/window-function-calls#def_window_spec
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=queries-subselect
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Select
[mariadb]: https://mariadb.com/kb/en/select/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/select.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/select-syntax.html#window-clause
[pl/sql]: https://docs.oracle.com/database/121/SQLRF/queries001.htm#SQLRF52327
[postgresql]: https://www.postgresql.org/docs/current/sql-select.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_SELECT_synopsis.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select.html
[sqlite]: https://www.sqlite.org/lang_select.html
[transact-sql]: https://docs.microsoft.com/en-US/sql/t-sql/queries/select-window-transact-sql?view=sql-server-ver16&viewFallbackFrom=sql-server-ver15
