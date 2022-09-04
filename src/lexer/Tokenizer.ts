import { Token, TokenType } from 'src/lexer/token';
import * as regex from 'src/lexer/regexFactory';
import { ParamTypes, TokenizerOptions } from 'src/lexer/TokenizerOptions';
import TokenizerEngine, { TokenRule } from 'src/lexer/TokenizerEngine';
import { escapeRegExp } from 'src/lexer/regexUtil';
import { equalizeWhitespace, Optional } from 'src/utils';

type OptionalTokenRule = Optional<TokenRule, 'regex'>;

export default class Tokenizer {
  private rulesBeforeParams: TokenRule[];
  private rulesAfterParams: TokenRule[];

  constructor(private cfg: TokenizerOptions) {
    this.rulesBeforeParams = this.buildRulesBeforeParams(cfg);
    this.rulesAfterParams = this.buildRulesAfterParams(cfg);
  }

  public tokenize(input: string, paramTypesOverrides: ParamTypes): Token[] {
    const rules = [
      ...this.rulesBeforeParams,
      ...this.buildParamRules(this.cfg, paramTypesOverrides),
      ...this.rulesAfterParams,
    ];
    const tokens = new TokenizerEngine(rules).tokenize(input);
    return this.cfg.postProcess ? this.cfg.postProcess(tokens) : tokens;
  }

  // These rules can be cached as they only depend on
  // the Tokenizer config options specified for each SQL dialect
  private buildRulesBeforeParams(cfg: TokenizerOptions): TokenRule[] {
    return this.validRules([
      {
        type: TokenType.BLOCK_COMMENT,
        regex: /(\/\*[^]*?(?:\*\/|$))/uy,
      },
      {
        type: TokenType.LINE_COMMENT,
        regex: regex.lineComment(cfg.lineCommentTypes ?? ['--']),
      },
      {
        type: TokenType.QUOTED_IDENTIFIER,
        regex: regex.string(cfg.identTypes),
      },
      {
        type: TokenType.NUMBER,
        regex:
          /(?:0x[0-9a-fA-F]+|0b[01]+|(?:-\s*)?[0-9]+(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+(?:\.[0-9]+)?)?)(?!\w)/uy,
      },
      // RESERVED_PHRASE is matched before all other keyword tokens
      // to e.g. prioritize matching "TIMESTAMP WITH TIME ZONE" phrase over "WITH" command.
      {
        type: TokenType.RESERVED_PHRASE,
        regex: regex.reservedWord(cfg.reservedPhrases ?? [], cfg.identChars),
        text: toCanonical,
      },
      {
        type: TokenType.CASE,
        regex: /CASE\b/iuy,
        text: toCanonical,
      },
      {
        type: TokenType.END,
        regex: /END\b/iuy,
        text: toCanonical,
      },
      {
        type: TokenType.BETWEEN,
        regex: /BETWEEN\b/iuy,
        text: toCanonical,
      },
      {
        type: TokenType.LIMIT,
        regex: cfg.reservedCommands.includes('LIMIT') ? /LIMIT\b/iuy : undefined,
        text: toCanonical,
      },
      {
        type: TokenType.RESERVED_COMMAND,
        regex: regex.reservedWord(cfg.reservedCommands, cfg.identChars),
        text: toCanonical,
      },
      {
        type: TokenType.RESERVED_SELECT,
        regex: regex.reservedWord(cfg.reservedSelect, cfg.identChars),
        text: toCanonical,
      },
      {
        type: TokenType.RESERVED_SET_OPERATION,
        regex: regex.reservedWord(cfg.reservedSetOperations, cfg.identChars),
        text: toCanonical,
      },
      {
        type: TokenType.RESERVED_DEPENDENT_CLAUSE,
        regex: regex.reservedWord(cfg.reservedDependentClauses, cfg.identChars),
        text: toCanonical,
      },
      {
        type: TokenType.RESERVED_JOIN,
        regex: regex.reservedWord(cfg.reservedJoins, cfg.identChars),
        text: toCanonical,
      },
      {
        type: TokenType.AND,
        regex: /AND\b/iuy,
        text: toCanonical,
      },
      {
        type: TokenType.OR,
        regex: /OR\b/iuy,
        text: toCanonical,
      },
      {
        type: TokenType.XOR,
        regex: cfg.supportsXor ? /XOR\b/iuy : undefined,
        text: toCanonical,
      },
      {
        type: TokenType.RESERVED_FUNCTION_NAME,
        regex: regex.reservedWord(cfg.reservedFunctionNames, cfg.identChars),
        text: toCanonical,
      },
      {
        type: TokenType.RESERVED_KEYWORD,
        regex: regex.reservedWord(cfg.reservedKeywords, cfg.identChars),
        text: toCanonical,
      },
    ]);
  }

  // These rules can also be cached as they only depend on
  // the Tokenizer config options specified for each SQL dialect
  private buildRulesAfterParams(cfg: TokenizerOptions): TokenRule[] {
    return this.validRules([
      {
        type: TokenType.VARIABLE,
        regex: cfg.variableTypes ? regex.variable(cfg.variableTypes) : undefined,
      },
      { type: TokenType.STRING, regex: regex.string(cfg.stringTypes) },
      {
        type: TokenType.IDENTIFIER,
        regex: regex.identifier(cfg.identChars),
      },
      { type: TokenType.DELIMITER, regex: /[;]/uy },
      { type: TokenType.COMMA, regex: /[,]/y },
      {
        type: TokenType.OPEN_PAREN,
        regex: regex.parenthesis('open', cfg.extraParens),
      },
      {
        type: TokenType.CLOSE_PAREN,
        regex: regex.parenthesis('close', cfg.extraParens),
      },
      {
        type: TokenType.OPERATOR,
        regex: regex.operator([
          '+',
          '-',
          '/',
          '%',
          '&',
          '|',
          '^',
          '>',
          '<',
          '=',
          ':',
          '$',
          '@',
          '#',
          '?',
          '~',
          '!',
          '<>',
          '<=',
          '>=',
          '!=',
          ...(cfg.operators ?? []),
        ]),
      },
      { type: TokenType.ASTERISK, regex: /[*]/uy },
      { type: TokenType.DOT, regex: /[.]/uy },
    ]);
  }

  // These rules can't be blindly cached as the paramTypesOverrides object
  // can differ on each invocation of the format() function.
  private buildParamRules(cfg: TokenizerOptions, paramTypesOverrides: ParamTypes): TokenRule[] {
    // Each dialect has its own default parameter types (if any),
    // but these can be overriden by the user of the library.
    const paramTypes = {
      named: paramTypesOverrides?.named || cfg.paramTypes?.named || [],
      quoted: paramTypesOverrides?.quoted || cfg.paramTypes?.quoted || [],
      numbered: paramTypesOverrides?.numbered || cfg.paramTypes?.numbered || [],
      positional:
        typeof paramTypesOverrides?.positional === 'boolean'
          ? paramTypesOverrides.positional
          : cfg.paramTypes?.positional,
    };

    return this.validRules([
      {
        type: TokenType.NAMED_PARAMETER,
        regex: regex.parameter(
          paramTypes.named,
          regex.identifierPattern(cfg.paramChars || cfg.identChars)
        ),
        key: v => v.slice(1),
      },
      {
        type: TokenType.QUOTED_PARAMETER,
        regex: regex.parameter(paramTypes.quoted, regex.stringPattern(cfg.identTypes)),
        key: v =>
          (({ tokenKey, quoteChar }) =>
            tokenKey.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar))({
            tokenKey: v.slice(2, -1),
            quoteChar: v.slice(-1),
          }),
      },
      {
        type: TokenType.NUMBERED_PARAMETER,
        regex: regex.parameter(paramTypes.numbered, '[0-9]+'),
        key: v => v.slice(1),
      },
      {
        type: TokenType.POSITIONAL_PARAMETER,
        regex: paramTypes.positional ? /[?]/y : undefined,
      },
    ]);
  }

  // filters out rules for token types whose regex is undefined
  private validRules(rules: OptionalTokenRule[]): TokenRule[] {
    return rules.filter((rule): rule is TokenRule => Boolean(rule.regex));
  }
}

/**
 * Converts keywords (and keyword sequences) to canonical form:
 * - in uppercase
 * - single spaces between words
 */
const toCanonical = (v: string) => equalizeWhitespace(v.toUpperCase());
