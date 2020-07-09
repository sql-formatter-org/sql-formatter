const path = require('path');

module.exports = {
  entry: './src/sqlFormatter.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'sql-formatter.js',
    library: 'sqlFormatter',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/u,
        exclude: /node_modules/u,
        use: ['babel-loader'],
      },
    ],
  },
};
