# ALTER TABLE statement

[SQL standard][] specifies the following ALTER TABLE syntax:

    ALTER TABLE table_name alter_table_action

    alter_table_action:
        ADD COLUMN column_definition
      | ALTER [COLUMN] column_name alter_column_action
      | DROP [COLUMN] column_name {CASCADE | RESTRICT}
      | ADD [CONSTRAINT constraint_name] table_constraint [constraint_characteristics]
      | DROP CONSTRAINT constraint_name {CASCADE | RESTRICT}

    alter_column_action:
        SET DEFAULT expr
      | DROP DEFAULT
      | ADD SCOPE table_name
      | DROP SCOPE {CASCADE | RESTRICT}
      | {RESTART WITH number | SET sequence_generator_option}...

    sequence_generator_option:
        INCREMENT BY number
      | MAXVALUE number
      | NO MAXVALUE
      | MINVALUE number
      | NO MINVALUE
      | CYCLE
      | NO CYCLE

Things are getting pretty crazy in the actual implementations:

[BigQuery][]:

    ALTER TABLE [IF EXISTS] table_name alter_table_action

    alter_table_action:
        SET OPTIONS options_list
      | ADD COLUMN [IF NOT EXISTS] column_definition ["," ...]
      | RENAME TO table_name
      | DROP COLUMN [IF EXISTS] column_name ["," ...]
      | SET DEFAULT COLLATE collation
      | ALTER COLUMN [IF EXISTS] column_name alter_column_action

    alter_column_action:
        SET OPTIONS options_list
      | DROP NOT NULL
      | SET DATA TYPE column_schema

    options_list:
      "(" name "=" value ["," ...] ")"

[DB2][]:

    ALTER TABLE table_name alter_table_action

    alter_table_action:
        ADD [COLUMN] column_definition [...]
      | ADD [CONSTRAINT constraint_name] {UNIQUE | PRIMARY KEY} "(" column_names_list ")" [...]
      | ADD [CONSTRAINT constraint_name] FOREIGN KEY "(" column_names_list ")" references_clause [...]
      | ADD [CONSTRAINT constraint_name] CHECK "(" check_condition ")" constraint_attributes [...]
      | ADD DISTRIBUTE BY [HASH] "(" column_names_list ")" [...]
      | ADD RESTRICT ON DROP [...]
      | ADD [[MATERIALIZED] QUERY] "(" query ")" materialized_query_definition [...]
      | ALTER {FOREIGN KEY | CHECK} constraint_name constraint_alteration [...]
      | ALTER [COLUMN] column_name alter_table_action [...]
      | RENAME [COLUMN] column_name TO column_name [...]
      | DROP PRIMARY KEY [...]
      | DROP {FOREIGN KEY | UNIQUE | CHECK | CONSTRAINT} constraint_name [...]
      | DROP [COLUMN] column_name [CASCADE | RESTRICT] [...]
      | DROP DISTRIBUTION [...]
      | DROP [MATERIALIZED] QUERY [...]
      | DATA CAPTURE {NONE | CHANGES [INCLUDE LONGVAR COLUMNS]} [...]
      | ACTIVATE NOT LOGGED INITIALLY [WITH EMPTY TABLE] [...]
      | PCTFREE number [...]
      | LOCKSIZE {ROW | BLOCKINSERT | TABLE} [...]
      | APPEND {ON | OFF} [...]
      | [NOT] VOLATILE [CARDINALITY] [...]
      | COMPRESS {YES | NO} [...]
      | {ACTIVATE | DEACTIVATE} VALUE COMPRESSION [...]
      | LOG INDEX BUILD {NULL | OFF | ON} [...]
      | ADD PARTITION [partition_name] boundary_spec [IN tablespace_name]
      | ATTACH PARTITION [partition_name] boundary_spec FROM table_name
      | DETACH PARTITION partition_name INTO table_name
      | ADD SECURITY POLICY policy_name
      | DROP SECURITY POLICY

    alter_table_action:
        SET DATA TYPE altered_data_type
      | SET generated-column-alteration
      | SET EXPRESSION AS "(" generation_expression ")"
      | SET INLINE LENGTH number
      | SET NOT NULL
      | identity_alteration...
      | SET GENERATED {ALWAYS | BY DEFAULT} [identity_alteration...]
      | DROP {IDENTITY | EXPRESSION | DEFAULT | NOT NULL}
      | ADD SCOPE table_name
      | COMPRESS {SYSTEM DEFAULT | OFF}
      | SECURED WITH security_label_name
      | DROP COLUMN SECURITY

    identity_alteration:
        SET INCREMENT BY number
      | SET {MINVALUE number | NO MINVALUE}
      | SET {MAXVALUE number | NO MAXVALUE}
      | SET {CACHE number | NO CACHE}
      | SET [NO] CYCLE
      | SET [NO] ORDER
      | RESTART [WITH number]

[Hive][]:

    ALTER TABLE table_name alter_table_action

    alter_table_action:
        RENAME TO table_name
      | SET TBLPROPERTIES options_list
      | [PARTITION partition_spec] SET SERDE serde_class_name [WITH SERDEPROPERTIES options_list]
      | [PARTITION partition_spec] SET SERDEPROPERTIES options_list
      | [PARTITION partition_spec] UNSET SERDEPROPERTIES "(" name ["," ...] ")"
      | CLUSTERED BY columns_list [SORTED BY columns_list] INTO num_buckets BUCKETS
      | SKEWED BY columns_list ON "(" values_list ["," ...] ")" [STORED AS DIRECTORIES]
      | NOT SKEWED
      | NOT STORED AS DIRECTORIES
      | SET SKEWED LOCATION options_list
      | ADD CONSTRAINT constraint_name PRIMARY KEY columns_list DISABLE NOVALIDATE
      | ADD CONSTRAINT constraint_name FOREIGN KEY columns_list REFERENCES table_name columns_list DISABLE NOVALIDATE RELY
      | ADD CONSTRAINT constraint_name UNIQUE columns_list DISABLE NOVALIDATE
      | CHANGE COLUMN column_name column_name data_type CONSTRAINT constraint_name NOT NULL ENABLE
      | CHANGE COLUMN column_name column_name data_type CONSTRAINT constraint_name DEFAULT default_value ENABLE
      | CHANGE COLUMN column_name column_name data_type CONSTRAINT constraint_name CHECK check_expression ENABLE
      | DROP CONSTRAINT constraint_name
      | ADD [IF NOT EXISTS] {PARTITION partition_spec [LOCATION location]} ["," ...]
      | PARTITION partition_spec RENAME TO PARTITION partition_spec
      | EXCHANGE PARTITION "(" partition_spec ["," ...] ")" WITH TABLE table_name
      | RECOVER PARTITIONS
      | DROP [IF EXISTS] PARTITION partition_spec ["," ...] [IGNORE PROTECTION] [PURGE]
      | {ARCHIVE | UNARCHIVE} PARTITION partition_spec
      | [PARTITION partition_spec] SET FILEFORMAT file_format
      | [PARTITION partition_spec] SET LOCATION location
      | TOUCH [PARTITION partition_spec]
      | [PARTITION partition_spec] {ENABLE | DISABLE} NO_DROP [CASCADE]
      | [PARTITION partition_spec] {ENABLE | DISABLE} OFFLINE
      | [PARTITION partition_spec] COMPACT compaction_type [AND WAIT] [WITH OVERWRITE TBLPROPERTIES options_list]
      | [PARTITION partition_spec] CONCATENATE
      | [PARTITION partition_spec] UPDATE COLUMNS
      | [PARTITION partition_spec] CHANGE [COLUMN] col_name col_name column_type
            [COMMENT col_comment] [FIRST | AFTER column_name] [CASCADE | RESTRICT]
      | [PARTITION partition_spec] {ADD | REPLACE} COLUMNS
            "(" col_name data_type [COMMENT col_comment] ["," ...] ")" [CASCADE | RESTRICT]

    partition_spec:
      options_list

    columns_list:
      "(" col_name ["," ...] ")"

    values_list:
      "(" expr ["," ...] ")"

    options_list:
      "(" name "=" value ["," ...] ")"

[MariaDB][]:

    ALTER [ONLINE] [IGNORE] TABLE [IF EXISTS] tbl_name
      [WAIT n | NOWAIT]
      alter_table_action ["," ...]

    alter_table_action:
        table_option ...
      | ADD [COLUMN] [IF NOT EXISTS] col_name column_definition
            [FIRST | AFTER col_name ]
      | ADD [COLUMN] [IF NOT EXISTS] (col_name column_definition,...)
      | ADD {INDEX|KEY} [IF NOT EXISTS] [index_name]
            [index_type] (index_col_name,...) [index_option] ...
      | ADD [CONSTRAINT [symbol]] PRIMARY KEY
            [index_type] (index_col_name,...) [index_option] ...
      | ADD [CONSTRAINT [symbol]]
            UNIQUE [INDEX|KEY] [index_name]
            [index_type] (index_col_name,...) [index_option] ...
      | ADD FULLTEXT [INDEX|KEY] [index_name]
            (index_col_name,...) [index_option] ...
      | ADD SPATIAL [INDEX|KEY] [index_name]
            (index_col_name,...) [index_option] ...
      | ADD [CONSTRAINT [symbol]]
            FOREIGN KEY [IF NOT EXISTS] [index_name] (index_col_name,...)
            reference_definition
      | ADD PERIOD FOR SYSTEM_TIME (start_column_name, end_column_name)
      | ALTER [COLUMN] col_name SET DEFAULT literal | (expression)
      | ALTER [COLUMN] col_name DROP DEFAULT
      | ALTER {INDEX|KEY} index_name [NOT] INVISIBLE
      | CHANGE [COLUMN] [IF EXISTS] old_col_name new_col_name column_definition
            [FIRST|AFTER col_name]
      | MODIFY [COLUMN] [IF EXISTS] col_name column_definition
            [FIRST | AFTER col_name]
      | DROP [COLUMN] [IF EXISTS] col_name [RESTRICT|CASCADE]
      | DROP PRIMARY KEY
      | DROP {INDEX|KEY} [IF EXISTS] index_name
      | DROP FOREIGN KEY [IF EXISTS] fk_symbol
      | DROP CONSTRAINT [IF EXISTS] constraint_name
      | DISABLE KEYS
      | ENABLE KEYS
      | RENAME [TO] new_tbl_name
      | ORDER BY col_name [, col_name] ...
      | RENAME COLUMN old_col_name TO new_col_name
      | RENAME {INDEX|KEY} old_index_name TO new_index_name
      | CONVERT TO CHARACTER SET charset_name [COLLATE collation_name]
      | [DEFAULT] CHARACTER SET [=] charset_name
      | [DEFAULT] COLLATE [=] collation_name
      | DISCARD TABLESPACE
      | IMPORT TABLESPACE
      | ALGORITHM [=] {DEFAULT|INPLACE|COPY|NOCOPY|INSTANT}
      | LOCK [=] {DEFAULT|NONE|SHARED|EXCLUSIVE}
      | FORCE
      | partition_options
      | ADD PARTITION [IF NOT EXISTS] (partition_definition)
      | DROP PARTITION [IF EXISTS] partition_names
      | COALESCE PARTITION number
      | REORGANIZE PARTITION [partition_names INTO (partition_definitions)]
      | ANALYZE PARTITION partition_names
      | CHECK PARTITION partition_names
      | OPTIMIZE PARTITION partition_names
      | REBUILD PARTITION partition_names
      | REPAIR PARTITION partition_names
      | EXCHANGE PARTITION partition_name WITH TABLE tbl_name
      | REMOVE PARTITIONING
      | ADD SYSTEM VERSIONING
      | DROP SYSTEM VERSIONING

    table_option:
        [STORAGE] ENGINE [=] engine_name
      | AUTO_INCREMENT [=] value
      | AVG_ROW_LENGTH [=] value
      | [DEFAULT] CHARACTER SET [=] charset_name
      | CHECKSUM [=] {0 | 1}
      | [DEFAULT] COLLATE [=] collation_name
      | COMMENT [=] 'string'
      | CONNECTION [=] 'connect_string'
      | DATA DIRECTORY [=] 'absolute path to directory'
      | DELAY_KEY_WRITE [=] {0 | 1}
      | ENCRYPTED [=] {YES | NO}
      | ENCRYPTION_KEY_ID [=] value
      | IETF_QUOTES [=] {YES | NO}
      | INDEX DIRECTORY [=] 'absolute path to directory'
      | INSERT_METHOD [=] { NO | FIRST | LAST }
      | KEY_BLOCK_SIZE [=] value
      | MAX_ROWS [=] value
      | MIN_ROWS [=] value
      | PACK_KEYS [=] {0 | 1 | DEFAULT}
      | PAGE_CHECKSUM [=] {0 | 1}
      | PAGE_COMPRESSED [=] {0 | 1}
      | PAGE_COMPRESSION_LEVEL [=] {0 .. 9}
      | PASSWORD [=] 'string'
      | ROW_FORMAT [=] {DEFAULT|DYNAMIC|FIXED|COMPRESSED|REDUNDANT|COMPACT|PAGE}
      | SEQUENCE [=] {0|1}
      | STATS_AUTO_RECALC [=] {DEFAULT|0|1}
      | STATS_PERSISTENT [=] {DEFAULT|0|1}
      | STATS_SAMPLE_PAGES [=] {DEFAULT|value}
      | TABLESPACE tablespace_name
      | TRANSACTIONAL [=]  {0 | 1}
      | UNION [=] (tbl_name[,tbl_name]...)
      | WITH SYSTEM VERSIONING

[MySQL][]:

    ALTER TABLE table_name
      [alter_table_action ["," ...]]
      [partition_option ...]

    alter_table_action:
        table_options
      | ADD [COLUMN] col_name column_definition
            [FIRST | AFTER col_name]
      | ADD [COLUMN] (col_name column_definition,...)
      | ADD {INDEX | KEY} [index_name]
            [index_type] (key_part,...) [index_option] ...
      | ADD {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name]
            (key_part,...) [index_option] ...
      | ADD [CONSTRAINT [symbol]] PRIMARY KEY
            [index_type] (key_part,...)
            [index_option] ...
      | ADD [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
            [index_name] [index_type] (key_part,...)
            [index_option] ...
      | ADD [CONSTRAINT [symbol]] FOREIGN KEY
            [index_name] (col_name,...)
            reference_definition
      | ADD [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
      | DROP {CHECK | CONSTRAINT} symbol
      | ALTER {CHECK | CONSTRAINT} symbol [NOT] ENFORCED
      | ALGORITHM [=] {DEFAULT | INSTANT | INPLACE | COPY}
      | ALTER [COLUMN] col_name {
            SET DEFAULT {literal | (expr)}
          | SET {VISIBLE | INVISIBLE}
          | DROP DEFAULT
        }
      | ALTER INDEX index_name {VISIBLE | INVISIBLE}
      | CHANGE [COLUMN] old_col_name new_col_name column_definition
            [FIRST | AFTER col_name]
      | [DEFAULT] CHARACTER SET [=] charset_name [COLLATE [=] collation_name]
      | CONVERT TO CHARACTER SET charset_name [COLLATE collation_name]
      | {DISABLE | ENABLE} KEYS
      | {DISCARD | IMPORT} TABLESPACE
      | DROP [COLUMN] col_name
      | DROP {INDEX | KEY} index_name
      | DROP PRIMARY KEY
      | DROP FOREIGN KEY fk_symbol
      | FORCE
      | LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
      | MODIFY [COLUMN] col_name column_definition
            [FIRST | AFTER col_name]
      | ORDER BY col_name [, col_name] ...
      | RENAME COLUMN old_col_name TO new_col_name
      | RENAME {INDEX | KEY} old_index_name TO new_index_name
      | RENAME [TO | AS] new_tbl_name
      | {WITHOUT | WITH} VALIDATION

    partition_option:
        ADD PARTITION (partition_definition)
      | DROP PARTITION partition_names
      | DISCARD PARTITION {partition_names | ALL} TABLESPACE
      | IMPORT PARTITION {partition_names | ALL} TABLESPACE
      | TRUNCATE PARTITION {partition_names | ALL}
      | COALESCE PARTITION number
      | REORGANIZE PARTITION partition_names INTO (partition_definitions)
      | EXCHANGE PARTITION partition_name WITH TABLE tbl_name [{WITH | WITHOUT} VALIDATION]
      | ANALYZE PARTITION {partition_names | ALL}
      | CHECK PARTITION {partition_names | ALL}
      | OPTIMIZE PARTITION {partition_names | ALL}
      | REBUILD PARTITION {partition_names | ALL}
      | REPAIR PARTITION {partition_names | ALL}
      | REMOVE PARTITIONING

    table_option:
        AUTOEXTEND_SIZE [=] value
      | AUTO_INCREMENT [=] value
      | AVG_ROW_LENGTH [=] value
      | [DEFAULT] CHARACTER SET [=] charset_name
      | CHECKSUM [=] {0 | 1}
      | [DEFAULT] COLLATE [=] collation_name
      | COMMENT [=] 'string'
      | COMPRESSION [=] {'ZLIB' | 'LZ4' | 'NONE'}
      | CONNECTION [=] 'connect_string'
      | {DATA | INDEX} DIRECTORY [=] 'absolute path to directory'
      | DELAY_KEY_WRITE [=] {0 | 1}
      | ENCRYPTION [=] {'Y' | 'N'}
      | ENGINE [=] engine_name
      | ENGINE_ATTRIBUTE [=] 'string'
      | INSERT_METHOD [=] { NO | FIRST | LAST }
      | KEY_BLOCK_SIZE [=] value
      | MAX_ROWS [=] value
      | MIN_ROWS [=] value
      | PACK_KEYS [=] {0 | 1 | DEFAULT}
      | PASSWORD [=] 'string'
      | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
      | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
      | STATS_AUTO_RECALC [=] {DEFAULT | 0 | 1}
      | STATS_PERSISTENT [=] {DEFAULT | 0 | 1}
      | STATS_SAMPLE_PAGES [=] value
      | TABLESPACE tablespace_name [STORAGE {DISK | MEMORY}]
      | UNION [=] (tbl_name[,tbl_name]...)

[N1QL][]:

_No support for ALTER TABLE._

[PL/SQL][]:

    ALTER TABLE table_name [[NO] MEMOPTIMIZE FOR READ] alter_table_action [enable_disable_clause ...]

    alter_table_action:
        alter_table_properties
      | column_clauses
      | constraint_clauses
      | alter_table_partitioning [{DEFFERRED | IMMEDIATE} INVALIDATION]  # ...todo
      | alter_external_table
      | move_table_clause
      | modify_to_partitioned
      | modify_opaque_type

    alter_table_properties:
        alter_property... [alter_iot_clauses] [alter_xmlschema_clause]
      | RENAME TO table_name [alter_iot_clauses] [alter_xmlschema_clause]
      | SHRINK SPACE [COMPACT] [CASCADE]
      | READ ONLY
      | READ WRITE
      | REKEY encryption_spec
      | DEFAULT COLLATION collation_name
      | [NO] ROW ARCHIVAL
      | ADD attribute_clustering_clause
      | MODIFY CLUSTERING [clustering_when] [zonemap_clause]
      | DROP CLUSTERING

    alter_property:
        {PCTFREE | PCTUSED | INITRANS} integer
      | storage_clause
      | LOGGING
      | NOLOGGING
      | FILESYSTEM_LIKE_LOGGING
      | COMPRESS
      | ROW STORE COMPRESS [BASIC | ADVANCED]
      | COLUMN STORE COMPRESS [FOR {QUERY | ARCHIVE} [LOW | HIGH]] [[NO] ROW LEVEL LOCKING]
      | NOCOMPRESS
      | [INMEMORY [inmemory_attributes] | NO INMEMORY] [inmemory_column_clause]
      | ILM ilm_clause
      | ADD {SUPPLEMENTAL LOG {supplemental_log_grp_clause | supplemental_id_key_clause}} ["," ...]
      | DROP {SUPPLEMENTAL LOG {supplemental_id_key_clause | GROUP log_group}} ["," ...]
      | ALLOCATE EXTENT "(" {SIZE size_clause | DATAFILE filename | INSTANCE integer}... ")"
      | DEALLOCATE UNUSED [KEEP size_clause]
      | CACHE
      | NOCACHE
      | RESULT CACHE "(" MODE {DEFAULT | FORCE} ")"
      | UPGRADE [[NOT] INCLUDING DATA] [column_properties]
      | {MINIMIZE | NOMINIMIZE} RECORDS_PER_BLOCK
      | NOPARALLEL
      | PARALLEL [integer]
      | {ENABLE | DISABLE} ROW MOVEMENT
      | FLASHBACK ARCHIVE [flashback_archive]
      | NO FLASHBACK ARCHIVE

    ilm_clause:
        ADD POLICY ilm_policy_clause
      | {DELETE | ENABLE | DISABLE} POLICY ilm_policy_name
      | DELETE_ALL
      | ENABLE_ALL
      | DISABLE_ALL

    column_clauses:
        add_modify_drop_column
      | ADD "(" PERIOD FOR column "(" start_col "," end_col ")" ")"
      | RENAME COLUMN column TO column
      | MODIFY NESTED TABLE collection_item RETURN AS {LOCATOR | VALUE}
      | MODIFY LOB "(" LOB_item ")" "(" modify_LOB_parameters ")"
      | MODIFY VARRAY varray_item "(" modify_LOB_parameters ")"

    constraint_clauses:
        ADD {out_of_line_constraint... | out_of_line_REF_constraint}
      | ADD [CONSTRAINT constraint_name] constraint_def [constraint_state]
      | ADD SCOPE FOR "(" {ref_col | ref_attr} ")" IS table_name
      | ADD REF "(" {ref_col | ref_attr} ")" WITH ROWID
      | ADD [CONSTRAINT constraint_name] FOREIGN KEY "(" {ref_col | ref_attr} ["," ...] ")"
          references_clause [constraint_state]
      | MODIFY constraint_ref constraint_state [CASCADE]
      | RENAME CONSTRAINT constraint_name TO constraint_name
      | DROP constraint_ref [CASCADE] [{KEEP|DROP} INDEX] [ONLINE]

    alter_table_partitioning:
        MODIFY DEFAULT ATTRIBUTES
          [FOR partition_extended_name]
          [deferred_segment_creation]
          [read_only_clause]
          [indexing_clause]
          [segment_attributes_clause]
          [table_compression]
          [inmemory_clause]
          [PCTTHRESHOLD integer]
          [prefix_compression]
          [alter_overflow_clause]
          [{LOB "(" LOB_item ")" | VARRAY varray} "(" LOB_parameters ")"]...
      | SET PARTITIONING {AUTOMATIC | MANUAL}
      | SET STORE IN "(" tablespace ["," ...] ")"
      | SET INTERVAL ( [expr] )
      | SET STORE IN ( tablespace [, tablespace]... )
      | SET SUBPARTITION TEMPLATE
        { ( range_subpartition_desc [, range_subpartition_desc]... )
        | ( list_subpartition_desc [, list_subpartition_desc]... )
        | ( individual_hash_subparts [, individual_hash_subparts]... )
        | ()
        | hash_subpartition_quantity}
      | modify_range_partition
      | modify_hash_partition
      | modify_list_partition
      | MODIFY subpartition_extended_name
        { allocate_extent_clause
        | deallocate_unused_cluse
        | shrink_clause
        | { { LOB LOB_item | VARRAY varray } (modify_LOB_parameters) }...
        | [ REBUILD ] UNUSABLE LOCAL INDEXES
        | { ADD | DROP } VALUES ( list_values )
        | read_only_clause
        | indexing_clause}
      | MOVE partition_extended_name
        [ MAPPING TABLE ]
        [ table_partition_description ]
        [ filter_condition]
        [ update_index_clauses ]
        [ parallel_clause ]
        [ allow_disallow_clustering ]
        [ ONLINE ]
      | MOVE subpartition_extended_name [ indexing_clause ]
        [ partitioning_storage_clause ]
        [ update_index_clauses ]
        [ filter_condition ]
        [ parallel_clause ]
        [ allow_disallow_clustering ]
        [ ONLINE ]
      | ADD {
        PARTITION [ partition ] add_range_partition_clause
          [, PARTITION [ partition ] add_range_partition_clause ]...
        | PARTITION [ partition ] add_list_partition_clause
          [, PARTITION [ partition ] add_list_partition_clause ]...
        | PARTITION [ partition ] add_system_partition_clause
          [, PARTITION [ partition ] add_system_partition_clause ]...
          [ BEFORE { partition_name | partition_number } ]
        | PARTITION [ partition ] add_hash_partition_clause
        } [ dependent_tables_clause ]
      | COALESCE PARTITION [ update_index_clauses ] [ parallel_clause ] [ allow_disallow_clustering ]
      | DROP partition_extended_names [ update_index_clauses [ parallel_clause ] ]
      | DROP subpartition_extended_names [ update_index_clauses [ parallel_clause ] ]
      | RENAME {partition_extended_name | subpartition_extended_name} TO new_name
      | TRUNCATE { partition_extended_names | subpartition_extended_names }
        [ { DROP [ ALL ] | REUSE } STORAGE ]
        [ update_index_clauses [ parallel_clause ] ] [ CASCADE ]
      | SPLIT partition_extended_name
        { AT (literal [, literal]... )
          [ INTO ( range_partition_desc, range_partition_desc ) ]
        | VALUES ( list_values )
          [ INTO ( list_partition_desc, list_partition_desc ) ]
        | INTO ( { range_partition_desc [, range_partition_desc ]...
                | list_partition_desc [, list_partition_desc ]... }
              , partition_spec )
        } [ split_nested_table_part ]
          [ filter_condition ]
          [ dependent_tables_clause ]
          [ update_index_clauses ]
          [ parallel_clause ]
          [ allow_disallow_clustering ]
          [ ONLINE ]
      | SPLIT subpartition_extended_name
        { AT ( literal ["," ...] )
          [ INTO ( range_subpartition_desc, range_subpartition_desc ) ]
        | VALUES ( list_values )
          [ INTO ( list_subpartition_desc, list_subpartition_desc ) ]
        | INTO ( { range_subpartition_desc [, range_subpartition_desc ]...
                | list_subpartition_desc [, list_subpartition_desc ]... }
              , subpartition_spec )
        } [ filter_condition ]
          [ dependent_tables_clause ]
          [ update_index_clauses ]
          [ parallel_clause ]
          [ allow_disallow_clustering ]
          [ ONLINE ]
      | MERGE PARTITIONS partition_or_key_value ["," ...]
        | TO partition_or_key_value }
        [ INTO partition_spec ]
        [ filter_condition ]
        [ dependent_tables_clause ]
        [ update_index_clauses ]
        [ parallel_clause ]
        [ allow_disallow_clustering ]
      | MERGE SUBPARTITIONS subpartition_or_key_value ["," ...]
        | TO subpartition_or_key_value }
        [ INTO {range_subpartition_desc | list_subpartition_desc}]
        [ filter_condition ]
        [ dependent_tables_clause ]
        [ update_index_clauses ]
        [ parallel_clause ]
        [ allow_disallow_clustering ]
      | EXCHANGE {partition_extended_name | subpartition_extended_name}
        WITH TABLE [ schema. ] table
        [ { INCLUDING | EXCLUDING } INDEXES ]
        [ { WITH | WITHOUT } VALIDATION ]
        [ exceptions_clause ]
        [ update_index_clauses [ parallel_clause ] ]
        [ CASCADE ]

    alter_external_table:
        add_modify_drop_column
      | {PARALLEL [integer] | NOPARALLEL}
      | [DEFAULT DIRECTORY directory]
        [ACCESS PARAMETERS {"(" opaque_format_spec ")" | USING CLOB subquery}]
        [LOCATION "(" {[directory ":"] location_specifier} ["," ...] ")"]
      | REJECT LIMIT {integer | UNLIMITED}
      | PROJECT COLUMN {ALL | REFERENCED}

    add_modify_drop_column:
        ADD "(" column_definition ["," ...] ")" [column_properties] ["(" out_of_line_part_storage ["," ...] ")"]
      | MODIFY "(" {modify_col_properties | modify_virtcol_properties | modify_col_visibility} ["," ...] ")"
      | MODIFY column [NOT] SUBSTITUTABLE AT ALL LEVELS [FORCE]
      | SET UNUSED {COLUMN column | columns_list} [{CASCADE CONSTRAINTS | INVALIDATE}...] [ONLINE]
      | DROP {COLUMN column | columns_list} [{CASCADE CONSTRAINTS | INVALIDATE}...] [CHECKPOINT number]
      | DROP {UNUSED COLUMNS | COLUMNS CONTINUE} [CHECKPOINT number]

    move_table_clause:
      MOVE [filter_condition] [ONLINE]
        [segment_attributes_clause] [table_compression] [index_org_table_clause]
        [{LOB_storage_clause | varray_col_properties}...]
        [parallel_clause]
        [allow_disallow_clustering]
        [UPDATE INDEXES ["(" {index {segment_attributes_clause | update_index_partition}} ["," ...] ")"]]

    modify_to_partitioned:
      MODIFY table_partitioning_clauses [filter_condition] [ONLINE]
        [UPDATE INDEXES ["(" {index {partitioned_index | GLOBAL}} ["," ...] ")"]]

    modify_opaque_type:
      MODIFY OPAQUE TYPE anydata_column STORE "(" type_name ["," ...] ")" UNPACKED

    constraint_def:
        UNIQUE columns_list
      | PRIMARY KEY columns_list
      | FOREIGN KEY columns_list references_clause
      | CHECK "(" condition ")"

    modify_col_properties:
      column [datatype]
        [COLLATE collation]
        [DEFAULT [ON NULL] expr | identity_clause | DROP IDENTITY]
        [{ ENCRYPT encryption_spec } | DECRYPT]
        [inline_constraint ...]
        [LOB_storage_clause]
        [alter_XMLSchema_clause]

    modify_virtcol_properties:
      column [datatype]
        [COLLATE collumn_collation_name]
        [GENERATED ALWAYS] AS "(" column_expression ")" [VIRTUAL]
        evaluation_edition_clause [unusable_editions_clause]

    modify_col_visibility:
      column {VISIBLE | INVISIBLE}

    enable_disable_clause:
        {ENABLE | DISABLE} {TABLE LOCK | ALL TRIGGERS | CONTAINER MAP | CONTAINERS DEFAULT}
      | {ENABLE | DISABLE} [VALIDATE | NOVALIDATE] constraint_ref
          [using_index_clause] [exceptions_clause] [CASCADE] [{KEEP | DROP} INDEX]

    constraint_ref:
        CONSTRAINT constraint_name
      | PRIMARY KEY
      | UNIQUE columns_list

    columns_list:
      "(" col_name ["," ...] ")"

[PostgreSQL][]:

    ALTER TABLE [IF EXISTS] [ONLY] name ["*"]
      alter_table_action ["," ...]

    ALTER TABLE ALL IN TABLESPACE name [OWNED BY role_name ["," ...]]
      SET TABLESPACE new_tablespace [NOWAIT]

    alter_table_action:
        RENAME [ COLUMN ] column_name TO new_column_name
      | RENAME CONSTRAINT constraint_name TO new_constraint_name
      | RENAME TO new_name
      | SET SCHEMA new_schema
      | ATTACH PARTITION partition_name { FOR VALUES partition_bound_spec | DEFAULT }
      | DETACH PARTITION partition_name [ CONCURRENTLY | FINALIZE ]
      | ADD [ COLUMN ] [ IF NOT EXISTS ] column_name data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
      | DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
      | ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]
      | ALTER [ COLUMN ] column_name SET DEFAULT expression
      | ALTER [ COLUMN ] column_name DROP DEFAULT
      | ALTER [ COLUMN ] column_name { SET | DROP } NOT NULL
      | ALTER [ COLUMN ] column_name DROP EXPRESSION [ IF EXISTS ]
      | ALTER [ COLUMN ] column_name ADD GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY [ ( sequence_options ) ]
      | ALTER [ COLUMN ] column_name
          { SET GENERATED { ALWAYS | BY DEFAULT }
          | SET sequence_option
          | RESTART [ [ WITH ] restart ] } [...]
      | ALTER [ COLUMN ] column_name DROP IDENTITY [ IF EXISTS ]
      | ALTER [ COLUMN ] column_name SET STATISTICS integer
      | ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
      | ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
      | ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN }
      | ALTER [ COLUMN ] column_name SET COMPRESSION compression_method
      | ADD table_constraint [ NOT VALID ]
      | ADD table_constraint_using_index
      | ALTER CONSTRAINT constraint_name [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]
      | VALIDATE CONSTRAINT constraint_name
      | DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
      | DISABLE TRIGGER [ trigger_name | ALL | USER ]
      | ENABLE TRIGGER [ trigger_name | ALL | USER ]
      | ENABLE REPLICA TRIGGER trigger_name
      | ENABLE ALWAYS TRIGGER trigger_name
      | DISABLE RULE rewrite_rule_name
      | ENABLE RULE rewrite_rule_name
      | ENABLE REPLICA RULE rewrite_rule_name
      | ENABLE ALWAYS RULE rewrite_rule_name
      | DISABLE ROW LEVEL SECURITY
      | ENABLE ROW LEVEL SECURITY
      | FORCE ROW LEVEL SECURITY
      | NO FORCE ROW LEVEL SECURITY
      | CLUSTER ON index_name
      | SET WITHOUT CLUSTER
      | SET WITHOUT OIDS
      | SET TABLESPACE new_tablespace
      | SET { LOGGED | UNLOGGED }
      | SET ( storage_parameter [= value] [, ... ] )
      | RESET ( storage_parameter [, ... ] )
      | INHERIT parent_table
      | NO INHERIT parent_table
      | OF type_name
      | NOT OF
      | OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
      | REPLICA IDENTITY { DEFAULT | USING INDEX index_name | FULL | NOTHING }

[Redshift][]:

    ALTER TABLE table_name alter_table_action

    alter_table_action:
        ADD [CONSTRAINT constraint_name] table_constraint
      | DROP CONSTRAINT constraint_name [RESTRICT | CASCADE]
      | OWNER TO new_owner
      | RENAME TO new_name
      | RENAME COLUMN column_name TO new_name
      | ALTER COLUMN column_name TYPE new_data_type
      | ALTER COLUMN column_name ENCODE encode_type ["," ...]
      | ALTER DISTKEY column_name
      | ALTER DISTSTYLE {ALL | EVEN | AUTO | KEY DISTKEY column_name}
      | ALTER [COMPOUND] SORTKEY "(" column_name [,...] ")"
      | ALTER SORTKEY {AUTO | NONE}
      | ALTER ENCODE AUTO
      | ADD [COLUMN] column_name column_type [DEFAULT default_expr] [ENCODE encoding] [NOT NULL | NULL]
      | DROP [COLUMN] column_name [RESTRICT | CASCADE]
      | SET LOCATION { filename }
      | SET FILE FORMAT format
      | SET TABLE PROPERTIES "(" property_name "=" property_value ")"
      | PARTITION "(" partition_column "=" partition_value ["," ...] ")" SET LOCATION { filename }
      | ADD [IF NOT EXISTS] PARTITION "(" partition_column "=" partition_value ["," ...] ")"
          LOCATION { filename } ["," ...]
      | DROP PARTITION ( partition_column "=" partition_value ["," ...] ")"
      | ROW LEVEL SECURITY {ON | OFF}
      | ALTER AUTOREFRESH "=" [TRUE | FALSE]

    table_constraint:
        UNIQUE "(" column_name ["," ...] ")"
      | PRIMARY KEY "(" column_name ["," ...] ")"
      | FOREIGN KEY "(" column_name ["," ...] ")" REFERENCES reftable ["(" column_name ")"]

[Spark][]:

    ALTER TABLE table_name alter_table_action

    alter_table_action:
        RENAME TO table_name
      | partition_spec RENAME TO partition_spec
      | ADD COLUMNS "(" col_spec ["," ...] ")"
      | DROP {COLUMN | COLUMNS} ["("] col_name ["," ...] [")"]
      | RENAME COLUMN col_name TO col_name
      | {ALTER | CHANGE} [COLUMN] col_name alterColumnAction
      | [partition_spec] REPLACE COLUMNS [ "(" ] qualified_col_type_with_position_list [ ")" ]
      | ADD [IF NOT EXISTS] "(" partition_spec ... ")"
      | DROP [IF EXISTS] partition_spec [PURGE]
      | SET TBLPROPERTIES "(" key1 = val1 ["," ...] ")"
      | UNSET TBLPROPERTIES [ IF EXISTS ] "(" key1 ["," ...] ")"
      | [partition_spec] SET SERDEPROPERTIES "(" key1 = val1 ["," ...] ")"
      | [partition_spec] SET SERDE serde_class_name [WITH SERDEPROPERTIES "(" key1 = val1 ["," ...] ")"]
      | [partition_spec] SET FILEFORMAT file_format
      | [partition_spec] SET LOCATION new_location
      | RECOVER PARTITIONS

    partition_spec:
      PARTITION "(" partition_col_name = partition_col_val ["," ...] ")"

    qualified_col_type_with_position_list:
      col_name col_type [col_comment] [col_position] ["," ...]

[SQLite][]:

    ALTER TABLE table_name alter_table_action

    alter_table_action:
        RENAME TO table_name
      | RENAME [COLUMN] column_name TO column_name
      | ADD [COLUMN] column_definition
      | DROP [COLUMN] column_name

[Transact-SQL][]:

    ALTER TABLE table_name alter_table_action

    alter_table_action:
      | ALTER COLUMN {column_definition | column_name alter_col_add_drop}
          [WITH "(" ONLINE "=" {ON | OFF} ")"]
      | ADD column_definition
      | ADD computed_column_definition
      | ADD table_constraint
      | ADD column_set_definition
      | [system_start_end] PERIOD FOR SYSTEM_TIME "(" start_time_col "," end_time_col ")"
      | DROP [CONSTRAINT] [IF EXISTS]
          {constraint_name [WITH "(" drop_clustered_constraint_option ["," ...] ")"]} ["," ...]
      | DROP COLUMN [IF EXISTS] column_name ["," ...]
      | DROP PERIOD FOR SYSTEM_TIME
      | [WITH {CHECK | NOCHECK}] {CHECK | NOCHECK} CONSTRAINT {ALL | constraint_name ["," ...]}
      | {ENABLE | DISABLE} TRIGGER {ALL | trigger_name ["," ...]}
      | {ENABLE | DISABLE} CHANGE_TRACKING [WITH "(" TRACK_COLUMNS_UPDATED "=" {ON | OFF} ")"]
      | SWITCH [PARTITION source_partition_number_expression] TO target_table
          [PARTITION target_partition_number_expression]
          [WITH "(" low_priority_lock_wait ")"]
      | SET "(" FILESTREAM_ON "="  { partition_scheme_name | filegroup | "default" | "NULL" } ")"
      | SET "(" SYSTEM_VERSIONING "=" {OFF | ON ["(" system_versioning_on ")"]} ")"
      | SET "(" DATA_DELETION "=" {OFF | ON ["(" data_deletion_on ")"]} ")"
      | REBUILD [rebuild_partition]
      | SET "(" LOCK_ESCALATION "=" {AUTO | TABLE | DISABLE} ")"
      | [{ENABLE | DISABLE} FILETABLE_NAMESPACE] [SET "(" FILETABLE_DIRECTORY "=" directory_name ")"]
      | SET "(" REMOTE_DATA_ARCHIVE remote_data_archive_value ")"

    alter_col_add_drop:
        {ADD | DROP} {ROWGUIDCOL | PERSISTED | NOT FOR REPLICATION | SPARSE | HIDDEN}
      | {ADD | DROP} MASKED [WITH "(" FUNCTION "=" mask_function ")"]

    system_start_end:
      system_start_time_column_name datetime2 GENERATED ALWAYS AS ROW START
        [ HIDDEN ] [ NOT NULL ] [ CONSTRAINT constraint_name ]
        DEFAULT constant_expression [WITH VALUES] ,
      system_end_time_column_name datetime2 GENERATED ALWAYS AS ROW END
        [ HIDDEN ] [ NOT NULL ][ CONSTRAINT constraint_name ]
        DEFAULT constant_expression [WITH VALUES] ,
      start_transaction_id_column_name bigint GENERATED ALWAYS AS TRANSACTION_ID START
        [ HIDDEN ] NOT NULL [ CONSTRAINT constraint_name ]
        DEFAULT constant_expression [WITH VALUES],
      end_transaction_id_column_name bigint GENERATED ALWAYS AS TRANSACTION_ID END
        [ HIDDEN ] NULL [ CONSTRAINT constraint_name ]
        DEFAULT constant_expression [WITH VALUES],
      start_sequence_number_column_name bigint GENERATED ALWAYS AS SEQUENCE_NUMBER START
        [ HIDDEN ] NOT NULL [ CONSTRAINT constraint_name ]
        DEFAULT constant_expression [WITH VALUES],
      end_sequence_number_column_name bigint GENERATED ALWAYS AS SEQUENCE_NUMBER END
        [ HIDDEN ] NULL [ CONSTRAINT constraint_name ]
        DEFAULT constant_expression [WITH VALUES]

    system_versioning_on:
      HISTORY_TABLE "=" table_name
        ["," DATA_CONSISTENCY_CHECK "=" {ON | OFF}]
        ["," HISTORY_RETENTION_PERIOD "=" period]

    data_deletion_on:
      [FILTER_COLUMN "=" column_name] ["," RETENTION_PERIOD "=" period]

    period:
        INFINITE
      | number {DAY | DAYS | WEEK | WEEKS | MONTH | MONTHS | YEAR | YEARS}

    rebuild_partition:
        [PARTITION "=" ALL] [WITH "(" rebuild_option ["," ...] ")"]
      | [PARTITION "=" partition_number [WITH "(" single_partition_rebuild_option ["," ...] ")"]

    remote_data_archive_value:
        "=" ON "(" table_stretch_options ")"
      | "=" OFF_WITHOUT_DATA_RECOVERY "(" MIGRATION_STATE "=" PAUSED ")"
      | "(" table_stretch_options ["," ...] ")"

    table_stretch_options:
      [FILTER_PREDICATE = {null | table_predicate_function} ","]
        MIGRATION_STATE = {OUTBOUND | INBOUND | PAUSED}

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_11_10_alter_table_statement
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#alter_table_set_options_statement
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=statements-alter-table
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL
[mariadb]: https://mariadb.com/kb/en/alter-table/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/alter-table.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/index.html
[pl/sql]: https://docs.oracle.com/en/database/oracle/oracle-database/18/sqlrf/ALTER-TABLE.html
[postgresql]: https://www.postgresql.org/docs/current/sql-altertable.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_ALTER_TABLE.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-ddl-alter-table.html
[sqlite]: https://www.sqlite.org/lang_altertable.html
[transact-sql]: https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-table-transact-sql?view=sql-server-ver15
