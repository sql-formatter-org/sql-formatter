# denseOperators

Decides whitespace around operators.

## Options

- `false` (default) surrounds operators with spaces.
- `true` packs operators densely without spaces.

Does not apply to logical operators (AND, OR, XOR).

### denseOperators: false (default)

```
SELECT
  price + (price * tax) AS bruto
FROM
  prices
```

### denseOperators: true

```
SELECT
  price+(price*tax) AS bruto
FROM
  prices
```
