import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsCase(format: FormatFn) {
  it('formats CASE ... WHEN with a blank expression', () => {
    const result = format(
      "CASE WHEN option = 'foo' THEN 1 WHEN option = 'bar' THEN 2 WHEN option = 'baz' THEN 3 ELSE 4 END;"
    );

    expect(result).toBe(dedent`
      CASE
        WHEN option = 'foo' THEN 1
        WHEN option = 'bar' THEN 2
        WHEN option = 'baz' THEN 3
        ELSE 4
      END;
    `);
  });

  it('formats CASE ... WHEN with an expression', () => {
    const result = format(
      "CASE trim(sqrt(2)) WHEN 'one' THEN 1 WHEN 'two' THEN 2 WHEN 'three' THEN 3 ELSE 4 END;"
    );

    expect(result).toBe(dedent`
      CASE trim(sqrt(2))
        WHEN 'one' THEN 1
        WHEN 'two' THEN 2
        WHEN 'three' THEN 3
        ELSE 4
      END;
    `);
  });

  it('formats CASE ... WHEN inside SELECT', () => {
    const result = format(
      "SELECT foo, bar, CASE baz WHEN 'one' THEN 1 WHEN 'two' THEN 2 ELSE 3 END FROM tbl;"
    );

    expect(result).toBe(dedent`
      SELECT
        foo,
        bar,
        CASE baz
          WHEN 'one' THEN 1
          WHEN 'two' THEN 2
          ELSE 3
        END
      FROM
        tbl;
    `);
  });

  it('recognizes lowercase CASE ... END', () => {
    const result = format("case when option = 'foo' then 1 else 2 end;");

    expect(result).toBe(dedent`
      case
        when option = 'foo' then 1
        else 2
      end;
    `);
  });

  // Regression test for issue #43
  it('ignores words CASE and END inside other strings', () => {
    const result = format('SELECT CASEDATE, ENDDATE FROM table1;');

    expect(result).toBe(dedent`
      SELECT
        CASEDATE,
        ENDDATE
      FROM
        table1;
    `);
  });

  it('properly converts to uppercase in case statements', () => {
    const result = format(
      "case trim(sqrt(my_field)) when 'one' then 1 when 'two' then 2 when 'three' then 3 else 4 end;",
      { keywordCase: 'upper' }
    );
    expect(result).toBe(dedent`
      CASE TRIM(SQRT(my_field))
        WHEN 'one' THEN 1
        WHEN 'two' THEN 2
        WHEN 'three' THEN 3
        ELSE 4
      END;
    `);
  });

  it('handles edge case of ending inline block with END', () => {
    const result = format(dedent`select sum(case a when foo then bar end) from quaz`);

    expect(result).toBe(dedent`
      select
        sum(
          case a
            when foo then bar
          end
        )
      from
        quaz
    `);
  });

  it('formats CASE with comments', () => {
    const result = format(`
      SELECT CASE /*c1*/ foo /*c2*/
      WHEN /*c3*/ 1 /*c4*/ THEN /*c5*/ 2 /*c6*/
      ELSE /*c7*/ 3 /*c8*/
      END;
    `);

    expect(result).toBe(dedent`
      SELECT
        CASE /*c1*/ foo /*c2*/
          WHEN /*c3*/ 1 /*c4*/ THEN /*c5*/ 2 /*c6*/
          ELSE /*c7*/ 3 /*c8*/
        END;
    `);
  });

  it('formats CASE with comments inside sub-expressions', () => {
    const result = format(`
      SELECT CASE foo + /*c1*/ bar
      WHEN 1 /*c2*/ + 1 THEN 2 /*c2*/ * 2
      ELSE 3 - /*c3*/ 3
      END;
    `);

    expect(result).toBe(dedent`
      SELECT
        CASE foo + /*c1*/ bar
          WHEN 1 /*c2*/ + 1 THEN 2 /*c2*/ * 2
          ELSE 3 - /*c3*/ 3
        END;
    `);
  });

  it('formats CASE with identStyle:tabularLeft', () => {
    const result = format('SELECT CASE foo WHEN 1 THEN bar ELSE baz END;', {
      indentStyle: 'tabularLeft',
    });

    expect(result).toBe(dedent`
      SELECT    CASE foo
                          WHEN 1 THEN bar
                          ELSE baz
                END;
    `);
  });

  it('formats CASE with identStyle:tabularRight', () => {
    const result = format('SELECT CASE foo WHEN 1 THEN bar ELSE baz END;', {
      indentStyle: 'tabularRight',
    });

    expect(result).toBe(
      [
        '   SELECT CASE foo',
        '                    WHEN 1 THEN bar',
        '                    ELSE baz',
        '          END;',
      ].join('\n')
    );
  });

  // Not a pretty result.
  // This test is more to ensure we don't crash on this code.
  it('formats nested case expressions', () => {
    const result = format(`
      SELECT
        CASE
          CASE foo WHEN 1 THEN 11 ELSE 22 END
          WHEN 11 THEN 110
          WHEN 22 THEN 220
          ELSE 123
        END
      FROM
        tbl;
    `);

    expect(result).toBe(dedent`
      SELECT
        CASE CASE foo
            WHEN 1 THEN 11
            ELSE 22
          END
          WHEN 11 THEN 110
          WHEN 22 THEN 220
          ELSE 123
        END
      FROM
        tbl;
    `);
  });
}
