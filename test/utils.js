import { test } from '@jest/globals';

export const itIf = condition => (condition ? test : test.skip);

export default {};
