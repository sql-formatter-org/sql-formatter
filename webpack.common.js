const path = require('path');

module.exports = {
	entry: './src/sqlFormatter.ts',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'sql-formatter.js',
		library: 'sqlFormatter',
		libraryTarget: 'umd',
	},
	resolve: {
		extension: ['.js', '.ts'],
	},
	module: {
		rules: [
			{
				test: /\.(js|ts)$/u,
				exclude: /node_modules/u,
				use: ['babel-loader'],
			},
		],
	},
};
