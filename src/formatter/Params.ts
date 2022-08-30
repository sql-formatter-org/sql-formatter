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
   */
  get({ key, text }: { key?: string; text: string }): string {
    if (!this.params) {
      return text;
    }

    if (key) {
      return (this.params as ParamItems)[key];
    }
    return (this.params as string[])[this.index++];
  }
}
