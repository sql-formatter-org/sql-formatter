import { expandPhrases } from '../../expandPhrases.js';
import Formatter from '../../formatter/Formatter.js';
import { DialectFormatOptions } from '../../formatter/ExpressionFormatter.js';
import Tokenizer from '../../lexer/Tokenizer.js';
import { functions } from './hive.functions.js';
import { keywords } from './hive.keywords.js';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'SORT BY',
  'CLUSTER BY',
  'DISTRIBUTE BY',
  'LIMIT',
  // Data manipulation
  // - insert:
  //   Hive does not actually support plain INSERT INTO, only INSERT INTO TABLE
  //   but it's a nuisance to not support it, as all other dialects do.
  'INSERT INTO [TABLE]',
  'VALUES',
  // - update:
  'SET',
  // - merge:
  'MERGE INTO',
  'WHEN [NOT] MATCHED [THEN]',
  'UPDATE SET',
  'INSERT [VALUES]',
  // - insert overwrite directory:
  //   https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML#LanguageManualDML-Writingdataintothefilesystemfromqueries
  'INSERT OVERWRITE [LOCAL] DIRECTORY',
  // - load:
  //   https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML#LanguageManualDML-Loadingfilesintotables
  'LOAD DATA [LOCAL] INPATH',
  '[OVERWRITE] INTO TABLE',
  // Data definition
  'CREATE [MATERIALIZED] VIEW [IF NOT EXISTS]',
  'CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS]',
]);

const onelineClauses = expandPhrases([
  // - update:
  'UPDATE',
  // - delete:
  'DELETE FROM',
  // - drop table:
  'DROP TABLE [IF EXISTS]',
  // - alter table:
  'ALTER TABLE',
  'RENAME TO',
  // - truncate:
  'TRUNCATE [TABLE]',
  // other
  'ALTER',
  'CREATE',
  'USE',
  'DESCRIBE',
  'DROP',
  'FETCH',
  'SHOW',
  'STORED AS',
  'STORED BY',
  'ROW FORMAT',
]);

const reservedSetOperations = expandPhrases(['UNION [ALL | DISTINCT]']);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  // non-standard joins
  'LEFT SEMI JOIN',
]);

const reservedPhrases = expandPhrases(['{ROWS | RANGE} BETWEEN']);

// https://cwiki.apache.org/confluence/display/Hive/LanguageManual
export default class HiveFormatter extends Formatter {
  tokenizer() {
    return new Tokenizer({
      reservedSelect,
      reservedClauses: [...reservedClauses, ...onelineClauses],
      reservedSetOperations,
      reservedJoins,
      reservedPhrases,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      extraParens: ['[]'],
      stringTypes: ['""-bs', "''-bs"],
      identTypes: ['``'],
      variableTypes: [{ quote: '{}', prefixes: ['$'], requirePrefix: true }],
      operators: ['%', '~', '^', '|', '&', '<=>', '==', '!', '||'],
    });
  }

  formatOptions(): DialectFormatOptions {
    return {
      onelineClauses,
    };
  }
}
