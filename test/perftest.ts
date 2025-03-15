import { format } from '../src/sqlFormatter.js';

const BASELINE = 300;

describe('Performance test', () => {
  it('uses about 300 MB of memory to format empty query', () => {
    format('', { language: 'sql' });

    expect(memoryUsageInMB()).toBeLessThan(BASELINE);
  });

  // Issue #840
  it.skip('should use less than 100 MB of additional memory to format ~100 KB of SQL', () => {
    // Long list of values
    const values = Array(10000).fill('myid');
    const sql = `SELECT ${values.join(', ')}`;
    expect(sql.length).toBeGreaterThan(50000);
    expect(sql.length).toBeLessThan(100000);

    format(sql, { language: 'sql' });

    expect(memoryUsageInMB()).toBeLessThan(BASELINE + 100);
  });
});

function memoryUsageInMB() {
  return Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
}
