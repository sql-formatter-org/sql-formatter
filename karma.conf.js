const webpackConfig = require("./webpack.config.js");

webpackConfig.plugins = [];
webpackConfig.devtool = "inline-source-map";

webpackConfig.module.loaders = webpackConfig.module.loaders.map(loaderWrapper => {
    if (loaderWrapper.loader.includes("babel")) {
        loaderWrapper.loader = "babel?cacheDirectory&plugins[]=rewire";
    }
    return loaderWrapper;
});

module.exports = function(config) {
    config.set({
        frameworks: ["jasmine"],
        browsers: ["PhantomJS"],
        files: ["test/**/*Test.js"],
        preprocessors: {"test/**/*Test.js": ["webpack", "sourcemap"]},
        reporters: ["progress", "jasmine-diff"],
        singleRun: true,

        webpack: webpackConfig,
        // keeps webpack from spamming the console, shows only warnings and errors
        webpackMiddleware: {
            noInfo: true
        },
        jasmineDiffReporter: {
            pretty: 4 // Indent the data structure with 4-space steps
        }
    });
};
