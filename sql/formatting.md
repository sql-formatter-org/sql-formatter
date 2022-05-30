# SQL formatting

## SQL formatting standards

Links to recources describing how to format SQL.

- [StackOverflow: SQL Formatting standards](https://stackoverflow.com/questions/519876/sql-formatting-standards)
- [StackOverflow: What SQL coding standard do you follow?](https://stackoverflow.com/questions/522356/what-sql-coding-standard-do-you-follow)
- [StackOverflow: SQL Statement indentation good practice](https://stackoverflow.com/questions/272210/sql-statement-indentation-good-practice)
- [How to indent SQL? The definitive guide to simple and effective indentation](https://www.linkedin.com/pulse/how-indent-sql-definitive-guide-simple-effective-gianni-tommasi/)
- [24 Rules to the SQL Formatting Standard](https://learnsql.com/blog/24-rules-sql-code-formatting-standard/)
- [How to Properly Format SQL Code](https://dzone.com/articles/24-rules-to-the-sql-formatting-standard)
- [SQL style guide by Simon Holywell](https://www.sqlstyle.guide/)
- [Transact-SQL Formatting Standards](https://www.red-gate.com/simple-talk/databases/sql-server/t-sql-programming-sql-server/transact-sql-formatting-standards-coding-styles/)

## Tools

Other tools that perform SQL formatting.

- [sqlparse](https://sqlformat.org/) Python library and online formatter.\
  (This one is really quite bad. The style is a bit like our tabularLeft, but with variable indentation.
  The formatting of CREATE TABLE is exceptionally bad.)
- [Instant SQL formatter](https://www.dpriver.com/pp/sqlformat.htm) online tool and VS plugin.\
  Uses tabularLeft & tabularRight styles, but with 7 instead of 10 spaces.
- [Freeformatter.com](https://www.freeformatter.com/sql-formatter.html) a site with online formatters for many languages.\
  Uses our standard style.
- [Code Beautify](https://codebeautify.org/sqlformatter) another site with multiple formatters.\
  Uses our standard style.
- [SQL Complete](https://www.devart.com/dbforge/sql/sqlcomplete/) a proprietary tool from Devart. [Online version](https://sql-format.com/)\
  By default uses a compact version of our standard style, but has huge amount of configuration options.
- [SQL Formatter](https://www.apexsql.com/sql-tools-refactor.aspx) a proprietary tool from ApexSQL.
- [SQLinForm](https://www.sqlinform.com/) a proprietary tool (also free versions available)
- [SQL Pretty Printer](https://www.dpriver.com/) a proprietary tool.
- [SQL Fluff](https://docs.sqlfluff.com/en/stable/index.html) A linter for SQL (also has formatting rules).
- [SQL Prompt](https://www.red-gate.com/website/sql-formatter) A proprietary tool, has an online demo of the formatter.\
  Supports multiple distinct styles of formatting.

Here's some example SQL to test out various formatters:

```sql
SELECT
  supplier_name, city -- inline comment
  ,(select count(*) from people where supplier_id = s.id) as sup_count
FROM suppliers s left join addresses a on s.address_id=a.id
WHERE s.value>500 and a.city = 'New York'
ORDER BY supplier_name asc,city desc;

/* another comment in here */
INSERT INTO articles
(title, author, submission_date)
VALUES ('Learn SQL', 'John Doe', now());

UPDATE articles
SET author = 'Peter', submission_date = '2022-01-01'
WHERE title like '%by Peter';

CREATE TABLE articles (
  id int not null auto_increment,
  title varchar(100) not null,
  author varchar(40) not null,
  submission_date date,
  primary key ( id )
);
```
