import path from 'path';

export default {
  entry: './src/index.ts',
  output: {
    path: path.resolve('./dist'),
    filename: 'sql-formatter.cjs',
    library: 'sqlFormatter',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.js', '.ts'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
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
