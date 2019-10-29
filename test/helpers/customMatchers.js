const dedent = require('dedent');
const { matcherHint, printReceived, printExpected } = require('jest-matcher-utils');
const diff = require('jest-diff');

const multilineMessage = (pass, received, expected, name, field) =>
  pass
    ? () =>
        `${matcherHint(`.not.${name}`)}\n\n` +
        `Expected ${field} to not equal:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(received)}`
    : () => {
        const diffString = diff(expected, received);
        return (
          `${matcherHint(`.${name}`)}\n\n` +
          `Expected ${field} to equal:\n` +
          `  ${printExpected(expected)}\n` +
          `Received:\n` +
          `  ${printReceived(received)}${diffString ? `\n\nDifference:\n\n${diffString}` : ``}`
        );
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
