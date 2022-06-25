import * as moo from 'moo';

import { Token, TokenType } from 'src/core/token';
import * as regex from 'src/lexer/regexFactory';
import * as regexTypes from 'src/lexer/regexTypes';
import { NULL_REGEX, escapeRegExp } from './regexUtil';

interface TokenizerOptions {
  // Main clauses that start new block, like: SELECT, FROM, WHERE, ORDER BY
  reservedCommands: string[];
  // Logical operator keywords, defaults to: [AND, OR]
  reservedLogicalOperators?: string[];
  // Keywords in CASE expressions that begin new line, like: WHEN, ELSE
  reservedDependentClauses: string[];
  // Keywords that create newline but no indentaion of their body.
  // These contain set operations like UNION and various joins like LEFT OUTER JOIN
  reservedBinaryCommands: string[];
  // keywords used for JOIN conditions, defaults to: [ON, USING]
  reservedJoinConditions?: string[];
  // all other reserved words (not included to any of the above lists)
  reservedKeywords: string[];
  // Types of quotes to use for strings
  stringTypes: regexTypes.QuoteType[];
  // Types of quotes to use for quoted identifiers
  identTypes: regexTypes.QuoteType[];
  // Types of quotes to use for variables
  variableTypes?: regexTypes.VariableType[];
  // Open-parenthesis characters, like: (, [, {
  blockStart?: string[];
  // Close-parenthesis characters, like: ), ], }
  blockEnd?: string[];
  // True to allow for positional "?" parameter placeholders
  positionalParams?: boolean;
  // Prefixes for numbered parameter placeholders to support, e.g. :1, :2, :3
  numberedParamTypes?: ('?' | ':' | '$')[];
  // Prefixes for named parameter placeholders to support, e.g. :name
  namedParamTypes?: (':' | '@' | '$')[];
  // Prefixes for quoted parameter placeholders to support, e.g. :"name"
  // The type of quotes will depend on `identifierTypes` option.
  quotedParamTypes?: (':' | '@' | '$')[];
  // Line comment types to support, defaults to --
  lineCommentTypes?: string[];
  // Additional characters to support in identifiers
  identChars?: regexTypes.IdentChars;
  // Additional characters to support in named parameters
  // Use this when parameters allow different characters from identifiers
  // Defaults to `identChars`.
  paramChars?: regexTypes.IdentChars;
  // Additional multi-character operators to support, in addition to <=, >=, <>, !=
  operators?: string[];
  // Allows custom modifications on the token array.
  // Called after the whole input string has been split into tokens.
  // The result of this will be the output of the tokenizer.
  postProcess?: (tokens: Token[]) => Token[];
}

export default class Tokenizer {
  // LEXER_OPTIONS: Record<keyof typeof TokenType | 'WS' | 'NL', moo.Rule>;
  LEXER_OPTIONS: { [key: string]: moo.Rule };
  LEXER: moo.Lexer;
  postProcessor?: (tokens: Token[]) => Token[];

  constructor(cfg: TokenizerOptions) {
    this.LEXER_OPTIONS = {
      WS: { match: /[ \t]+/ },
      NL: { match: /\n/, lineBreaks: true },
      [TokenType.BLOCK_COMMENT]: { match: /(?:\/\*[^]*?(?:\*\/|$))/, lineBreaks: true },
      [TokenType.LINE_COMMENT]: {
        match: regex.lineComment(cfg.lineCommentTypes ?? ['--']),
      },
      [TokenType.COMMA]: { match: /[,]/ },
      [TokenType.BLOCK_START]: { match: regex.parenthesis(cfg.blockStart ?? ['(']) },
      [TokenType.BLOCK_END]: { match: regex.parenthesis(cfg.blockEnd ?? [')']) },
      [TokenType.QUOTED_IDENTIFIER]: { match: regex.string(cfg.identTypes) },
      [TokenType.OPERATOR]: {
        match: regex.operator('+-/*%&|^><=.;[]{}`:$@', [
          '<>',
          '<=',
          '>=',
          '!=',
          ...(cfg.operators ?? []),
        ]),
      },
      [TokenType.NUMBER]: {
        match:
          /(?:0x[0-9a-fA-F]+|0b[01]+|(?:-\s*)?[0-9]+(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+(?:\.[0-9]+)?)?)/,
      },
      [TokenType.RESERVED_CASE_START]: {
        match: /[Cc][Aa][Ss][Ee]/u,
        value: v => v.toUpperCase(),
      },
      [TokenType.RESERVED_CASE_END]: { match: /[Ee][Nn][Dd]/u, value: v => v.toUpperCase() },
      [TokenType.RESERVED_COMMAND]: {
        match: regex.reservedWord(cfg.reservedCommands, cfg.identChars),
        value: v => v.toUpperCase(),
      },
      [TokenType.RESERVED_BINARY_COMMAND]: {
        match: regex.reservedWord(cfg.reservedBinaryCommands, cfg.identChars),
        value: v => v.toUpperCase(),
      },
      [TokenType.RESERVED_DEPENDENT_CLAUSE]: {
        match: regex.reservedWord(cfg.reservedDependentClauses, cfg.identChars),
        value: v => v.toUpperCase(),
      },
      [TokenType.RESERVED_KEYWORD]: {
        match: regex.reservedWord(cfg.reservedKeywords, cfg.identChars),
        value: v => v.toUpperCase(),
      },
      [TokenType.RESERVED_LOGICAL_OPERATOR]: {
        match: regex.reservedWord(cfg.reservedLogicalOperators ?? ['AND', 'OR'], cfg.identChars),
        value: v => v.toUpperCase(),
      },
      [TokenType.RESERVED_JOIN_CONDITION]: {
        match: regex.reservedWord(cfg.reservedJoinConditions ?? ['ON', 'USING'], cfg.identChars),
        value: v => v.toUpperCase(),
      },
      [TokenType.NAMED_PARAMETER]: {
        match: regex.parameter(
          cfg.namedParamTypes ?? [],
          regex.identifierPattern(cfg.paramChars || cfg.identChars)
        ),
        value: v => v.slice(1),
      },
      [TokenType.QUOTED_PARAMETER]: {
        match: regex.parameter(cfg.quotedParamTypes ?? [], regex.stringPattern(cfg.identTypes)),
        value: v =>
          (({ key, quoteChar }) =>
            key.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar))({
            key: v.slice(2, -1),
            quoteChar: v.slice(-1),
          }),
      },
      [TokenType.INDEXED_PARAMETER]: {
        match: regex.parameter(cfg.numberedParamTypes ?? [], '[0-9]+'),
        value: v => v.slice(1),
      },
      [TokenType.POSITIONAL_PARAMETER]: {
        match: cfg.positionalParams ? /[?]/ : undefined,
        value: v => v.slice(1),
      },
      [TokenType.VARIABLE]: {
        match: cfg.variableTypes ? regex.variable(cfg.variableTypes) : NULL_REGEX,
      },
      [TokenType.STRING]: { match: regex.string(cfg.stringTypes) },
      [TokenType.IDENTIFIER]: {
        match: regex.identifier(cfg.identChars),
        // type: moo.keywords({ [TokenType.RESERVED_COMMAND]: cfg.reservedCommands }), // case sensitivity currently broken, see moo#122
      },
    };

    this.LEXER_OPTIONS = Object.entries(this.LEXER_OPTIONS).reduce(
      (rules, [name, rule]) =>
        rule.match
          ? {
              ...rules,
              [name]: {
                ...rule,
                match: new RegExp(
                  rule.match as string | RegExp,
                  [...(rule.match instanceof RegExp ? rule.match.flags.split('') : [])]
                    .filter(flag => !'iumgy'.includes(flag)) // disallowed flags
                    .join('') + 'u'
                ),
              },
            }
          : rules,
      {} as { [key: string]: moo.Rule }
    );

    this.LEXER = moo.compile(this.LEXER_OPTIONS);

    this.postProcessor = cfg.postProcess;
  }

  tokenize(input: string): moo.Token[] {
    this.LEXER.reset(input);
    return Array.from(this.LEXER);
  }

  tempTokenize(input: string) {
    const mooTokens = this.tokenize(input);
    const oldTokens = tokenConverter(mooTokens);
    return this.postProcessor ? this.postProcessor(oldTokens) : oldTokens;
  }
}

// temporary converter for moo.Token to Token
export const tokenConverter = (tokens: moo.Token[]): Token[] => {
  const outTokens = [] as Token[];
  for (let i = 0; i < tokens.length; i++) {
    // collect whitespaceBefore
    let whitespace = '';
    while (tokens[i].type === 'WS' || tokens[i].type === 'NL') {
      whitespace += tokens[i].value;
      if (!tokens[++i]) {
        break;
      }
    }
    const token = tokens[i];

    outTokens.push({
      type: token.type as TokenType,
      text: token.text,
      value: token.value,
      whitespaceBefore: whitespace,
    });
  }
  return outTokens;
};
