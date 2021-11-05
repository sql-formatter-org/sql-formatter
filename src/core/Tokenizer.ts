import * as regexFactory from './regexFactory';
import { escapeRegExp } from '../utils';
import { Token, TokenType } from './token'; // convert to partial type import in TS 4.5

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
	specialWordChars?: string[];
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

		this.REGEX_MAP = {
			[TokenType.WORD]: regexFactory.createWordRegex(cfg.specialWordChars),
			[TokenType.STRING]: regexFactory.createStringRegex(cfg.stringTypes),
			[TokenType.RESERVED_KEYWORD]: regexFactory.createReservedWordRegex(cfg.reservedKeywords),
			[TokenType.RESERVED_DEPENDENT_CLAUSE]: regexFactory.createReservedWordRegex(
				cfg.reservedDependentClauses ?? []
			),
			[TokenType.RESERVED_LOGICAL_OPERATOR]: regexFactory.createReservedWordRegex(
				cfg.reservedLogicalOperators
			),
			[TokenType.RESERVED_COMMAND]: regexFactory.createReservedWordRegex(cfg.reservedCommands),
			[TokenType.RESERVED_BINARY_COMMAND]: regexFactory.createReservedWordRegex(
				cfg.reservedBinaryCommands
			),
			[TokenType.OPERATOR]: regexFactory.createOperatorRegex([
				'<>',
				'<=',
				'>=',
				...(cfg.operators ?? []),
			]),
			[TokenType.BLOCK_START]: regexFactory.createParenRegex(cfg.blockStart),
			[TokenType.BLOCK_END]: regexFactory.createParenRegex(cfg.blockEnd),
			[TokenType.LINE_COMMENT]: regexFactory.createLineCommentRegex(cfg.lineCommentTypes),
			[TokenType.BLOCK_COMMENT]: /^(\/\*[^]*?(?:\*\/|$))/u,
			[TokenType.NUMBER]:
				/^((-\s*)?[0-9]+(\.[0-9]+)?([eE]-?[0-9]+(\.[0-9]+)?)?|0x[0-9a-fA-F]+|0b[01]+)\b/u,
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

	/**
	 * Takes a SQL string and breaks it into tokens.
	 * Each token is an object with type and value.
	 *
	 * @param {String} input The SQL string
	 * @return {Token[]} tokens An array of tokens.
	 *  @return {String} token.type
	 *  @return {String} token.value
	 *  @return {String} token.whitespaceBefore Preceding whitespace
	 */
	tokenize(input: string) {
		const tokens: Token[] = [];
		let token: Token | undefined;

		// Keep processing the string until it is empty
		while (input.length) {
			// grab any preceding whitespace
			const whitespaceBefore = this.getWhitespace(input);
			input = input.substring(whitespaceBefore.length);

			if (input.length) {
				// Get the next token and the token type
				token = this.getNextToken(input, token);
				// Advance the string
				input = input.substring(token.value.length);

				tokens.push({ ...token, whitespaceBefore });
			}
		}
		return tokens;
	}

	getWhitespace(input: string) {
		const matches = input.match(this.WHITESPACE_REGEX);
		return matches ? matches[1] : '';
	}

	matchToken = (tokenType: TokenType) => (input: string) =>
		this.getTokenOnFirstMatch({
			input,
			type: tokenType,
			regex: this.REGEX_MAP[tokenType],
		});

	getNextToken(input: string, previousToken?: Token) {
		return (this.matchToken(TokenType.LINE_COMMENT)(input) ||
			this.matchToken(TokenType.BLOCK_COMMENT)(input) ||
			this.matchToken(TokenType.STRING)(input) ||
			this.matchToken(TokenType.BLOCK_START)(input) ||
			this.matchToken(TokenType.BLOCK_END)(input) ||
			this.getPlaceholderToken(input) ||
			this.matchToken(TokenType.NUMBER)(input) ||
			this.getReservedWordToken(input, previousToken) ||
			this.matchToken(TokenType.WORD)(input) ||
			this.matchToken(TokenType.OPERATOR)(input)) as Token;
	}

	getPlaceholderToken(input: string) {
		const placeholderTokenRegexMap: { regex: RegExp; parseKey: (s: string) => string }[] = [
			{
				regex: this.IDENT_NAMED_PLACEHOLDER_REGEX ?? NULL_REGEX,
				parseKey: v => v.slice(1),
			},
			{
				regex: this.STRING_NAMED_PLACEHOLDER_REGEX ?? NULL_REGEX,
				parseKey: v =>
					this.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) }),
			},
			{
				regex: this.INDEXED_PLACEHOLDER_REGEX ?? NULL_REGEX,
				parseKey: v => v.slice(1),
			},
		];

		return placeholderTokenRegexMap.reduce((acc, { regex, parseKey }) => {
			const token = this.getTokenOnFirstMatch({ input, regex, type: TokenType.PLACEHOLDER });
			return token ? { ...token, key: parseKey(token.value) } : acc;
		}, undefined as Token | undefined);
	}

	getEscapedPlaceholderKey({ key, quoteChar }: { key: string; quoteChar: string }) {
		return key.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar);
	}

	getReservedWordToken(input: string, previousToken?: Token) {
		// A reserved word cannot be preceded by a '.', '[', '`', or '"'
		// this makes it so for "mytable.from", [from], `from`, "from" - from is not considered a reserved word
		if (previousToken && ['.', '[', '`', '"'].includes(previousToken.value)) {
			return undefined;
		}

		const reservedTokenList = [
			TokenType.RESERVED_COMMAND,
			TokenType.RESERVED_BINARY_COMMAND,
			TokenType.RESERVED_DEPENDENT_CLAUSE,
			TokenType.RESERVED_LOGICAL_OPERATOR,
			TokenType.RESERVED_KEYWORD,
		];

		return reservedTokenList.reduce(
			(matchedToken, tokenType) => matchedToken || this.matchToken(tokenType)(input),
			undefined as Token | undefined
		);
	}

	getTokenOnFirstMatch({ input, type, regex }: { input: string; type: TokenType; regex: RegExp }) {
		const matches = input.match(regex);
		return matches ? ({ type, value: matches[1] } as Token) : undefined;
	}
}
