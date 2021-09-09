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

  const indentationGroup = parser.add_mutually_exclusive_group();
  indentationGroup.add_argument('-i', '--indent', {
    help: 'Number of spaces to indent query blocks (defaults to 2)',
    metavar: 'N',
    type: 'int',
    default: 2,
  });
  indentationGroup.add_argument('-t', '--tab-indent', {
    help: 'Indent query blocks with tabs instead of spaces',
    action: 'store_true',
  });

  parser.add_argument('-u', '--uppercase', {
    help: 'Capitalize language keywords',
    action: 'store_true',
  });

  parser.add_argument('--lines-between-queries', {
    help: 'How many newlines to insert between queries (separated by ";")',
    metavar: 'N',
    type: 'int',
    default: 1,
  });

  parser.add_argument('--version', {
    action: 'version',
    version,
  });

  return parser.parse_args();
}

function configFromArgs(args) {
  return {
    language: args.language,
    indent: args.tab_indent ? '\t' : ' '.repeat(args.indent),
    uppercase: args.uppercase,
    linesBetweenQueries: args.lines_between_queries,
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
const cfg = configFromArgs(args);
const query = getInput(args.file);
const formattedQuery = format(query, cfg).trim() + '\n';
writeOutput(args.output, formattedQuery);
