import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import PostgreSqlFormatter from '../src/languages/postgresql.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsReturning from './features/returning';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsParams from './options/param';

describe('PostgreSqlFormatter', () => {
  const language = 'postgresql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(language, format);
  supportsCreateTable(language, format);
  supportsConstraints(language, format);
  supportsAlterTable(language, format);
  supportsDeleteFrom(language, format);
  supportsStrings(language, format, PostgreSqlFormatter.stringTypes);
  supportsBetween(language, format);
  supportsSchema(language, format);
  supportsOperators(language, format, PostgreSqlFormatter.operators);
  supportsJoin(language, format);
  supportsReturning(language, format);
  supportsParams(language, format, { indexed: ['$'], named: [':'] });
});
