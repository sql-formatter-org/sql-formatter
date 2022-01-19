import * as moo from 'moo';

import * as regexFactory from '../core/regexFactory';
import { escapeRegExp } from '../utils';
import { Token, TokenType } from '../core/token'; // convert to partial type import in TS 4.5

const NULL_REGEX = /(?!)/; // zero-width negative lookahead, matches nothing

interface TokenizerOptions {
	reservedKeywords: string[];
	reservedCommands: string[];
	reservedLogicalOperators: string[];
	reservedDependentClauses: string[];
	reservedBinaryCommands: string[];
	stringTypes: regexFactory.StringPatternType[];
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
	REGEX_MAP: { [tokenType in TokenType]: RegExp };

	INDEXED_PLACEHOLDER_REGEX?: RegExp;
	IDENT_NAMED_PLACEHOLDER_REGEX?: RegExp;
	STRING_NAMED_PLACEHOLDER_REGEX?: RegExp;

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
			[TokenType.WORD]: regexFactory.createWordRegex(cfg.specialWordChars),
			[TokenType.STRING]: regexFactory.createStringRegex(cfg.stringTypes),
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
			[TokenType.OPERATOR]: regexFactory.createOperatorRegex('+-/*%&|^><=.,;[]{}`:$', [
				'<>',
				'<=',
				'>=',
				'!=',
				...(cfg.operators ?? []),
			]),
			[TokenType.BLOCK_START]: regexFactory.createParenRegex(cfg.blockStart),
			[TokenType.BLOCK_END]: regexFactory.createParenRegex(cfg.blockEnd),
			[TokenType.LINE_COMMENT]: regexFactory.createLineCommentRegex(cfg.lineCommentTypes),
			[TokenType.BLOCK_COMMENT]: /^(\/\*[^]*?(?:\*\/|$))/u,
			[TokenType.NUMBER]:
				/^((-\s*)?[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+(\.[0-9]+)?)?|0x[0-9a-fA-F]+|0b[01]+)\b/u,
			[TokenType.PLACEHOLDER]: NULL_REGEX, // matches nothing
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
	}

	tokenize(input: string) {
		let lexerOptions: { [key: string]: moo.Rule | RegExp } = {
			WS: /[ \t]+/,
			NL: { match: /\n/, lineBreaks: true },
			[TokenType.WORD]: new RegExp(
				/(?:\p{Alphabetic}|\p{Mark}|\p{Decimal_Number}|\p{Connector_Punctuation}|\p{Join_Control})+/u,
				'u'
			),
			[TokenType.OPERATOR]: new RegExp('[+-/*%&|^><=.,;\\[\\]\\}\\{`:$]', 'u'),
			[TokenType.BLOCK_START]: /[(]/,
			[TokenType.BLOCK_END]: /[)]/,
		};
		lexerOptions = Object.entries(lexerOptions).reduce(
			(acc, [name, regex]) => ({
				...acc,
				[name]:
					regex instanceof RegExp
						? new RegExp(regex, 'u')
						: { ...regex, match: new RegExp(regex.match as string | RegExp, 'u') },
			}),
			{} as { [key: string]: moo.Rule | RegExp }
		);

		const lexer = moo.compile(lexerOptions);
		lexer.reset(input);
		return Array.from(lexer);
	}
}
