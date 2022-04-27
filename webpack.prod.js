const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	output: {
		filename: 'prettier-sql.min.js',
	},
});
