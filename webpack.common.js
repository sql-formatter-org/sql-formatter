import path from 'path';

export default {
  entry: './src/index.ts',
  output: {
    path: path.resolve('./dist'),
    filename: 'sql-formatter.js',
    library: { type: 'module' },
    module: true,
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      src: path.resolve('./src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/u,
        exclude: /node_modules/u,
        use: ['babel-loader', 'ts-loader'],
      },
      {
        test: /\.js$/u,
        exclude: /node_modules/u,
        use: ['babel-loader'],
      },
    ],
  },
};
