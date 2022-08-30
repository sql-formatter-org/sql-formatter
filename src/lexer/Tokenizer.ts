import { Token, TokenType } from 'src/lexer/token';
import * as regex from 'src/lexer/regexFactory';
import { ParamTypes, TokenizerOptions } from 'src/lexer/TokenizerOptions';
import TokenizerEngine, { type TokenRule } from 'src/lexer/TokenizerEngine';
import { escapeRegExp } from 'src/lexer/regexUtil';
import { equalizeWhitespace } from 'src/utils';

export default class Tokenizer {
  private dialectRules: Partial<Record<TokenType, TokenRule>>;

  constructor(private cfg: TokenizerOptions) {
    this.dialectRules = this.buildDialectRules(cfg);
  }

  public tokenize(input: string, paramTypesOverrides: ParamTypes): Token[] {
    const rules = {
      ...this.dialectRules,
      ...this.buildParamRules(this.cfg, paramTypesOverrides),
    };
    const tokens = new TokenizerEngine(rules).tokenize(input);
    return this.cfg.postProcess ? this.cfg.postProcess(tokens) : tokens;
  }

  // These rules can be cached as they only depend on
  // the Tokenizer config options specified for each SQL dialect
  private buildDialectRules(cfg: TokenizerOptions): Partial<Record<TokenType, TokenRule>> {
    return this.validRules({
      [TokenType.BLOCK_COMMENT]: {
        type: TokenType.BLOCK_COMMENT,
        regex: /(\/\*[^]*?(?:\*\/|$))/uy,
      },
      [TokenType.LINE_COMMENT]: {
        type: TokenType.LINE_COMMENT,
        regex: regex.lineComment(cfg.lineCommentTypes ?? ['--']),
      },
      [TokenType.QUOTED_IDENTIFIER]: {
        type: TokenType.QUOTED_IDENTIFIER,
        regex: regex.string(cfg.identTypes),
      },
      [TokenType.NUMBER]: {
        type: TokenType.NUMBER,
        regex:
          /(?:0x[0-9a-fA-F]+|0b[01]+|(?:-\s*)?[0-9]+(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+(?:\.[0-9]+)?)?)(?!\w)/uy,
      },
      [TokenType.CASE]: {
        type: TokenType.CASE,
        regex: /CASE\b/iuy,
        text: toCanonical,
      },
      [TokenType.END]: {
        type: TokenType.END,
        regex: /END\b/iuy,
        text: toCanonical,
      },
      [TokenType.BETWEEN]: {
        type: TokenType.BETWEEN,
        regex: /BETWEEN\b/iuy,
        text: toCanonical,
      },
      [TokenType.LIMIT]: {
        type: TokenType.LIMIT,
        regex: cfg.reservedCommands.includes('LIMIT') ? /LIMIT\b/iuy : undefined,
        text: toCanonical,
      },
      [TokenType.RESERVED_COMMAND]: {
        type: TokenType.RESERVED_COMMAND,
        regex: regex.reservedWord(cfg.reservedCommands, cfg.identChars),
        text: toCanonical,
      },
      [TokenType.RESERVED_SELECT]: {
        type: TokenType.RESERVED_SELECT,
        regex: regex.reservedWord(cfg.reservedSelect, cfg.identChars),
        text: toCanonical,
      },
      [TokenType.RESERVED_SET_OPERATION]: {
        type: TokenType.RESERVED_SET_OPERATION,
        regex: regex.reservedWord(cfg.reservedSetOperations, cfg.identChars),
        text: toCanonical,
      },
      [TokenType.RESERVED_DEPENDENT_CLAUSE]: {
        type: TokenType.RESERVED_DEPENDENT_CLAUSE,
        regex: regex.reservedWord(cfg.reservedDependentClauses, cfg.identChars),
        text: toCanonical,
      },
      [TokenType.RESERVED_JOIN]: {
        type: TokenType.RESERVED_JOIN,
        regex: regex.reservedWord(cfg.reservedJoins, cfg.identChars),
        text: toCanonical,
      },
      [TokenType.RESERVED_PHRASE]: {
        type: TokenType.RESERVED_PHRASE,
        regex: regex.reservedWord(cfg.reservedPhrases ?? [], cfg.identChars),
        text: toCanonical,
      },
      [TokenType.AND]: {
        type: TokenType.AND,
        regex: /AND\b/iuy,
        text: toCanonical,
      },
      [TokenType.OR]: {
        type: TokenType.OR,
        regex: /OR\b/iuy,
        text: toCanonical,
      },
      [TokenType.XOR]: {
        type: TokenType.XOR,
        regex: cfg.supportsXor ? /XOR\b/iuy : undefined,
        text: toCanonical,
      },
      [TokenType.RESERVED_FUNCTION_NAME]: {
        type: TokenType.RESERVED_FUNCTION_NAME,
        regex: regex.reservedWord(cfg.reservedFunctionNames, cfg.identChars),
        text: toCanonical,
      },
      [TokenType.RESERVED_KEYWORD]: {
        type: TokenType.RESERVED_KEYWORD,
        regex: regex.reservedWord(cfg.reservedKeywords, cfg.identChars),
        text: toCanonical,
      },
      [TokenType.VARIABLE]: {
        type: TokenType.VARIABLE,
        regex: cfg.variableTypes ? regex.variable(cfg.variableTypes) : undefined,
      },
      [TokenType.STRING]: { type: TokenType.STRING, regex: regex.string(cfg.stringTypes) },
      [TokenType.IDENTIFIER]: {
        type: TokenType.IDENTIFIER,
        regex: regex.identifier(cfg.identChars),
      },
      [TokenType.DELIMITER]: { type: TokenType.DELIMITER, regex: /[;]/uy },
      [TokenType.COMMA]: { type: TokenType.COMMA, regex: /[,]/y },
      [TokenType.OPEN_PAREN]: {
        type: TokenType.OPEN_PAREN,
        regex: regex.parenthesis('open', cfg.extraParens),
      },
      [TokenType.CLOSE_PAREN]: {
        type: TokenType.CLOSE_PAREN,
        regex: regex.parenthesis('close', cfg.extraParens),
      },
      [TokenType.OPERATOR]: {
        type: TokenType.OPERATOR,
        regex: regex.operator('+-/%&|^><=.:$@#?~!', [
          '<>',
          '<=',
          '>=',
          '!=',
          ...(cfg.operators ?? []),
        ]),
      },
      [TokenType.ASTERISK]: { type: TokenType.ASTERISK, regex: /[*]/uy },
    });
  }

  // These rules can't be blindly cached as the paramTypesOverrides object
  // can differ on each invocation of the format() function.
  private buildParamRules(
    cfg: TokenizerOptions,
    paramTypesOverrides: ParamTypes
  ): Partial<Record<TokenType, TokenRule>> {
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

    return this.validRules({
      [TokenType.NAMED_PARAMETER]: {
        type: TokenType.NAMED_PARAMETER,
        regex: regex.parameter(
          paramTypes.named,
          regex.identifierPattern(cfg.paramChars || cfg.identChars)
        ),
        key: v => v.slice(1),
      },
      [TokenType.QUOTED_PARAMETER]: {
        type: TokenType.QUOTED_PARAMETER,
        regex: regex.parameter(paramTypes.quoted, regex.stringPattern(cfg.identTypes)),
        key: v =>
          (({ tokenKey, quoteChar }) =>
            tokenKey.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar))({
            tokenKey: v.slice(2, -1),
            quoteChar: v.slice(-1),
          }),
      },
      [TokenType.NUMBERED_PARAMETER]: {
        type: TokenType.NUMBERED_PARAMETER,
        regex: regex.parameter(paramTypes.numbered, '[0-9]+'),
        key: v => v.slice(1),
      },
      [TokenType.POSITIONAL_PARAMETER]: {
        type: TokenType.POSITIONAL_PARAMETER,
        regex: paramTypes.positional ? /[?]/y : undefined,
      },
    });
  }

  // filters out rules for token types whose regex is undefined
  private validRules(
    rules: Partial<Record<TokenType, TokenRule | { regex: undefined }>>
  ): Partial<Record<TokenType, TokenRule>> {
    return Object.fromEntries(Object.entries(rules).filter(([_, rule]) => rule.regex));
  }
}

/**
 * Converts keywords (and keyword sequences) to canonical form:
 * - in uppercase
 * - single spaces between words
 */
const toCanonical = (v: string) => equalizeWhitespace(v.toUpperCase());
