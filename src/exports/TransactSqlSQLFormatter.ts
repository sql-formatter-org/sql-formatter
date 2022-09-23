import { format as baseFormat } from 'src/sqlFormatter';
import type { FormatOptions } from 'src/FormatOptions';

export const format = (query: string, options: Exclude<FormatOptions, 'language'>) =>
  baseFormat(query, { ...options, language: 'transactsql' });
