import dedent from 'dedent-js';

export default function supportsSchema(language, format) {
  it('formats simple SET SCHEMA statements', () => {
    const result = format('SET SCHEMA schema1;');
    expect(result).toBe(dedent`
      SET SCHEMA
        schema1;
    `);
  });
}
