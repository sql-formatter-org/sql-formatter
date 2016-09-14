const webpackConfig = require("./webpack.config.js");

webpackConfig.plugins = [];
webpackConfig.devtool = "inline-source-map";

module.exports = function(config) {
    config.set({
        frameworks: ["jasmine"],
        browsers: ["PhantomJS"],
        files: ["test/**/*Test.js"],
        preprocessors: {
            "test/**/*Test.js": ["webpack", "sourcemap"]
        },
        reporters: [
            "progress",
            "coverage",
            "jasmine-diff"
        ],
        singleRun: true,

        webpack: webpackConfig,
        // keeps webpack from spamming the console, shows only warnings and errors
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            reporters: [
                {type: "html", dir: "coverage/", subdir: "html"},
                {type: "lcov", dir: "coverage/", subdir: "lcov"}
            ]
        },
        jasmineDiffReporter: {
            pretty: 4 // Indent the data structure with 4-space steps
        }
    });
};
