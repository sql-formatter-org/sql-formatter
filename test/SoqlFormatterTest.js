import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import supportsStrings from './features/strings';
import supportsOperators from './features/operators';

describe('SoqlFormatter', () => {
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'soql' });

  supportsStrings(format, [`''`]);
  supportsOperators(['=', '+', '-', '>', '<', '>=', '<=']);

  it('formats simple SELECT query', () => {
    const result = format('SELECT FORMAT(CreatedDate),Column1 FROM Account');
    expect(result).toBe(dedent`
      SELECT
        FORMAT(CreatedDate),
        Column1
      FROM
        Account
    `);
  });

  it('formats complex query', () => {
    const result = format(
      'SELECT Type, BillingCountry, GROUPING(Type) grpType, GROUPING(BillingCountry) grpCty, COUNT(id) accts FROM Account GROUP BY CUBE(Type, BillingCountry) ORDER BY GROUPING(Type), GROUPING(Id, BillingCountry), Name DESC NULLS FIRST, Id ASC NULLS LAST'
    );
    expect(result).toBe(dedent`
      SELECT
        Type,
        BillingCountry,
        GROUPING(Type) grpType,
        GROUPING(BillingCountry) grpCty,
        COUNT(id) accts
      FROM
        Account
      GROUP BY
        CUBE(Type, BillingCountry)
      ORDER BY
        GROUPING(Type),
        GROUPING(Id, BillingCountry),
        Name DESC NULLS FIRST,
        Id ASC NULLS LAST
    `);
  });

  it('formats subquery', () => {
    const result = format(
      'SELECT a.Id, a.Name, (SELECT a2.Id FROM ChildAccounts a2), (SELECT a1.Id FROM ChildAccounts1 a1) FROM Account a'
    );
    expect(result).toBe(dedent`
      SELECT
        a.Id,
        a.Name,
        (
          SELECT
            a2.Id
          FROM
            ChildAccounts a2
        ),
        (
          SELECT
            a1.Id
          FROM
            ChildAccounts1 a1
        )
      FROM
        Account a
    `);
  });

  it('formats LIMIT', () => {
    expect(format('SELECT col1 FROM tbl ORDER BY col2 DESC LIMIT 10;')).toBe(dedent`
      SELECT
        col1
      FROM
        tbl
      ORDER BY
        col2 DESC
      LIMIT
        10;
    `);
  });

  it('formats only // as a line comment', () => {
    const result = format(
      `
      SELECT col FROM
      // This is a comment
      MyTable;
      `
    );
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        // This is a comment
        MyTable;
    `);
  });

  it('Formats complex WHERE clause', () => {
    expect(
      format(
        `
        SELECT Id
        FROM Account
        WHERE (Id IN ('1', '2', '3') OR (NOT Id = '2') OR (Name LIKE '%FOO%' OR (Name LIKE '%ARM%' AND FOO = 'bar')))
        `
      )
    ).toBe(dedent`
      SELECT
        Id
      FROM
        Account
      WHERE
        (
          Id IN ('1', '2', '3')
          OR (NOT Id = '2')
          OR (
            Name LIKE '%FOO%'
            OR (
              Name LIKE '%ARM%'
              AND FOO = 'bar'
            )
          )
        )
    `);
  });

  it('Formats date literal with variable', () => {
    expect(format(`SELECT Id FROM Opportunity WHERE CloseDate < NEXT_N_FISCAL_YEARS:3`))
      .toBe(dedent`
        SELECT
          Id
        FROM
          Opportunity
        WHERE
          CloseDate < NEXT_N_FISCAL_YEARS:3
    `);
  });

  // TYPEOF TESTS
  it('formats TYPEOF ... WHEN with a blank expression', () => {
    const result = format(
      'TYPEOF What WHEN Account THEN Phone, NumberOfEmployees WHEN Opportunity THEN Amount, CloseDate ELSE Name, Email END'
    );

    expect(result).toBe(dedent`
      TYPEOF
        What
        WHEN Account THEN Phone,
        NumberOfEmployees
        WHEN Opportunity THEN Amount,
        CloseDate
        ELSE Name,
        Email
      END
    `);
  });

  it('formats TYPEOF ... WHEN inside SELECT', () => {
    const result = format(
      'SELECT Id, Name, TYPEOF What WHEN Account THEN Phone WHEN Opportunity THEN Amount ELSE Name END, CreatedDate FROM Event'
    );

    expect(result).toBe(dedent`
      SELECT
        Id,
        Name,
        TYPEOF
          What
          WHEN Account THEN Phone
          WHEN Opportunity THEN Amount
          ELSE Name
        END,
        CreatedDate
      FROM
        Event
    `);
  });

  it('recognizes lowercase TYPEOF ... END', () => {
    const result = format(
      'typeof what when account then phone when opportunity then amount else name, email end'
    );

    expect(result).toBe(dedent`
      typeof
        what
        when account then phone
        when opportunity then amount
        else name,
        email
      end
    `);
  });

  it('ignores words TYPEOF and END inside other strings', () => {
    const result = format('SELECT TYPEOFDATE, ENDDATE FROM table1;');

    expect(result).toBe(dedent`
      SELECT
        TYPEOFDATE,
        ENDDATE
      FROM
        table1;
    `);
  });

  it('properly converts to uppercase in typeof statements', () => {
    const result = format(
      'typeof what when account then phone, numberofemployees when opportunity then amount, closedate else name, email end',
      { uppercase: true }
    );
    expect(result).toBe(dedent`
      TYPEOF
        what
        WHEN account THEN phone,
        numberofemployees
        WHEN opportunity THEN amount,
        closedate
        ELSE name,
        email
      END
    `);
  });

  it('supports indent option', () => {
    const result = format('SELECT Id,Name FROM Account', {
      indent: '    ',
    });

    expect(result).toBe(dedent`
      SELECT
          Id,
          Name
      FROM
          Account
    `);
  });

  it('supports linesBetweenQueries option', () => {
    const result = format('SELECT Id FROM foo; SELECT Name FROM bar;', { linesBetweenQueries: 2 });
    expect(result).toBe(dedent`
      SELECT
        Id
      FROM
        foo;

      SELECT
        Name
      FROM
        bar;
    `);
  });

  it('supports uppercase option', () => {
    const result = format('select Id frOM foo WHERe cola > 1 and colb = 3', {
      uppercase: true,
    });
    expect(result).toBe(dedent`
      SELECT
        Id
      FROM
        foo
      WHERE
        cola > 1
        AND colb = 3
    `);
  });
});
