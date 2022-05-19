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
import supportsComments from './features/comments';

describe('PostgreSqlFormatter', () => {
  const language = 'postgresql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(language, format);
  supportsCreateTable(format);
  supportsConstraints(format);
  supportsAlterTable(format);
  supportsDeleteFrom(format);
  supportsStrings(format, PostgreSqlFormatter.stringTypes);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, PostgreSqlFormatter.operators);
  supportsJoin(format);
  supportsReturning(format);
  supportsParams(format, { indexed: ['$'], named: [':'] });
});
