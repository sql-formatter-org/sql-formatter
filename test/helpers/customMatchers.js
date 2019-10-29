const dedent = require('dedent');
const { matcherHint, printReceived, printExpected } = require('jest-matcher-utils');
const diff = require('jest-diff');

const multilineMessage = (pass, received, expected, name, field) =>
  pass
    ? () =>
        dedent(`
          ${matcherHint(`.not.${name}`)}

          Expected ${field} to not equal:
            ${printExpected(expected)}\n
          Received:
            ${printReceived(received)}
        `)
    : () => {
        const diffString = diff(expected, received);
        return dedent(`
          ${matcherHint(`.not.${name}`)}

          Expected ${field} to not equal:
            ${printExpected(expected)}\n
          Received:
            ${printReceived(received)}${diffString ? `\n\nDifference:\n\n${diffString}` : ''}
        `);
      };

const toEqualMultiline = (received, expected) => {
  expected = dedent(expected);
  const pass = received === expected;
  const message = multilineMessage(pass, received, expected, 'toEqualMultiline', 'value');
  return { actual: received, expected, message, name: 'toEqualMultiline', pass };
};

expect.extend({
  toEqualMultiline
});
