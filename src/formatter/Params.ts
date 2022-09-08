export type ParamItems = { [k: string]: string };

/**
 * Handles placeholder replacement with given params.
 */
export default class Params {
  private params: ParamItems | string[] | undefined;
  private index: number;

  constructor(params: ParamItems | string[] | undefined) {
    this.params = params;
    this.index = 0;
  }

  /**
   * Returns param value that matches given placeholder with param key.
   */
  public get({ key, text }: { key?: string; text: string }): string {
    if (!this.params) {
      return text;
    }

    if (key) {
      return (this.params as ParamItems)[key];
    }
    return (this.params as string[])[this.index++];
  }

  /**
   * Returns index of current positional parameter.
   */
  public getPositionalParameterIndex(): number {
    return this.index;
  }

  /**
   * Sets index of current positional parameter.
   */
  public setPositionalParameterIndex(i: number) {
    this.index = i;
  }
}
