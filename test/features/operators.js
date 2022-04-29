import dedent from 'dedent-js';

export default function supportsOperators(language, format, operators = [], logicalOperators = []) {
  operators.forEach(op => {
    it(`supports ${op} operator`, () => {
      expect(format(`foo${op}bar`)).toBe(`foo ${op} bar`);
    });
  });

  operators.forEach(op => {
    it(`supports ${op} operator in dense mode`, () => {
      expect(format(`foo ${op} bar`, { denseOperators: true })).toBe(`foo${op}bar`);
    });
  });

  logicalOperators.forEach(op => {
    describe(`supports ${op} operator`, () => {
      const result = format(`SELECT true ${op} false AS foo;`);
      expect(result).toBe(dedent`
        SELECT
          true
          ${op} false AS foo;
      `);
    });
  });

  it('supports logical operators', () => {
    const result = format(`
      SELECT a FROM b WHERE TRUE ${logicalOperators.reduce(
        (str, op, i) => str + ` ${op} condition${i + 1}`,
        ''
      )};
    `);
    expect(result).toBe(dedent`
      SELECT
        a
      FROM
        b
      WHERE
        TRUE
      ${logicalOperators.map((op, i) => `  ${op} condition${i + 1}`).join('\n')};
    `);
  });

  it('supports breaking after boolean operators', () => {
    const result = format(
      `
      SELECT a FROM b WHERE TRUE ${logicalOperators.reduce(
        (str, op, i) => str + ` ${op} condition${i + 1}`,
        ''
      )};
    `,
      { breakBeforeBooleanOperator: false }
    );
    expect(result).toBe(dedent`
      SELECT
        a
      FROM
        b
      WHERE
        TRUE ${logicalOperators.map((op, i) => `${op}\n  condition${i + 1}`).join(' ')};
    `);
  });

  it('supports backticks', () => {
    const result = format(`SELECT \`a\`.\`b\` FROM \`c\`.\`d\`;`);
    expect(result).toBe(dedent`
      SELECT
        \`a\`.\`b\`
      FROM
        \`c\`.\`d\`;
    `);
  });

  it('supports braces', () => {
    const result = format(`SELECT $\{a} FROM $\{b};`);
    expect(result).toBe(dedent`
      SELECT
        $\{a}
      FROM
        $\{b};
    `);
  });
}
