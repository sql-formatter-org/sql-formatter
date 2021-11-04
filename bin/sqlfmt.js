#!/usr/bin/env node

'use strict';

const { format, supportedDialects } = require('../lib/sqlFormatter');
const fs = require('fs');
const { version } = require('../package.json');
const { ArgumentParser } = require('argparse');

function getArgs() {
	const parser = new ArgumentParser({
		add_help: true,
		description: 'SQL Formatter',
	});

	parser.add_argument('file', {
		metavar: 'FILE',
		nargs: '?',
		help: 'Input SQL file (defaults to stdin)',
	});

	parser.add_argument('-o', '--output', {
		help: 'File to write SQL output (defaults to stdout)',
	});

	parser.add_argument('-l', '--language', {
		help: 'SQL Formatter dialect (defaults to basic sql)',
		choices: supportedDialects,
		default: 'sql',
	});

	parser.add_argument('-c', '--config', {
		help: 'Path to config json file (will use default configs if unspecified)',
	});

	parser.add_argument('--version', {
		action: 'version',
		version,
	});

	return parser.parse_args();
}

function readConfig(args) {
	if (args.config)
		try {
			const configFile = fs.readFileSync(args.config);
			const configJson = JSON.parse(configFile);
			return { language: args.language, ...configJson };
		} catch (e) {
			if (e instanceof SyntaxError) {
				console.error(`Error: unable to parse JSON at file ${args.config}`);
				process.exit(1);
			}
			if (e.code === 'ENOENT') {
				console.error(`Error: could not open file ${args.config}`);
				process.exit(1);
			}
			throw e;
		}
	return {
		language: args.language,
	};
}

function getInput(file) {
	const infile = file || process.stdin.fd;
	try {
		return fs.readFileSync(infile, 'utf-8');
	} catch (e) {
		if (e.code === 'EAGAIN') {
			console.error('Error: no file specified and no data in stdin');
			process.exit(1);
		}
		if (e.code === 'ENOENT') {
			console.error(`Error: could not open file ${infile}`);
			process.exit(1);
		}
		throw e;
	}
}

function writeOutput(file, query) {
	if (!file) {
		// No output file, write to console
		console.log(query);
	} else {
		fs.writeFileSync(file, query);
	}
}

const args = getArgs();
const cfg = readConfig(args);
const query = getInput(args.file);
const formattedQuery = format(query, cfg).trim() + '\n';
writeOutput(args.output, formattedQuery);
