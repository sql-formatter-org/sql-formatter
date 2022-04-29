import BigQueryFormatter from './languages/bigquery.formatter';
import Db2Formatter from './languages/db2.formatter';
import HiveFormatter from './languages/hive.formatter';
import MariaDbFormatter from './languages/mariadb.formatter';
import MySqlFormatter from './languages/mysql.formatter';
import N1qlFormatter from './languages/n1ql.formatter';
import PlSqlFormatter from './languages/plsql.formatter';
import PostgreSqlFormatter from './languages/postgresql.formatter';
import RedshiftFormatter from './languages/redshift.formatter';
import SparkSqlFormatter from './languages/sparksql.formatter';
import StandardSqlFormatter from './languages/standardsql.formatter';
import TSqlFormatter from './languages/tsql.formatter';

import {
  AliasMode,
  CommaPosition,
  FormatOptions,
  KeywordCase,
  KeywordMode,
  NewlineMode,
} from './types';
import { isNumber } from './utils';

export const formatters = {
  bigquery: BigQueryFormatter,
  db2: Db2Formatter,
  hive: HiveFormatter,
  mariadb: MariaDbFormatter,
  mysql: MySqlFormatter,
  n1ql: N1qlFormatter,
  plsql: PlSqlFormatter,
  postgresql: PostgreSqlFormatter,
  redshift: RedshiftFormatter,
  spark: SparkSqlFormatter,
  sql: StandardSqlFormatter,
  tsql: TSqlFormatter,
};
export type FormatterLanguage = keyof typeof formatters;
export const supportedDialects = Object.keys(formatters);

export type FormatFnOptions = FormatOptions & { language: FormatterLanguage };

const defaultOptions: FormatFnOptions = {
  language: 'sql',
  indent: '  ',
  keywordCase: KeywordCase.preserve,
  keywordPosition: KeywordMode.standard,
  newline: NewlineMode.always,
  breakBeforeBooleanOperator: true,
  aliasAs: AliasMode.preserve,
  tabulateAlias: false,
  commaPosition: CommaPosition.after,
  parenOptions: {
    openParenNewline: true,
    closeParenNewline: true,
  },
  lineWidth: 50,
  linesBetweenQueries: 1,
  denseOperators: false,
  semicolonNewline: false,
};

/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {string} query - input SQL query string
 * @param {FormatOptions} cfg Configuration options (see docs in README)
 * @return {string} formatted query
 */
export const format = (query: string, cfg: Partial<FormatFnOptions> = {}): string => {
  if (typeof query !== 'string') {
    throw new Error('Invalid query argument. Expected string, instead got ' + typeof query);
  }

  const options = validateConfig({
    ...defaultOptions,
    ...cfg,
    parenOptions: { ...defaultOptions.parenOptions, ...cfg.parenOptions },
  });

  const Formatter = formatters[options.language];
  return new Formatter(options).format(query);
};

function validateConfig(cfg: FormatFnOptions): FormatFnOptions {
  if (!supportedDialects.includes(cfg.language)) {
    throw new Error(`Unsupported SQL dialect: ${cfg.language}`);
  }

  if (
    cfg.keywordPosition === KeywordMode.tenSpaceLeft ||
    cfg.keywordPosition === KeywordMode.tenSpaceRight
  ) {
    cfg.indent = ' '.repeat(10);
  }

  if (isNumber(cfg.newline) && cfg.newline <= 0) {
    throw new Error('newline config must be a positive number.');
  }

  if (cfg.lineWidth <= 0) {
    throw new Error(`lineWidth config must be positive number. Received ${cfg.lineWidth} instead.`);
  }

  return cfg;
}
