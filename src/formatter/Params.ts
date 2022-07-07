import { type Token } from '../lexer/token';

export type ParamItems = { [k: string]: string };

/**
 * Handles placeholder replacement with given params.
 */
export default class Params {
  /**
   * @param {ParamItems} params
   */
  params: ParamItems | string[] | undefined;
  index: number;

  constructor(params: ParamItems | string[] | undefined) {
    this.params = params;
    this.index = 0;
  }

  /**
   * Returns param value that matches given placeholder with param key.
   * @param {Token} token
   * @return {string} param or token.value when params are missing
   */
  get({ key, value }: Token): string {
    if (!this.params) {
      return value;
    }

    if (key) {
      return (this.params as ParamItems)[key];
    }
    return (this.params as string[])[this.index++];
  }
}
