import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import HiveFormatter from '../src/languages/hive.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsArray from './features/array';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';

describe('HiveFormatter', () => {
  const language = 'hive';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, HiveFormatter.stringTypes);
  supportsIdentifiers(format, HiveFormatter.identifierTypes);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format, { without: ['NATURAL JOIN'] });
  supportsOperators(format, HiveFormatter.operators);
  supportsArray(format);

  it('throws error when params option used', () => {
    expect(() => format('SELECT *', { params: ['1', '2', '3'] })).toThrow(
      'Unexpected "params" option. Prepared statement placeholders not supported for Hive.'
    );
  });
});
