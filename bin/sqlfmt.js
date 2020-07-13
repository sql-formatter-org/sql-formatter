#!/usr/bin/env node

'use strict';

const { format, FORMATTERS } = require('../lib/sqlFormatter');
const fs = require('fs');
const { version } = require('../package.json');
const { ArgumentParser } = require('argparse');

const formatterKeys = Object.keys(FORMATTERS);

function getArgs() {
  const parser = new ArgumentParser({
    version,
    addHelp: true,
    description: 'SQL Formatter',
  });

  parser.addArgument(['-f', '--file'], {
    help: 'Input SQL file (defaults to stdin)',
  });
  parser.addArgument(['-o', '--output'], {
    help: 'File to write SQL output (defaults to stdout)',
  });

  parser.addArgument(['-l', '--language'], {
    help: 'SQL Formatter dialect (defaults to basic sql)',
    choices: formatterKeys,
    defaultValue: 'sql',
  });

  const indentationGroup = parser.addMutuallyExclusiveGroup();
  indentationGroup.addArgument(['-i', '--indent'], {
    help: 'Number of spaces to indent query blocks (defaults to 2)',
    metavar: 'N',
    type: 'int',
    defaultValue: 2,
  });
  indentationGroup.addArgument(['-t', '--tab-indent'], {
    help: 'Indent query blocks with tabs instead of spaces',
    action: 'storeTrue',
  });

  parser.addArgument(['-u', '--uppercase'], {
    help: 'Capitalize language keywords',
    action: 'storeTrue',
  });

  parser.addArgument(['--lines-between-queries'], {
    help: 'How many newlines to insert between queries (separated by ";")',
    metavar: 'N',
    type: 'int',
    default: 1,
  });

  return parser.parseArgs();
}

function configFromArgs(args) {
  return {
    langauge: args.langauge,
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
  if (file === null) {
    // No output file, write to console
    console.log(query);
  } else {
    fs.writeFileSync(file, query);
  }
}

const args = getArgs();
const cfg = configFromArgs(args);
const query = getInput(args.file);
const formattedQuery = format(query, cfg);
writeOutput(args.output, formattedQuery);
