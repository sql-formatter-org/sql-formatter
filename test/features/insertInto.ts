import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

interface InsertIntoConfig {
  withoutInto?: boolean;
  withOverwrite?: boolean;
}

export default function supportsInsertInto(
  format: FormatFn,
  { withoutInto, withOverwrite }: InsertIntoConfig = {}
) {
  it('formats simple INSERT INTO', () => {
    const result = format(
      "INSERT INTO Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
    );
    expect(result).toBe(dedent`
      INSERT INTO
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
  });

  if (withoutInto) {
    it('formats INSERT without INTO', () => {
      const result = format(
        "INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
      );
      expect(result).toBe(dedent`
        INSERT
          Customers (ID, MoneyBalance, Address, City)
        VALUES
          (12, -123.4, 'Skagen 2111', 'Stv');
      `);
    });
  }

  if (withOverwrite) {
    it('formats INSERT with OVERWRITE', () => {
      const result = format(
        "INSERT OVERWRITE INTO Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
      );
      expect(result).toBe(dedent`
        INSERT OVERWRITE INTO
          Customers (ID, MoneyBalance, Address, City)
        VALUES
          (12, -123.4, 'Skagen 2111', 'Stv');
      `);
    });
  }
}
