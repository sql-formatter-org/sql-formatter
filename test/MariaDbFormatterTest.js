import * as sqlFormatter from '../src/sqlFormatter.ts';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

describe('MariaDbFormatter', () => {
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'mariadb' });

	behavesLikeMariaDbFormatter(format);
});
