import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsSchema(format: FormatFn, setKeyword = 'SET') {
  it(`formats simple ${setKeyword} SCHEMA statements`, () => {
    const result = format(`${setKeyword} SCHEMA schema1;`);
    expect(result).toBe(dedent`
      ${setKeyword} SCHEMA
        schema1;
    `);
  });
}
