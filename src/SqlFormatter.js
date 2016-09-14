import "babel-polyfill";
import N1qlFormatter from "./languages/N1qlFormatter";
import StandardSqlFormatter from "./languages/StandardSqlFormatter";

export default class SqlFormatter {
    /**
     * @param {Object} cfg
     *  @param {String} cfg.indent Characters used for indentation, default is " " (2 spaces)
     */
    constructor(cfg = {}) {
        this.cfg = cfg;
    }

    /**
     * Format whitespaces in a query to make it easier to read.
     * Throws error when given language is not supported.
     *
     * @param {String} language Query language
     * @param {String} query
     * @return {String}
     */
    format(language, query) {
        switch (language) {
            case "n1ql":
                return new N1qlFormatter(this.cfg).format(query);
            case "sql":
                return new StandardSqlFormatter(this.cfg).format(query);
            default:
                throw "Unsupported language";
        }
    }
}
