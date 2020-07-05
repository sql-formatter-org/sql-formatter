module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/u,
        exclude: /node_modules/u,
        use: ['babel-loader'],
      },
    ],
  },
  output: {
    library: 'sqlFormatter',
    libraryTarget: 'umd',
  },
};
