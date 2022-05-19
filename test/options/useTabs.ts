import { FormatFn } from '../../src/sqlFormatter';

export default function supportsUseTabs(format: FormatFn) {
  it('supports indenting with tabs', () => {
    const result = format('SELECT count(*),Column1 FROM Table1;', {
      useTabs: true,
    });

    expect(result).toBe(['SELECT', '\tcount(*),', '\tColumn1', 'FROM', '\tTable1;'].join('\n'));
  });

  it('ignores tabWidth when useTabs is enabled', () => {
    const result = format('SELECT count(*),Column1 FROM Table1;', {
      useTabs: true,
      tabWidth: 10,
    });

    expect(result).toBe(['SELECT', '\tcount(*),', '\tColumn1', 'FROM', '\tTable1;'].join('\n'));
  });
}
