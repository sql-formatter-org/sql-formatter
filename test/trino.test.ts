import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import TrinoFormatter from 'src/languages/trino.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsArrayLiterals from './features/arrayLiterals';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsDeleteFrom from './features/deleteFrom';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsStrings from './features/strings';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';

describe('TrinoFormatter', () => {
  const language = 'trino';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsDeleteFrom(format);
  supportsStrings(format, ["''", "X''"]);
  supportsIdentifiers(format, ['""', '``']);
  supportsBetween(format);
  supportsOperators(format, TrinoFormatter.operators, ['AND', 'OR']);
  supportsArrayLiterals(format);
  supportsArrayAndMapAccessors(format);
  supportsJoin(format, {
    additionally: [
      'NATURAL INNER JOIN',
      'NATURAL LEFT JOIN',
      'NATURAL LEFT OUTER JOIN',
      'NATURAL RIGHT JOIN',
      'NATURAL RIGHT OUTER JOIN',
      'NATURAL FULL JOIN',
      'NATURAL FULL OUTER JOIN',
    ],
  });
  supportsParams(format, { positional: true });

  it('formats SET SESSION', () => {
    const result = format('SET SESSION foo = 444;');
    expect(result).toBe(dedent`
      SET SESSION
        foo = 444;
    `);
  });

  it('formats basic ALTER TABLE statements', () => {
    const result = format(`
      ALTER TABLE people RENAME TO persons;
      ALTER TABLE persons ADD COLUMN location_id INT;
      ALTER TABLE persons RENAME COLUMN location_id TO loc_id;
      ALTER TABLE persons DROP COLUMN loc_id;
    `);
    expect(result).toBe(dedent`
      ALTER TABLE
        people
      RENAME TO
        persons;

      ALTER TABLE
        persons
      ADD COLUMN
        location_id INT;

      ALTER TABLE
        persons
      RENAME COLUMN
        location_id TO loc_id;

      ALTER TABLE
        persons
      DROP COLUMN
        loc_id;
    `);
  });
});
