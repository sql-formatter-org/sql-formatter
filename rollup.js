import nodeResolve from 'rollup-plugin-node-resolve';

import buble from 'rollup-plugin-buble';

import { uglify } from 'rollup-plugin-uglify';

// plugins should not be shared
// https://github.com/rollup/rollup/issues/703#issuecomment-306246339
function plugins (forProduction) {
	return [
		buble (),
		nodeResolve({ jsnext: true, module: true })
	];
}

function output () {
	return {
		format: 'iife',
		sourcemap: true,
		globals: {
		}
	};
}

function external () {
	return [
	];
}

export default [{
	// regular build
	input: 'src/sqlFormatter.js',

	plugins: plugins(),
	output: Object.assign ({
		file: 'dist/sql-formatter.js',
		name: 'sqlFormatter',
	}, output()),
	external: external()
}, {
	// minified build
	input: 'src/sqlFormatter.js',

	plugins: plugins().concat(uglify({
		compress: {
			pure_getters: true,
			unsafe: true,
			unsafe_comps: true,
			warnings: false
		}
	})),
	output: Object.assign ({
		file: 'dist/sql-formatter.min.js',
		name: 'sqlFormatter',
	}, output()),
	external: external()

}]
