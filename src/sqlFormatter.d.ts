export interface FormatOptions {
  language?:
    | 'db2'
    | 'mariadb'
    | 'mysql'
    | 'n1ql'
    | 'plsql'
    | 'postgresql'
    | 'redshift'
    | 'spark'
    | 'sql'
    | 'tsql';
  params?: { [x: string]: string } | string[];
  indent?: string;
  uppercase?: boolean;
  linesBetweenQueries?: number;
  indentQuerySeparator: boolean;
}

export function format(sql: string, options?: FormatOptions): string;
