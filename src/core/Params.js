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
     * @param {String} placeholder
     * @return {String} param
     */
    get(placeholder) {
        if (!this.params) {
            return placeholder;
        }
        const matches = placeholder.match(/\w+(\s+\w+)*/);

        if (matches) {
            return this.params[matches[0]];
        }
        return this.params[this.index ++];
    }
}
