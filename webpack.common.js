import path from 'path';

export default {
  entry: './src/index.ts',
  output: {
    path: path.join('', 'dist'),
    filename: 'sql-formatter.js',
    library: 'sqlFormatter',
    libraryTarget: 'esm',
  },
  resolve: {
    extensions: ['.js', '.ts'],
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
