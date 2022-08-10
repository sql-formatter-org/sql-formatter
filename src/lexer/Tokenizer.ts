import { Token, TokenType } from 'src/lexer/token';
import * as regex from 'src/lexer/regexFactory';
import { TokenizerOptions } from 'src/lexer/TokenizerOptions';
import { equalizeWhitespace } from 'src/utils';

import { escapeRegExp } from './regexUtil';
import TokenizerEngine, { type TokenRule } from './TokenizerEngine';

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
      [TokenType.RESERVED_PHRASE]: {
        regex: regex.reservedWord(cfg.reservedPhrases ?? [], cfg.identChars),
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
          cfg.paramTypes?.named ?? [],
          regex.identifierPattern(cfg.paramChars || cfg.identChars)
        ),
        key: v => v.slice(1),
      },
      [TokenType.QUOTED_PARAMETER]: {
        regex: regex.parameter(cfg.paramTypes?.quoted ?? [], regex.stringPattern(cfg.identTypes)),
        key: v =>
          (({ tokenKey, quoteChar }) =>
            tokenKey.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar))({
            tokenKey: v.slice(2, -1),
            quoteChar: v.slice(-1),
          }),
      },
      [TokenType.NUMBERED_PARAMETER]: {
        regex: regex.parameter(cfg.paramTypes?.numbered ?? [], '[0-9]+'),
        key: v => v.slice(1),
      },
      [TokenType.POSITIONAL_PARAMETER]: {
        regex: cfg.paramTypes?.positional ? /[?]/y : undefined,
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
