import Db2Formatter from "./languages/Db2Formatter.js";
import N1qlFormatter from "./languages/N1qlFormatter.js";
import PlSqlFormatter from "./languages/PlSqlFormatter.js";
import StandardSqlFormatter from "./languages/StandardSqlFormatter.js";

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
            case "pl/sql":
                return new PlSqlFormatter(cfg).format(query);
            case "sql":
            case undefined:
                return new StandardSqlFormatter(cfg).format(query);
            default:
                throw Error(`Unsupported SQL dialect: ${cfg.language}`);
        }
    }
};
