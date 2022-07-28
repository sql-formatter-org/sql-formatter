import { Token, TokenType } from 'src/lexer/token';
import * as regex from 'src/lexer/regexFactory';
import * as regexTypes from 'src/lexer/regexTypes';
import { equalizeWhitespace } from 'src/utils';

import { escapeRegExp } from './regexUtil';
import TokenizerEngine, { type TokenRule } from './TokenizerEngine';

interface TokenizerOptions {
  // Main clauses that start new block, like: SELECT, FROM, WHERE, ORDER BY
  reservedCommands: string[];
  // Logical operator keywords, defaults to: [AND, OR]
  reservedLogicalOperators?: string[];
  // Keywords in CASE expressions that begin new line, like: WHEN, ELSE
  reservedDependentClauses: string[];
  // Keywords that create newline but no indentaion of their body.
  // These contain set operations like UNION
  reservedSetOperations: string[];
  // Various joins like LEFT OUTER JOIN
  reservedJoins: string[];
  // built in function names
  reservedFunctionNames: string[];
  // all other reserved words (not included to any of the above lists)
  reservedKeywords: string[];
  // Types of quotes to use for strings
  stringTypes: regexTypes.QuoteType[];
  // Types of quotes to use for quoted identifiers
  identTypes: regexTypes.QuoteType[];
  // Types of quotes to use for variables
  variableTypes?: regexTypes.VariableType[];
  // Open-parenthesis characters
  openParens?: ('(' | '[' | '{' | '{-')[];
  // Close-parenthesis characters
  closeParens?: (')' | ']' | '}' | '-}')[];
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
  private engine: TokenizerEngine;
  private postProcess?: (tokens: Token[]) => Token[];

  constructor(cfg: TokenizerOptions) {
    const rules = this.validRules({
      [TokenType.BLOCK_COMMENT]: { regex: /(\/\*[^]*?(?:\*\/|$))/uy },
      [TokenType.LINE_COMMENT]: {
        regex: regex.lineComment(cfg.lineCommentTypes ?? ['--']),
      },
      [TokenType.COMMA]: { regex: /[,]/y },
      [TokenType.OPEN_PAREN]: { regex: regex.parenthesis(cfg.openParens ?? ['(']) },
      [TokenType.CLOSE_PAREN]: { regex: regex.parenthesis(cfg.closeParens ?? [')']) },
      [TokenType.QUOTED_IDENTIFIER]: { regex: regex.string(cfg.identTypes) },
      [TokenType.NUMBER]: {
        regex:
          /(?:0x[0-9a-fA-F]+|0b[01]+|(?:-\s*)?[0-9]+(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+(?:\.[0-9]+)?)?)(?!\w)/uy,
      },
      [TokenType.RESERVED_CASE_START]: {
        regex: /[Cc][Aa][Ss][Ee]\b/uy,
        value: v => equalizeWhitespace(v.toUpperCase()),
      },
      [TokenType.RESERVED_CASE_END]: {
        regex: /[Ee][Nn][Dd]\b/uy,
        value: v => equalizeWhitespace(v.toUpperCase()),
      },
      [TokenType.RESERVED_COMMAND]: {
        regex: regex.reservedWord(cfg.reservedCommands, cfg.identChars),
        value: v => equalizeWhitespace(v.toUpperCase()),
      },
      [TokenType.RESERVED_SET_OPERATION]: {
        regex: regex.reservedWord(cfg.reservedSetOperations, cfg.identChars),
        value: v => equalizeWhitespace(v.toUpperCase()),
      },
      [TokenType.RESERVED_DEPENDENT_CLAUSE]: {
        regex: regex.reservedWord(cfg.reservedDependentClauses, cfg.identChars),
        value: v => equalizeWhitespace(v.toUpperCase()),
      },
      [TokenType.RESERVED_JOIN]: {
        regex: regex.reservedWord(cfg.reservedJoins, cfg.identChars),
        value: v => equalizeWhitespace(v.toUpperCase()),
      },
      [TokenType.RESERVED_LOGICAL_OPERATOR]: {
        regex: regex.reservedWord(cfg.reservedLogicalOperators ?? ['AND', 'OR'], cfg.identChars),
        value: v => equalizeWhitespace(v.toUpperCase()),
      },
      [TokenType.RESERVED_FUNCTION_NAME]: {
        regex: regex.reservedWord(cfg.reservedFunctionNames, cfg.identChars),
        value: v => equalizeWhitespace(v.toUpperCase()),
      },
      [TokenType.RESERVED_KEYWORD]: {
        regex: regex.reservedWord(cfg.reservedKeywords, cfg.identChars),
        value: v => equalizeWhitespace(v.toUpperCase()),
      },
      [TokenType.NAMED_PARAMETER]: {
        regex: regex.parameter(
          cfg.namedParamTypes ?? [],
          regex.identifierPattern(cfg.paramChars || cfg.identChars)
        ),
        key: v => v.slice(1),
      },
      [TokenType.QUOTED_PARAMETER]: {
        regex: regex.parameter(cfg.quotedParamTypes ?? [], regex.stringPattern(cfg.identTypes)),
        key: v =>
          (({ tokenKey, quoteChar }) =>
            tokenKey.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar))({
            tokenKey: v.slice(2, -1),
            quoteChar: v.slice(-1),
          }),
      },
      [TokenType.INDEXED_PARAMETER]: {
        regex: regex.parameter(cfg.numberedParamTypes ?? [], '[0-9]+'),
        key: v => v.slice(1),
      },
      [TokenType.POSITIONAL_PARAMETER]: {
        regex: cfg.positionalParams ? /[?]/y : undefined,
      },
      [TokenType.VARIABLE]: {
        regex: cfg.variableTypes ? regex.variable(cfg.variableTypes) : undefined,
      },
      [TokenType.STRING]: { regex: regex.string(cfg.stringTypes) },
      [TokenType.IDENTIFIER]: {
        regex: regex.identifier(cfg.identChars),
      },
      [TokenType.DELIMITER]: { regex: /[;]/uy },
      [TokenType.OPERATOR]: {
        regex: regex.operator('+-/*%&|^><=.:$@#?~![]{}', [
          '<>',
          '<=',
          '>=',
          '!=',
          ...(cfg.operators ?? []),
        ]),
      },
    });

    this.engine = new TokenizerEngine(rules);

    this.postProcess = cfg.postProcess;
  }

  // filters out unsupported *_PARAMETER types whose regex is undefined
  private validRules(
    rules: Partial<Record<TokenType, TokenRule | { regex: undefined }>>
  ): Partial<Record<TokenType, TokenRule>> {
    return Object.fromEntries(Object.entries(rules).filter(([_, rule]) => rule.regex));
  }

  public tokenize(input: string): Token[] {
    const tokens = this.engine.tokenize(input);
    return this.postProcess ? this.postProcess(tokens) : tokens;
  }
}
