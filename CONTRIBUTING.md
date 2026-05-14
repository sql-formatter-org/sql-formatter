# Development

First consider if you might instead want to contribute to [prettier-plugin-sql-cst][] instead,
as SQL Formatter is mostly in maintenance mode.

## Setup

Run `pnpm install` after checkout to install all dependencies.

## Tests

Tests can be run with `pnpm test`.

Please add new tests for any new features and bug fixes.
Language-specific tests should be included in their respective `sqldialect.test.ts` files.
Tests that apply to all languages should be in `behavesLikeSqlFormatter.ts`.

## Publish Flow

For those who have admin access on the repo, the new release publish flow is as such:

- `pnpm run release` (bumps version, git tag, git release, npm release).
- `git subtree push --prefix static origin gh-pages` (pushes demo page to GH pages)

[prettier-plugin-sql-cst]: https://github.com/nene/prettier-plugin-sql-cst
