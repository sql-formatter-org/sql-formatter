const webpack = require('webpack');

const config = {
  module: {
    rules: [
      {
        test: /\.js$/u,
        exclude: /node_modules/u,
        use: ['babel-loader']
      }
    ]
  },
  output: {
    library: 'sqlFormatter',
    libraryTarget: 'umd'
  },
  plugins: [new webpack.optimize.OccurrenceOrderPlugin()]
};

if (process.env.NODE_ENV === 'production') {
  config.optimization = { minimize: true };
}

module.exports = config;
