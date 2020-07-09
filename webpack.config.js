const path = require('path');

const config = {
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

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.output.filename = 'sql-formatter.min.js';
  }
  return config;
};
