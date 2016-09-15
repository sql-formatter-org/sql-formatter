import "babel-polyfill";
import N1qlFormatter from "./languages/N1qlFormatter";
import StandardSqlFormatter from "./languages/StandardSqlFormatter";

export default {
    /**
     * Format whitespaces in a query to make it easier to read.
     *
     * @param {String} query
     * @param {Object} cfg
     *  @param {String} cfg.language Query language, default is Standard SQL
     *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
     * @return {String}
     */
    format: (query, cfg) => {
        cfg = cfg || {};

        switch (cfg.language) {
            case "n1ql":
                return new N1qlFormatter(cfg).format(query);
            default:
                return new StandardSqlFormatter(cfg).format(query);
        }
    }
};
