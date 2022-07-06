# README

## Importing SQL files

SQL files can be imported into test files as text files, allowing them to be used as raw strings to check formatting.

Example:

```ts
import testSql from './test.sql';
```

or using the `fs` library:

```ts
const testSql = fs.readFileSync('test/test.sql', 'utf8');
```
