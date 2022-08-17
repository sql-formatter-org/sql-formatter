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
      [TokenType.CASE]: {
        regex: /CASE\b/iuy,
        value: toCanonical,
      },
      [TokenType.END]: {
        regex: /END\b/iuy,
        value: toCanonical,
      },
      [TokenType.BETWEEN]: {
        regex: /BETWEEN\b/iuy,
        value: toCanonical,
      },
      [TokenType.LIMIT]: {
        regex: cfg.reservedCommands.includes('LIMIT') ? /LIMIT\b/iuy : undefined,
        value: toCanonical,
      },
      [TokenType.RESERVED_COMMAND]: {
        regex: regex.reservedWord(cfg.reservedCommands, cfg.identChars),
        value: toCanonical,
      },
      [TokenType.RESERVED_SELECT]: {
        regex: regex.reservedWord(cfg.reservedSelect, cfg.identChars),
        value: toCanonical,
      },
      [TokenType.RESERVED_SET_OPERATION]: {
        regex: regex.reservedWord(cfg.reservedSetOperations, cfg.identChars),
        value: toCanonical,
      },
      [TokenType.RESERVED_DEPENDENT_CLAUSE]: {
        regex: regex.reservedWord(cfg.reservedDependentClauses, cfg.identChars),
        value: toCanonical,
      },
      [TokenType.RESERVED_JOIN]: {
        regex: regex.reservedWord(cfg.reservedJoins, cfg.identChars),
        value: toCanonical,
      },
      [TokenType.RESERVED_PHRASE]: {
        regex: regex.reservedWord(cfg.reservedPhrases ?? [], cfg.identChars),
        value: toCanonical,
      },
      [TokenType.AND]: {
        regex: /AND\b/iuy,
        value: toCanonical,
      },
      [TokenType.OR]: {
        regex: /OR\b/iuy,
        value: toCanonical,
      },
      [TokenType.XOR]: {
        regex: cfg.supportsXor ? /XOR\b/iuy : undefined,
        value: toCanonical,
      },
      [TokenType.RESERVED_FUNCTION_NAME]: {
        regex: regex.reservedWord(cfg.reservedFunctionNames, cfg.identChars),
        value: toCanonical,
      },
      [TokenType.RESERVED_KEYWORD]: {
        regex: regex.reservedWord(cfg.reservedKeywords, cfg.identChars),
        value: toCanonical,
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
        regex: regex.operator('+-/%&|^><=.:$@#?~![]{}', [
          '<>',
          '<=',
          '>=',
          '!=',
          ...(cfg.operators ?? []),
        ]),
      },
      [TokenType.ASTERISK]: { regex: /[*]/uy },
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
        regex: regex.parameter(
          paramTypes.named,
          regex.identifierPattern(cfg.paramChars || cfg.identChars)
        ),
        key: v => v.slice(1),
      },
      [TokenType.QUOTED_PARAMETER]: {
        regex: regex.parameter(paramTypes.quoted, regex.stringPattern(cfg.identTypes)),
        key: v =>
          (({ tokenKey, quoteChar }) =>
            tokenKey.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar))({
            tokenKey: v.slice(2, -1),
            quoteChar: v.slice(-1),
          }),
      },
      [TokenType.NUMBERED_PARAMETER]: {
        regex: regex.parameter(paramTypes.numbered, '[0-9]+'),
        key: v => v.slice(1),
      },
      [TokenType.POSITIONAL_PARAMETER]: {
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
