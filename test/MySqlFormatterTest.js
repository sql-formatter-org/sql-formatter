import * as sqlFormatter from '../src/sqlFormatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

describe('MySqlFormatter', () => {
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'mysql' });

  behavesLikeMariaDbFormatter(format);

  it('supports additional MySQL operators', () => {
    expect(format('foo -> bar')).toBe('foo -> bar');
    expect(format('foo ->> bar')).toBe('foo ->> bar');
  });
});
