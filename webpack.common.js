const path = require('path');

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'prettier-sql.js',
		library: 'prettierSql',
		libraryTarget: 'umd',
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
