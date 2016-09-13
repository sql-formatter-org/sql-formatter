const webpack = require("webpack");

const config = {
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/
        }]
    },
    output: {
        library: "sqlFormatter",
        libraryTarget: "umd"
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
    ]
};

if (process.env.NODE_ENV === "production") {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            }
        })
    );
}

module.exports = config;
