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
  },
  module: {
    rules: [
      {
        test: /\.ts$/u,
        exclude: /node_modules/u,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              // Prevent `ts-loader` from emitting types to the `lib` directory.
              // This also disables type-checking, which is already performed
              // independently of the webpack build process.
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.js$/u,
        exclude: /node_modules/u,
        use: ['babel-loader'],
      },
    ],
  },
};
