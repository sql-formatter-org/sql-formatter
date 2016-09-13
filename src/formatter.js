import n1qlFormatter from "./languages/n1qlFormatter";
import standardSqlFormatter from "./languages/standardSqlFormatter";

export default {
    /**
     * Format whitespaces in a query to make it easier to read.
     * Returns unformatted query when given language is not supported.
     *
     * @param {String} language Query language
     * @param {String} query
     * @return {String}
     */
    format: (language, query) => {
        switch (language) {
            case "n1ql":
                return n1qlFormatter.format(query);
            case "cassandra":
            case "sql":
                return standardSqlFormatter.format(query);
            default:
                throw "Unsupported language";
        }
    }
};
