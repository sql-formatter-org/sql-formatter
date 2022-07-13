import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import MySqlFormatter from 'src/languages/mysql.formatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsOperators from './features/operators';
import supportsWindow from './features/window';

describe('MySqlFormatter', () => {
  const language = 'mysql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  supportsOperators(format, MySqlFormatter.operators, ['AND', 'OR', 'XOR']);
  supportsWindow(format);

  // TODO: disabled for now
  it.skip('supports @@ system variables', () => {
    const result = format('SELECT @@GLOBAL.time, @@SYSTEM.date, @@hour FROM foo;');
    expect(result).toBe(dedent`
      SELECT
        @@GLOBAL.time,
        @@SYSTEM.date,
        @@hour
      FROM
        foo;
    `);
  });
});
