import toTabularFormat from 'src/formatter/tabularStyle.js';

describe('toTabularFormat()', () => {
  it('does nothing in standard style', () => {
    expect(toTabularFormat('FROM', 'standard')).toBe('FROM');
    expect(toTabularFormat('INNER JOIN', 'standard')).toBe('INNER JOIN');
    expect(toTabularFormat('INSERT INTO', 'standard')).toBe('INSERT INTO');
  });

  it('formats in tabularLeft style', () => {
    expect(toTabularFormat('FROM', 'tabularLeft')).toBe('FROM     ');
    expect(toTabularFormat('INNER JOIN', 'tabularLeft')).toBe('INNER     JOIN');
    expect(toTabularFormat('INSERT INTO', 'tabularLeft')).toBe('INSERT    INTO');
  });

  it('formats in tabularRight style', () => {
    expect(toTabularFormat('FROM', 'tabularRight')).toBe('     FROM');
    expect(toTabularFormat('INNER JOIN', 'tabularRight')).toBe('    INNER JOIN');
    expect(toTabularFormat('INSERT INTO', 'tabularRight')).toBe('   INSERT INTO');
  });
});
