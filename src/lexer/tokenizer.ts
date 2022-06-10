import * as moo from 'moo';

import { Token, TokenType } from 'src/core/token';
import * as regex from 'src/lexer/regexFactory';

interface TokenizerOptions {
  reservedKeywords: string[];
  reservedCommands: string[];
  reservedLogicalOperators?: string[];
  reservedDependentClauses: string[];
  reservedBinaryCommands: string[];
  reservedJoinConditions?: string[];
  stringTypes: regex.StringPatternType[];
  blockStart?: string[];
  blockEnd?: string[];
  indexedPlaceholderTypes?: string[];
  namedPlaceholderTypes?: string[];
  lineCommentTypes?: string[];
  specialWordChars?: { prefix?: string; any?: string; suffix?: string };
  operators?: string[];
}

export default class Tokenizer {
  LEXER_OPTIONS: { [key: string]: moo.Rule };
  LEXER: moo.Lexer;

  /**
   * @param {TokenizerOptions} cfg
   *  @param {String[]} cfg.reservedKeywords: Reserved words in SQL
   *  @param {String[]} cfg.reservedDependentClauses: Words that following a specific Statement and must have data attached
   *  @param {String[]} cfg.reservedLogicalOperators: Words that are set to newline
   *  @param {String[]} cfg.reservedCommands: Words that are set to new line separately
   *  @param {String[]} cfg.reservedBinaryCommands: Words that are top level but have no indentation
   *  @param {String[]} cfg.stringTypes: String types to enable: "", '', ``, [], N''
   *  @param {String[]} cfg.blockStart: Opening parentheses to enable, like (, [
   *  @param {String[]} cfg.blockEnd: Closing parentheses to enable, like ), ]
   *  @param {String[]} cfg.indexedPlaceholderTypes: Prefixes for indexed placeholders, like ?
   *  @param {String[]} cfg.namedPlaceholderTypes: Prefixes for named placeholders, like @ and :
   *  @param {String[]} cfg.lineCommentTypes: Line comments to enable, like # and --
   *  @param {String[]} cfg.specialWordChars: Special chars that can be found inside of words, like @ and #
   *  @param {String[]} cfg.operators: Additional operators to recognize
   */
  constructor(cfg: TokenizerOptions) {
    const specialWordCharsAll = Object.values(cfg.specialWordChars ?? {}).join('');

    this.LEXER_OPTIONS = {
      WS: { match: /[ \t]+/ },
      NL: { match: /\n/, lineBreaks: true },
      [TokenType.BLOCK_COMMENT]: { match: /(?:\/\*[^]*?(?:\*\/|$))/, lineBreaks: true },
      [TokenType.LINE_COMMENT]: {
        match: regex.lineComment(cfg.lineCommentTypes ?? ['--']),
      },
      [TokenType.COMMA]: { match: /[,]/ },
      [TokenType.BLOCK_START]: { match: /[([]/ }, // add params later
      [TokenType.BLOCK_END]: { match: /[)\]]/ }, // add params later
      [TokenType.OPERATOR]: {
        match: regex.operator('+-/*%&|^><=.;{}`:$', [
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
      [TokenType.RESERVED_CASE_START]: { match: /[Cc][Aa][Ss][Ee]/u },
      [TokenType.RESERVED_CASE_END]: { match: /[Ee][Nn][Dd]/u },
      [TokenType.RESERVED_COMMAND]: {
        match: regex.reservedWord(cfg.reservedCommands, specialWordCharsAll),
      },
      [TokenType.RESERVED_BINARY_COMMAND]: {
        match: regex.reservedWord(cfg.reservedBinaryCommands, specialWordCharsAll),
      },
      [TokenType.RESERVED_DEPENDENT_CLAUSE]: {
        match: regex.reservedWord(cfg.reservedDependentClauses, specialWordCharsAll),
      },
      [TokenType.RESERVED_LOGICAL_OPERATOR]: {
        match: regex.reservedWord(
          cfg.reservedLogicalOperators ?? ['AND', 'OR'],
          specialWordCharsAll
        ),
      },
      [TokenType.RESERVED_JOIN_CONDITION]: {
        match: regex.reservedWord(
          cfg.reservedJoinConditions ?? ['ON', 'USING'],
          specialWordCharsAll
        ),
      },
      [TokenType.RESERVED_KEYWORD]: {
        match: regex.reservedWord(cfg.reservedKeywords, specialWordCharsAll),
      },
      INDEXED_PLACEHOLDER: {
        match: regex.placeholder(cfg.indexedPlaceholderTypes ?? [], '[0-9]*'),
      },
      NAMED_PLACEHOLDER: {
        match: regex.placeholder(cfg.namedPlaceholderTypes ?? [], '[a-zA-Z0-9._$]+'),
      },
      STRING_PLACEHOLDER: {
        match: regex.placeholder(
          cfg.namedPlaceholderTypes ?? [],
          regex.string({ stringTypes: cfg.stringTypes }).source
        ),
      },
      [TokenType.STRING]: { match: regex.string({ stringTypes: cfg.stringTypes }) },
      [TokenType.IDENT]: {
        match: regex.word(cfg.specialWordChars),
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
  }

  tokenize(input: string): moo.Token[] {
    this.LEXER.reset(input);
    return Array.from(this.LEXER);
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
