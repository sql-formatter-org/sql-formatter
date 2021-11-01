import tokenTypes from './tokenTypes';
import * as regexFactory from './regexFactory';
import { escapeRegExp } from '../utils';
import type { Token, TokenType } from './token';

interface TokenizerOptions {
	reservedWords: string[];
	reservedCommands: string[];
	reservedNewlineWords: string[];
	reservedDependentClauses: string[];
	reservedTopLevelWordsNoIndent: string[];
	stringTypes: regexFactory.StringPatternType[];
	openParens: string[];
	closeParens: string[];
	indexedPlaceholderTypes?: string[];
	namedPlaceholderTypes: string[];
	lineCommentTypes: string[];
	specialWordChars?: string[];
	operators?: string[];
}

export default class Tokenizer {
	WHITESPACE_REGEX: RegExp;
	NUMBER_REGEX: RegExp;
	OPERATOR_REGEX: RegExp;
	BLOCK_COMMENT_REGEX: RegExp;
	LINE_COMMENT_REGEX: RegExp;
	RESERVED_PLAIN_REGEX: RegExp;
	RESERVED_DEPENDENT_CLAUSE_REGEX: RegExp;
	RESERVED_NEWLINE_REGEX: RegExp;
	RESERVED_COMMAND_REGEX: RegExp;
	RESERVED_TOP_LEVEL_NO_INDENT_REGEX: RegExp;
	WORD_REGEX: RegExp;
	STRING_REGEX: RegExp;
	OPEN_PAREN_REGEX: RegExp;
	CLOSE_PAREN_REGEX: RegExp;
	INDEXED_PLACEHOLDER_REGEX?: RegExp;
	IDENT_NAMED_PLACEHOLDER_REGEX?: RegExp;
	STRING_NAMED_PLACEHOLDER_REGEX?: RegExp;

	/**
	 * @param {TokenizerOptions} cfg
	 *  @param {String[]} cfg.reservedWords: Reserved words in SQL
	 *  @param {String[]} cfg.reservedDependentClauses: Words that following a specific Statement and must have data attached
	 *  @param {String[]} cfg.reservedNewlineWords: Words that are set to newline
	 *  @param {String[]} cfg.reservedCommands: Words that are set to new line separately
	 *  @param {String[]} cfg.reservedTopLevelWordsNoIndent: Words that are top level but have no indentation
	 *  @param {String[]} cfg.stringTypes: String types to enable: "", '', ``, [], N''
	 *  @param {String[]} cfg.openParens: Opening parentheses to enable, like (, [
	 *  @param {String[]} cfg.closeParens: Closing parentheses to enable, like ), ]
	 *  @param {String[]} cfg.indexedPlaceholderTypes: Prefixes for indexed placeholders, like ?
	 *  @param {String[]} cfg.namedPlaceholderTypes: Prefixes for named placeholders, like @ and :
	 *  @param {String[]} cfg.lineCommentTypes: Line comments to enable, like # and --
	 *  @param {String[]} cfg.specialWordChars: Special chars that can be found inside of words, like @ and #
	 *  @param {String[]} cfg.operators: Additional operators to recognize
	 */
	constructor(cfg: TokenizerOptions) {
		this.WHITESPACE_REGEX = /^(\s+)/u;
		this.NUMBER_REGEX =
			/^((-\s*)?[0-9]+(\.[0-9]+)?([eE]-?[0-9]+(\.[0-9]+)?)?|0x[0-9a-fA-F]+|0b[01]+)\b/u;

		this.OPERATOR_REGEX = regexFactory.createOperatorRegex([
			'<>',
			'<=',
			'>=',
			...(cfg.operators ?? []),
		]);

		this.BLOCK_COMMENT_REGEX = /^(\/\*[^]*?(?:\*\/|$))/u;
		this.LINE_COMMENT_REGEX = regexFactory.createLineCommentRegex(cfg.lineCommentTypes);

		this.RESERVED_PLAIN_REGEX = regexFactory.createReservedWordRegex(cfg.reservedWords);
		this.RESERVED_NEWLINE_REGEX = regexFactory.createReservedWordRegex(cfg.reservedNewlineWords);
		this.RESERVED_DEPENDENT_CLAUSE_REGEX = regexFactory.createReservedWordRegex(
			cfg.reservedDependentClauses ?? []
		);
		this.RESERVED_COMMAND_REGEX = regexFactory.createReservedWordRegex(cfg.reservedCommands);
		this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX = regexFactory.createReservedWordRegex(
			cfg.reservedTopLevelWordsNoIndent
		);

		this.WORD_REGEX = regexFactory.createWordRegex(cfg.specialWordChars);
		this.STRING_REGEX = regexFactory.createStringRegex(cfg.stringTypes);

		this.OPEN_PAREN_REGEX = regexFactory.createParenRegex(cfg.openParens);
		this.CLOSE_PAREN_REGEX = regexFactory.createParenRegex(cfg.closeParens);

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

	getNextToken(input: string, previousToken?: Token) {
		return (this.getCommentToken(input) ||
			this.getStringToken(input) ||
			this.getOpenParenToken(input) ||
			this.getCloseParenToken(input) ||
			this.getPlaceholderToken(input) ||
			this.getNumberToken(input) ||
			this.getReservedWordToken(input, previousToken) ||
			this.getWordToken(input) ||
			this.getOperatorToken(input)) as Token;
	}

	getCommentToken(input: string) {
		return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
	}

	getLineCommentToken(input: string) {
		return this.getTokenOnFirstMatch({
			input,
			type: tokenTypes.LINE_COMMENT,
			regex: this.LINE_COMMENT_REGEX,
		});
	}

	getBlockCommentToken(input: string) {
		return this.getTokenOnFirstMatch({
			input,
			type: tokenTypes.BLOCK_COMMENT,
			regex: this.BLOCK_COMMENT_REGEX,
		});
	}

	getStringToken(input: string) {
		return this.getTokenOnFirstMatch({
			input,
			type: tokenTypes.STRING,
			regex: this.STRING_REGEX,
		});
	}

	getOpenParenToken(input: string) {
		return this.getTokenOnFirstMatch({
			input,
			type: tokenTypes.OPEN_PAREN,
			regex: this.OPEN_PAREN_REGEX,
		});
	}

	getCloseParenToken(input: string) {
		return this.getTokenOnFirstMatch({
			input,
			type: tokenTypes.CLOSE_PAREN,
			regex: this.CLOSE_PAREN_REGEX,
		});
	}

	getPlaceholderToken(input: string) {
		return (
			this.getIdentNamedPlaceholderToken(input) ||
			this.getStringNamedPlaceholderToken(input) ||
			this.getIndexedPlaceholderToken(input)
		);
	}

	getIdentNamedPlaceholderToken(input: string) {
		return this.getPlaceholderTokenWithKey({
			input,
			regex: this.IDENT_NAMED_PLACEHOLDER_REGEX,
			parseKey: v => v.slice(1),
		});
	}

	getStringNamedPlaceholderToken(input: string) {
		return this.getPlaceholderTokenWithKey({
			input,
			regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
			parseKey: v => this.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) }),
		});
	}

	getIndexedPlaceholderToken(input: string) {
		return this.getPlaceholderTokenWithKey({
			input,
			regex: this.INDEXED_PLACEHOLDER_REGEX,
			parseKey: v => v.slice(1),
		});
	}

	getPlaceholderTokenWithKey({
		input,
		regex,
		parseKey,
	}: {
		input: string;
		regex?: RegExp;
		parseKey: (k: string) => string;
	}) {
		const token = this.getTokenOnFirstMatch({ input, regex, type: tokenTypes.PLACEHOLDER });
		if (token) {
			token.key = parseKey(token.value);
		}
		return token;
	}

	getEscapedPlaceholderKey({ key, quoteChar }: { key: string; quoteChar: string }) {
		return key.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar);
	}

	// Decimal, binary, or hex numbers
	getNumberToken(input: string) {
		return this.getTokenOnFirstMatch({
			input,
			type: tokenTypes.NUMBER,
			regex: this.NUMBER_REGEX,
		});
	}

	// Punctuation and symbols
	getOperatorToken(input: string) {
		return this.getTokenOnFirstMatch({
			input,
			type: tokenTypes.OPERATOR,
			regex: this.OPERATOR_REGEX,
		});
	}

	getReservedWordToken(input: string, previousToken?: Token) {
		// A reserved word cannot be preceded by a '.', '[', '`', or '"'
		// this makes it so for "mytable.from", [from], `from`, "from" - from is not considered a reserved word
		if (previousToken && ['.', '[', '`', '"'].includes(previousToken.value)) {
			return undefined;
		}

		const reservedTokenMap = {
			[tokenTypes.RESERVED_COMMAND]: this.RESERVED_COMMAND_REGEX,
			[tokenTypes.RESERVED_NEWLINE]: this.RESERVED_NEWLINE_REGEX,
			[tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT]: this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX,
			[tokenTypes.RESERVED_DEPENDENT_CLAUSE]: this.RESERVED_DEPENDENT_CLAUSE_REGEX,
			[tokenTypes.RESERVED]: this.RESERVED_PLAIN_REGEX,
		};

		return Object.entries(reservedTokenMap).reduce(
			(matchedToken, [tokenType, tokenRegex]) =>
				matchedToken || this.getTokenOnFirstMatch({ input, type: tokenType, regex: tokenRegex }),
			undefined as Token | undefined
		);
	}

	getWordToken(input: string) {
		return this.getTokenOnFirstMatch({
			input,
			type: tokenTypes.WORD,
			regex: this.WORD_REGEX,
		});
	}

	getTokenOnFirstMatch({ input, type, regex }: { input: string; type: TokenType; regex?: RegExp }) {
		if (!regex) {
			return undefined;
		}
		const matches = input.match(regex);
		return matches ? ({ type, value: matches[1] } as Token) : undefined;
	}
}
