import Db2Formatter from "./languages/Db2Formatter";
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
     *  @param {Object} cfg.params Collection of params for placeholder replacement
     * @return {String}
     */
    format: (query, cfg) => {
        cfg = cfg || {};

        switch (cfg.language) {
            case "db2":
                return new Db2Formatter(cfg).format(query);
            case "n1ql":
                return new N1qlFormatter(cfg).format(query);
            default:
                return new StandardSqlFormatter(cfg).format(query);
        }
    }
};
