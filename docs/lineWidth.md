# lineWidth

Determines maximum length of parenthesized expressions.

## Option value

A number (default `50`) specifying the maximum length of parenthesized expression
that's does not get split up to multiple lines.

Note: `lineWidth` also effects formatting of comma-separated lists when `newline: "lineWidth"` used.

### lineWidth: 50 (default)

Keeps the parenthesized expression (with length of 42) on single line:

```
SELECT
  product.price + (product.original_price * product.sales_tax) AS total
FROM
  product
```

### lineWidth: 40

Splits the parenthesized expression (with length of 42) to multiple lines:

```
SELECT
  product.price + (
    product.original_price * product.sales_tax
  ) AS total
FROM
  product
```
