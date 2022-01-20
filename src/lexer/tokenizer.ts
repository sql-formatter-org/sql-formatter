import * as moo from 'moo';

import * as regexFactory from '../core/regexFactory';
import { TokenType } from '../core/token'; // convert to partial type import in TS 4.5
import {
	lineCommentRegex,
	operatorRegex,
	StringPatternType,
	stringRegex,
	wordRegex,
} from '../core/mooRegexFactory';

const NULL_REGEX = /(?!)/; // zero-width negative lookahead, matches nothing

interface TokenizerOptions {
	reservedKeywords: string[];
	reservedCommands: string[];
	reservedLogicalOperators: string[];
	reservedDependentClauses: string[];
	reservedBinaryCommands: string[];
	stringTypes: StringPatternType[];
	blockStart: string[];
	blockEnd: string[];
	indexedPlaceholderTypes?: string[];
	namedPlaceholderTypes: string[];
	lineCommentTypes: string[];
	specialWordChars?: { prefix?: string; any?: string; suffix?: string };
	operators?: string[];
}

export default class Tokenizer {
	WHITESPACE_REGEX: RegExp;
	REGEX_MAP: Partial<{ [tokenType in TokenType]: RegExp }>;

	INDEXED_PLACEHOLDER_REGEX?: RegExp;
	IDENT_NAMED_PLACEHOLDER_REGEX?: RegExp;
	STRING_NAMED_PLACEHOLDER_REGEX?: RegExp;

	LEXER_OPTIONS: { [key: string]: moo.Rule };

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
		this.WHITESPACE_REGEX = /^(\s+)/u;

		const specialWordCharsAll = Object.values(cfg.specialWordChars ?? {}).join('');
		this.REGEX_MAP = {
			[TokenType.RESERVED_KEYWORD]: regexFactory.createReservedWordRegex(
				cfg.reservedKeywords,
				specialWordCharsAll
			),
			[TokenType.RESERVED_DEPENDENT_CLAUSE]: regexFactory.createReservedWordRegex(
				cfg.reservedDependentClauses ?? [],
				specialWordCharsAll
			),
			[TokenType.RESERVED_LOGICAL_OPERATOR]: regexFactory.createReservedWordRegex(
				cfg.reservedLogicalOperators,
				specialWordCharsAll
			),
			[TokenType.RESERVED_COMMAND]: regexFactory.createReservedWordRegex(
				cfg.reservedCommands,
				specialWordCharsAll
			),
			[TokenType.RESERVED_BINARY_COMMAND]: regexFactory.createReservedWordRegex(
				cfg.reservedBinaryCommands,
				specialWordCharsAll
			),
		};

		this.INDEXED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
			cfg.indexedPlaceholderTypes ?? [],
			'[0-9]*'
		);
		this.IDENT_NAMED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
			cfg.namedPlaceholderTypes,
			'[a-zA-Z0-9._$]+'
		);
		this.STRING_NAMED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
			cfg.namedPlaceholderTypes,
			regexFactory.createStringPattern(cfg.stringTypes)
		);

		this.LEXER_OPTIONS = {
			WS: { match: /[ \t]+/ },
			NL: { match: /\n/, lineBreaks: true },
			[TokenType.BLOCK_COMMENT]: { match: /^(?:\/\*[^]*?(?:\*\/|$))/u, lineBreaks: true },
			[TokenType.LINE_COMMENT]: {
				match: lineCommentRegex(cfg.lineCommentTypes),
			},
			[TokenType.COMMA]: { match: /[,]/ },
			[TokenType.OPEN_PAREN]: { match: /[(]/ },
			[TokenType.CLOSE_PAREN]: { match: /[)]/ },
			[TokenType.OPEN_BRACKET]: { match: /[[]/ },
			[TokenType.CLOSE_BRACKET]: { match: /[\]]/ },
			[TokenType.OPERATOR]: {
				match: operatorRegex('+-/*%&|^><=.;{}`:$', [
					'<>',
					'<=',
					'>=',
					'!=',
					...(cfg.operators ?? []),
				]),
			},
			[TokenType.NUMBER]: {
				match:
					/^(?:(?:-\s*)?[0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+(?:\.[0-9]+)?)?|0x[0-9a-fA-F]+|0b[01]+)\b/u,
			},
			[TokenType.STRING]: { match: stringRegex({ stringTypes: cfg.stringTypes }) },
			[TokenType.WORD]: {
				match: wordRegex(cfg.specialWordChars),
				type: moo.keywords({ BLOCK_CASE: 'CASE', BLOCK_END: 'END' }),
			},
			WIP: { match: '.' },
		};
		this.LEXER_OPTIONS = Object.entries(this.LEXER_OPTIONS).reduce(
			(acc, [name, regex]) => ({
				...acc,
				[name]: { ...regex, match: new RegExp(regex.match as string | RegExp, 'u') },
			}),
			{} as { [key: string]: moo.Rule }
		);
	}

	tokenize(input: string) {
		const lexer = moo.compile(this.LEXER_OPTIONS);

		lexer.reset(input);
		return Array.from(lexer);
	}
}
