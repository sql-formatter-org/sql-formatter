import sqlFormatter from "../src/sqlFormatter";
import testStandardSqlFormatter from "./languages/testStandardSqlFormatter";
import testN1qlFormatter from "./languages/testN1qlFormatter";

testStandardSqlFormatter(sqlFormatter);
testN1qlFormatter(sqlFormatter);
