import dedent from 'dedent-js';
import pc from 'picocolors';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsColors(format: FormatFn) {
  const testColors = {
    keyword: pc.bgBlue,
    operator: pc.bgCyan,
    comment: pc.bgGreen,
    parenthesis: pc.bgMagenta,
    identifier: pc.bgRed,
    function: pc.bgYellow,
    string: pc.blue,
    number: pc.cyan,
    dataType: pc.green,
  };

  it('check color for correctness', () => {
    const result = format(
      `SELECT
        /*
        * This is a block comment
        */
        *, test as col,
        MiN(price) AS min_price, Cast(item_code AS INT),
        FROM
        -- This is another comment
        MyTable -- One final comment
        WHERE 1 = "321" AND 1 = '321';
        CREATE TABLE users ( user_id iNt PRIMARY KEY, total_earnings Decimal(5, 2) NOT NULL );
      `,
      {
        colors: true,
        colorsMap: testColors,
      }
    );
    expect(result).toBe(dedent`
      \x1B[44mSELECT\x1B[49m
        \x1B[42m/*\x1B[49m
        \x1B[42m * This is a block comment\x1B[49m
        \x1B[42m */\x1B[49m
        *,
        \x1B[41mtest\x1B[49m \x1B[44mas\x1B[49m \x1B[41mcol\x1B[49m,
        \x1B[43mMiN\x1B[49m\x1B[45m(\x1B[49m\x1B[41mprice\x1B[49m\x1B[45m)\x1B[49m \x1B[44mAS\x1B[49m \x1B[41mmin_price\x1B[49m,
        \x1B[43mCast\x1B[49m\x1B[45m(\x1B[49m\x1B[41mitem_code\x1B[49m \x1B[44mAS\x1B[49m \x1B[32mINT\x1B[39m\x1B[45m)\x1B[49m,
      \x1B[44mFROM\x1B[49m
        \x1B[42m-- This is another comment\x1B[49m
        \x1B[41mMyTable\x1B[49m \x1B[42m-- One final comment\x1B[49m
      \x1B[44mWHERE\x1B[49m
        \x1B[36m1\x1B[39m = \x1B[41m"321"\x1B[49m
        \x1B[44mAND\x1B[49m \x1B[36m1\x1B[39m = \x1B[34m'321'\x1B[39m;

      \x1B[44mCREATE TABLE\x1B[49m \x1B[41musers\x1B[49m \x1B[45m(\x1B[49m
        \x1B[41muser_id\x1B[49m \x1B[32miNt\x1B[39m \x1B[44mPRIMARY\x1B[49m \x1B[44mKEY\x1B[49m,
        \x1B[41mtotal_earnings\x1B[49m \x1B[32mDecimal\x1B[39m\x1B[45m(\x1B[49m\x1B[36m5\x1B[39m, \x1B[36m2\x1B[39m\x1B[45m)\x1B[49m \x1B[44mNOT\x1B[49m \x1B[44mNULL\x1B[49m
      \x1B[45m)\x1B[49m;
    `);
  });
}
