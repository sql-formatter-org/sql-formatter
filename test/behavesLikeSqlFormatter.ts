import dedent from 'dedent-js';

import { FormatFn } from '../src/sqlFormatter.js';

import supportsCase from './features/case.js';
import supportsWith from './features/with.js';
import supportsTabWidth from './options/tabWidth.js';
import supportsUseTabs from './options/useTabs.js';
import supportsExpressionWidth from './options/expressionWidth.js';
import supportsKeywordCase from './options/keywordCase.js';
import supportsIdentifierCase from './options/identifierCase.js';
import supportsIndentStyle from './options/indentStyle.js';
import supportsLinesBetweenQueries from './options/linesBetweenQueries.js';
import supportsNewlineBeforeSemicolon from './options/newlineBeforeSemicolon.js';
import supportsLogicalOperatorNewline from './options/logicalOperatorNewline.js';
import supportsCommaNewline from './options/commaNewline.js';
import supportsParamTypes from './options/paramTypes.js';
import supportsWindowFunctions from './features/windowFunctions.js';
import supportsFunctionCase from './options/functionCase.js';
import supportsDisableComment from './features/disableComment.js';

/**
 * Core tests for all SQL formatters
 */
export default function behavesLikeSqlFormatter(format: FormatFn) {
  supportsDisableComment(format);
  supportsCase(format);
  supportsWith(format);

  supportsTabWidth(format);
  supportsUseTabs(format);
  supportsKeywordCase(format);
  supportsIdentifierCase(format);
  supportsFunctionCase(format);
  supportsIndentStyle(format);
  supportsLinesBetweenQueries(format);
  supportsExpressionWidth(format);
  supportsNewlineBeforeSemicolon(format);
  supportsLogicalOperatorNewline(format);
  supportsCommaNewline(format);
  supportsParamTypes(format);
  supportsWindowFunctions(format);

  it('formats SELECT with asterisks', () => {
    const result = format('SELECT tbl.*, count(*), col1 * col2 FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        tbl.*,
        count(*),
        col1 * col2
      FROM
        tbl;
    `);
  });

  it('formats complex SELECT', () => {
    const result = format(
      "SELECT DISTINCT name, ROUND(age/7) field1, 18 + 20 AS field2, 'some string' FROM foo;"
    );
    expect(result).toBe(dedent`
      SELECT DISTINCT
        name,
        ROUND(age / 7) field1,
        18 + 20 AS field2,
        'some string'
      FROM
        foo;
    `);
  });

  it('formats SELECT with complex WHERE', () => {
    const result = format(`
      SELECT * FROM foo WHERE Column1 = 'testing'
      AND ( (Column2 = Column3 OR Column4 >= ABS(5)) );
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo
      WHERE
        Column1 = 'testing'
        AND (
          (
            Column2 = Column3
            OR Column4 >= ABS(5)
          )
        );
    `);
  });

  it('formats SELECT with top level reserved words', () => {
    const result = format(`
      SELECT * FROM foo WHERE name = 'John' GROUP BY some_column
      HAVING column > 10 ORDER BY other_column;
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo
      WHERE
        name = 'John'
      GROUP BY
        some_column
      HAVING
        column > 10
      ORDER BY
        other_column;
    `);
  });

  it('allows keywords as column names in tbl.col syntax', () => {
    const result = format(
      'SELECT mytable.update, mytable.select FROM mytable WHERE mytable.from > 10;'
    );
    expect(result).toBe(dedent`
      SELECT
        mytable.update,
        mytable.select
      FROM
        mytable
      WHERE
        mytable.from > 10;
    `);
  });

  it('formats ORDER BY', () => {
    const result = format(`
      SELECT * FROM foo ORDER BY col1 ASC, col2 DESC;
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo
      ORDER BY
        col1 ASC,
        col2 DESC;
    `);
  });

  it('formats SELECT query with SELECT query inside it', () => {
    const result = format(
      'SELECT *, SUM(*) AS total FROM (SELECT * FROM Posts WHERE age > 10) WHERE a > b'
    );
    expect(result).toBe(dedent`
      SELECT
        *,
        SUM(*) AS total
      FROM
        (
          SELECT
            *
          FROM
            Posts
          WHERE
            age > 10
        )
      WHERE
        a > b
    `);
  });

  it('formats open paren after comma', () => {
    const result = format('INSERT INTO TestIds (id) VALUES (4),(5), (6),(7),(9),(10),(11);');
    expect(result).toBe(dedent`
      INSERT INTO
        TestIds (id)
      VALUES
        (4),
        (5),
        (6),
        (7),
        (9),
        (10),
        (11);
    `);
  });

  it('keeps short parenthesized list with nested parenthesis on single line', () => {
    const result = format('SELECT (a + b * (c - SIN(1)));');
    expect(result).toBe(dedent`
      SELECT
        (a + b * (c - SIN(1)));
    `);
  });

  it('breaks long parenthesized lists to multiple lines', () => {
    const result = format(`
      INSERT INTO some_table (id_product, id_shop, id_currency, id_country, id_registration) (
      SELECT COALESCE(dq.id_discounter_shopping = 2, dq.value, dq.value / 100),
      COALESCE (dq.id_discounter_shopping = 2, 'amount', 'percentage') FROM foo);
    `);
    expect(result).toBe(dedent`
      INSERT INTO
        some_table (
          id_product,
          id_shop,
          id_currency,
          id_country,
          id_registration
        ) (
          SELECT
            COALESCE(
              dq.id_discounter_shopping = 2,
              dq.value,
              dq.value / 100
            ),
            COALESCE(
              dq.id_discounter_shopping = 2,
              'amount',
              'percentage'
            )
          FROM
            foo
        );
    `);
  });

  it('formats top-level and newline multi-word reserved words with inconsistent spacing', () => {
    const result = format('SELECT * FROM foo LEFT \t   \n JOIN mycol ORDER \n BY blah');
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo
        LEFT JOIN mycol
      ORDER BY
        blah
    `);
  });

  it('formats long double parenthized queries to multiple lines', () => {
    const result = format("((foo = '0123456789-0123456789-0123456789-0123456789'))");
    expect(result).toBe(dedent`
      (
        (
          foo = '0123456789-0123456789-0123456789-0123456789'
        )
      )
    `);
  });

  it('formats short double parenthized queries to one line', () => {
    const result = format("((foo = 'bar'))");
    expect(result).toBe("((foo = 'bar'))");
  });

  it('supports unicode letters in identifiers', () => {
    const result = format('SELECT 结合使用, тест FROM töörõõm;');
    expect(result).toBe(dedent`
      SELECT
        结合使用,
        тест
      FROM
        töörõõm;
    `);
  });

  // Using Myanmar and Tibetan digits 1, 2, 3
  it('supports unicode numbers in identifiers', () => {
    const result = format('SELECT my၁၂၃ FROM tbl༡༢༣;');
    expect(result).toBe(dedent`
      SELECT
        my၁၂၃
      FROM
        tbl༡༢༣;
    `);
  });

  it('supports unicode diacritical marks in identifiers', () => {
    const COMBINING_TILDE = String.fromCodePoint(0x0303);
    const result = format('SELECT o' + COMBINING_TILDE + ' FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        õ
      FROM
        tbl;
    `);
  });
}
