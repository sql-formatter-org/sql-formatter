import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsComments from './features/comments';
import supportsConstraints from './features/constraints';
import supportsCreateView from './features/createView';
import supportsDeleteFrom from './features/deleteFrom';
import supportsDropTable from './features/dropTable';
import supportsIdentifiers from './features/identifiers';
import supportsInsertInto from './features/insertInto';
import supportsStrings from './features/strings';
import supportsTruncateTable from './features/truncateTable';
import supportsUpdate from './features/update';

describe('SingleStoreDbFormatter', () => {
  const language = 'singlestoredb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { hashComments: true });
  supportsStrings(format, ["''", '""', "X''"]);
  supportsIdentifiers(format, ['``']);
  supportsCreateView(format, { orReplace: false });
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    modify: true,
    renameTo: true,
    renameColumn: false,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format, { withoutInto: true });
  supportsUpdate(format);
  supportsTruncateTable(format, { withoutTable: true });
  supportsBetween(format);
});
