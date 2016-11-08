import tokenTypes from "./tokenTypes";

/**
 * Handles placeholder replacement with given params.
 */
export default class Params {
    /**
     * @param {Object} params
     */
    constructor(params) {
        this.params = params;
        this.index = 0;
    }

    /**
     * Returns param value that matches given placeholder with param key.
     * @param {Object} token
     *   @param {String} type Option from tokenTypes
     *   @param {String} value Placeholder value
     * @return {String} param
     */
    get({type, value}) {
        if (!this.params) {
            return value;
        }
        const key = type === tokenTypes.PLACEHOLDER_STRING ?
            value.substring(2).slice(0, -1) :
            value.substring(1);

        if (key) {
            return this.params[key];
        }
        return this.params[this.index ++];
    }
}
