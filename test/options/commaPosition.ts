import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsCommaPosition(format: FormatFn) {
  it('by default adds newline after comma', () => {
    const result = format(`SELECT id, first_name, last_name, email FROM users;`);
    expect(result).toBe(
      dedent`
      SELECT
        id,
        first_name,
        last_name,
        email
      FROM
        users;
    `
    );
  });

  it('supports newline before comma', () => {
    const result = format(`SELECT id, first_name, last_name, email FROM users;`, {
      commaPosition: 'leadingWithSpace',
    });
    expect(result).toBe(
      dedent`
      SELECT
        id
        , first_name
        , last_name
        , email
      FROM
        users;
    `
    );
  });

  it('preserves row-wise format for INSERT VALUES and Statements', () => {
    const result = format(
      `INSERT INTO users (id, name, email, password) VALUES (1, 'John', 'john@example.com', 'hash');`,
      {
        commaPosition: 'leadingWithSpace',
      }
    );
    expect(result).toBe(dedent`
      INSERT INTO
        users (id, name, email, password)
      VALUES
        (1, 'John', 'john@example.com', 'hash');
    `);
  });
  it('supports comma position for multiple rows in INSERT VALUES', () => {
    const result = format(
      `INSERT INTO employees (employee_id, first_name, last_name, email, phone, hire_date, department, job_title, salary, is_active) VALUES (1001, 'John', 'Smith', 'john.smith@company.com', '555-123-4567', '2024-03-15', 'Engineering', 'Software Developer', 85000.00, TRUE), (1002, 'John', 'Smith', 'john.smith@company.com', '555-123-4567', '2024-03-15', 'Engineering', 'Software Developer', 85000.00, TRUE);`,
      {
        commaPosition: 'leadingWithSpace',
      }
    );
    expect(result).toBe(dedent`
      INSERT INTO
        employees (
          employee_id
          , first_name
          , last_name
          , email
          , phone
          , hire_date
          , department
          , job_title
          , salary
          , is_active
        )
      VALUES
        (
          1001
          , 'John'
          , 'Smith'
          , 'john.smith@company.com'
          , '555-123-4567'
          , '2024-03-15'
          , 'Engineering'
          , 'Software Developer'
          , 85000.00
          , TRUE
        )
        , (
          1002
          , 'John'
          , 'Smith'
          , 'john.smith@company.com'
          , '555-123-4567'
          , '2024-03-15'
          , 'Engineering'
          , 'Software Developer'
          , 85000.00
          , TRUE
        );
    `);
  });

  it('supports trailing comma position for multiple rows in INSERT VALUES', () => {
    const result = format(
      `INSERT INTO employees (employee_id, first_name, last_name, email, phone, hire_date, department, job_title, salary, is_active) VALUES (1001, 'John', 'Smith', 'john.smith@company.com', '555-123-4567', '2024-03-15', 'Engineering', 'Software Developer', 85000.00, TRUE), (1002, 'John', 'Smith', 'john.smith@company.com', '555-123-4567', '2024-03-15', 'Engineering', 'Software Developer', 85000.00, TRUE);`
    );
    expect(result).toBe(dedent`
      INSERT INTO
        employees (
          employee_id,
          first_name,
          last_name,
          email,
          phone,
          hire_date,
          department,
          job_title,
          salary,
          is_active
        )
      VALUES
        (
          1001,
          'John',
          'Smith',
          'john.smith@company.com',
          '555-123-4567',
          '2024-03-15',
          'Engineering',
          'Software Developer',
          85000.00,
          TRUE
        ),
        (
          1002,
          'John',
          'Smith',
          'john.smith@company.com',
          '555-123-4567',
          '2024-03-15',
          'Engineering',
          'Software Developer',
          85000.00,
          TRUE
        );
    `);
  });

  it('supports leadingWithSpace comma position in UPDATE statements', () => {
    const result = format(
      `UPDATE products SET price = price * 1.1, stock = stock - 1 WHERE category = 'Electronics';
      `,
      {
        commaPosition: 'leadingWithSpace',
      }
    );
    const acceptableFormats = [
      dedent`
      UPDATE products
      SET
        price = price * 1.1
        , stock = stock - 1
      WHERE
        category = 'Electronics';
    `,
      // In case user has a different language setting like spark
      dedent`
        UPDATE products SET price = price * 1.1
        , stock = stock - 1
        WHERE
          category = 'Electronics';
      `,
    ];
    expect(acceptableFormats).toContain(result);
  });

  it('supports leadingWithSpace comma position with comments', () => {
    const result = format(
      `SELECT
        foo, -- comment 1
        bar, -- comment 2
        baz
      FROM
        my_table;
    `,
      {
        commaPosition: 'leadingWithSpace',
      }
    );
    expect(result).toBe(
      dedent`
      SELECT
        foo -- comment 1
        , bar -- comment 2
        , baz
      FROM
        my_table;
    `
    );
  });

  it('supports leadingWithSpace comma position with comments(with commas)', () => {
    const result = format(
      `SELECT
        foo, -- comment, with, commas
        bar, -- another comment, with, commas
        baz
      FROM
        my_table;
    `,
      {
        commaPosition: 'leadingWithSpace',
      }
    );
    expect(result).toBe(
      dedent`
      SELECT
        foo -- comment, with, commas
        , bar -- another comment, with, commas
        , baz
      FROM
        my_table;
    `
    );
  });

  it('supports leadingWithSpace comma position in complex queries with complex comments', () => {
    const result = format(
      `SELECT
        foo, -- comment, with, commas
        /* block comment, with, commas */
        bar, -- another comment, with, commas
        baz,
        qux -- last comment, with, commas
      FROM
        my_table -- table comment, with, commas
      WHERE
        foo = 'value, with, commas' AND -- condition comment, with, commas
        bar > 100;
    `,
      {
        commaPosition: 'leadingWithSpace',
      }
    );
    // console.log(result);
    expect(result).toBe(
      dedent`
    SELECT
      foo -- comment, with, commas
      /* block comment, with, commas */
      , bar -- another comment, with, commas
      , baz
      , qux -- last comment, with, commas
    FROM
      my_table -- table comment, with, commas
    WHERE
      foo = 'value, with, commas'
      AND -- condition comment, with, commas
      bar > 100;
    `
    );
  });

  it('supports leadingWithSpace comma position in queries with function argument list', () => {
    // Example function: CONCAT_WS(separator, str1, str2, ...)
  });

  it('supports leading comma', () => {
    const result = format(`SELECT id, first_name, last_name, email FROM users;`, {
      commaPosition: 'leading',
    });
    expect(result).toBe(
      dedent`
      SELECT
        id
        ,first_name
        ,last_name
        ,email
      FROM
        users;
    `
    );
  });

  it('supports trailing comma with comments from a leading comma formatted query', () => {
    const result = format(
      `SELECT
        id -- comment 1
        ,first_name -- comment 2
        /* block comment */
        ,last_name
        ,email
      FROM
        users;
    `,
      { commaPosition: 'trailing' }
    );
    expect(result).toBe(dedent`
      SELECT
        id, -- comment 1
        first_name -- comment 2
        /* block comment */,
        last_name,
        email
      FROM
        users;
      `);
  });
}
