import tokenTypes from './tokenTypes';
import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import { trimSpacesEnd } from '../utils';
import {
	isAnd,
	isAs,
	isBetween,
	isEnd,
	isLimit,
	isReserved,
	isSelect,
	isTopLevel,
	Token,
} from './token';
import Tokenizer from './Tokenizer';
import type { FormatOptions } from '../sqlFormatter';
import { AliasMode, NewlineMode } from '../types';

export default class Formatter {
	cfg: FormatOptions;
	newline: FormatOptions['newline'];
	currentNewline: boolean;
	lineWidth: number;
	indentation: Indentation;
	inlineBlock: InlineBlock;
	params: Params;

	previousReservedToken: Token;
	withinSelect: boolean;
	tokens: Token[];
	index: number;

	/**
	 * @param {FormatOptions} cfg
	 *  @param {String} cfg.language
	 *  @param {String} cfg.indent
	 *  @param {Boolean} cfg.uppercase
	 *  @param {NewlineOptions} cfg.newline
	 * 		@param {NewlineMode} cfg.newline.mode
	 * 		@param {Integer} cfg.newline.itemCount
	 *  @param {Integer} cfg.lineWidth
	 *  @param {Integer} cfg.linesBetweenQueries
	 *  @param {ParamItems | string[]} cfg.params
	 */
	constructor(cfg: FormatOptions) {
		this.cfg = cfg;
		this.newline = cfg.newline;
		this.currentNewline = true;
		this.lineWidth = cfg.lineWidth;
		this.indentation = new Indentation(this.cfg.indent);
		this.inlineBlock = new InlineBlock(this.lineWidth);
		this.params = new Params(this.cfg.params);

		this.previousReservedToken = {} as Token;
		this.withinSelect = false;
		this.tokens = [];
		this.index = 0;
	}

	/**
	 * SQL Tokenizer for this formatter, provided by subclasses.
	 */
	tokenizer(): Tokenizer {
		throw new Error('tokenizer() not implemented by subclass');
	}

	/**
	 * Reprocess and modify a token based on parsed context.
	 *
	 * @param {Token} token The token to modify
	 * @return {Token} new token or the original
	 */
	tokenOverride(token: Token): Token {
		// subclasses can override this to modify tokens during formatting
		return token;
	}

	/**
	 * Formats whitespace in a SQL string to make it easier to read.
	 *
	 * @param {String} query The SQL query string
	 * @return {String} formatted query
	 */
	format(query: string): string {
		this.tokens = this.tokenizer().tokenize(query);
		const formattedQuery = this.getFormattedQueryFromTokens();

		return formattedQuery.trim();
	}

	getFormattedQueryFromTokens() {
		let formattedQuery = '';

		this.tokens.forEach((token: Token, index) => {
			this.index = index;

			token = this.tokenOverride(token);
			if (isReserved(token)) {
				this.previousReservedToken = token;
				if (isTopLevel(token)) {
					this.withinSelect = isSelect(token);
				}
			}

			if (token.type === tokenTypes.LINE_COMMENT) {
				formattedQuery = this.formatLineComment(token, formattedQuery);
			} else if (token.type === tokenTypes.BLOCK_COMMENT) {
				formattedQuery = this.formatBlockComment(token, formattedQuery);
			} else if (token.type === tokenTypes.RESERVED_TOP_LEVEL) {
				this.currentNewline = this.checkNewline(index);
				formattedQuery = this.formatTopLevelReservedWord(token, formattedQuery);
			} else if (token.type === tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT) {
				formattedQuery = this.formatTopLevelReservedWordNoIndent(token, formattedQuery);
			} else if (token.type === tokenTypes.RESERVED_NEWLINE) {
				formattedQuery = this.formatNewlineReservedWord(token, formattedQuery);
			} else if (token.type === tokenTypes.RESERVED) {
				if (!(isAs(token) && this.cfg.aliasAs === AliasMode.never)) {
					// do not format if skipping AS
					formattedQuery = this.formatWithSpaces(token, formattedQuery);
					this.previousReservedToken = token;
				}
			} else if (token.type === tokenTypes.OPEN_PAREN) {
				formattedQuery = this.formatOpeningParentheses(token, formattedQuery);
			} else if (token.type === tokenTypes.CLOSE_PAREN) {
				formattedQuery = this.formatClosingParentheses(token, formattedQuery);
			} else if (token.type === tokenTypes.PLACEHOLDER) {
				formattedQuery = this.formatPlaceholder(token, formattedQuery);
			} else if (token.value === ',') {
				formattedQuery = this.formatComma(token, formattedQuery);
			} else if (token.value === ':') {
				formattedQuery = this.formatWithSpaces(token, formattedQuery, 'after');
			} else if (token.value === '.') {
				formattedQuery = this.formatWithoutSpaces(token, formattedQuery);
			} else if (token.value === ';') {
				formattedQuery = this.formatQuerySeparator(token, formattedQuery);
			} else if (
				token.value === '[' ||
				(token.value === '`' && this.tokenLookAhead(2)?.value === '`')
			) {
				formattedQuery = this.formatWithSpaces(token, formattedQuery, 'before');
			} else if (
				token.value === ']' ||
				(token.value === '`' && this.tokenLookBehind(2)?.value === '`')
			) {
				formattedQuery = this.formatWithSpaces(token, formattedQuery, 'after');
			} else if (token.type === tokenTypes.OPERATOR && this.cfg.denseOperators) {
				formattedQuery = this.formatWithoutSpaces(token, formattedQuery);
			} else {
				if (this.cfg.aliasAs !== AliasMode.never) {
					formattedQuery = this.formatAliases(token, formattedQuery);
				}
				formattedQuery = this.formatWithSpaces(token, formattedQuery);
			}
		});
		return formattedQuery;
	}

	formatAliases(token: Token, query: string) {
		const prevToken = this.tokenLookBehind();
		const nextToken = this.tokenLookAhead();
		const asToken = { type: tokenTypes.RESERVED, value: this.cfg.uppercase ? 'AS' : 'as' };

		const missingTableAlias = // if table alias is missing and alias is always
			this.cfg.aliasAs === AliasMode.always &&
			token.type === tokenTypes.WORD &&
			prevToken?.value === ')';

		const missingSelectColumnAlias = // if select column alias is missing and alias is not never
			this.withinSelect &&
			token.type === tokenTypes.WORD &&
			(isEnd(prevToken) || // isAs(prevToken) ||
				(prevToken?.type === tokenTypes.WORD &&
					(nextToken?.value === ',' || isTopLevel(nextToken))));

		if (missingTableAlias || missingSelectColumnAlias) {
			return this.formatWithSpaces(asToken, query);
		}
		return query;
	}

	checkNewline = (index: number) => {
		if (
			this.newline.mode === NewlineMode.always ||
			this.tokens.some(({ type, value }) => type === tokenTypes.OPEN_PAREN && value.length > 1) // auto break on CASE statements
		) {
			return true;
		}
		if (this.newline.mode === NewlineMode.never) {
			return false;
		}
		const tail = this.tokens.slice(index + 1);
		const nextTokens = tail.slice(
			0,
			tail.findIndex(
				({ type }) =>
					type === tokenTypes.RESERVED_TOP_LEVEL ||
					type === tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT ||
					type === tokenTypes.RESERVED_NEWLINE
			)
		);

		const numItems = nextTokens.reduce(
			(acc, { type, value }) => {
				if (value === ',' && !acc.inParen) {
					return { ...acc, count: acc.count + 1 };
				} // count commas between items in clause
				if (type === tokenTypes.OPEN_PAREN) {
					return { ...acc, inParen: true };
				} // don't count commas in functions
				if (type === tokenTypes.CLOSE_PAREN) {
					return { ...acc, inParen: false };
				}
				return acc;
			},
			{ count: 1, inParen: false } // start with 1 for first word
		).count;

		if (this.newline.mode === NewlineMode.itemCount) {
			return numItems > this.newline.itemCount!;
		}

		// calculate length if it were all inline
		const inlineWidth = `${this.tokens[index].whitespaceBefore}${
			this.tokens[index].value
		} ${nextTokens.map(({ value }) => (value === ',' ? value + ' ' : value)).join('')}`.length;

		if (this.newline.mode === NewlineMode.lineWidth) {
			return inlineWidth > this.lineWidth;
		} else if (this.newline.mode === NewlineMode.hybrid) {
			return numItems > this.newline.itemCount! || inlineWidth > this.lineWidth;
		}

		return true;
	};

	formatLineComment(token: Token, query: string) {
		return this.addNewline(query + this.show(token));
	}

	formatBlockComment(token: Token, query: string) {
		return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
	}

	indentComment(comment: string) {
		return comment.replace(/\n[ \t]*/gu, '\n' + this.indentation.getIndent() + ' ');
	}

	formatTopLevelReservedWordNoIndent(token: Token, query: string) {
		// this.indentation.decreaseTopLevel();
		query = this.addNewline(query) + this.equalizeWhitespace(this.show(token));
		return this.addNewline(query);
	}

	formatTopLevelReservedWord(token: Token, query: string) {
		// this.indentation.decreaseTopLevel();

		query = this.addNewline(query);

		// this.indentation.increaseTopLevel();

		query += this.equalizeWhitespace(this.show(token));
		if (this.currentNewline) {
			query = this.addNewline(query);
		} else {
			query += ' ';
		}
		return query;
	}

	formatNewlineReservedWord(token: Token, query: string) {
		if (isAnd(token) && isBetween(this.tokenLookBehind(2))) {
			return this.formatWithSpaces(token, query);
		}
		return this.addNewline(query) + this.equalizeWhitespace(this.show(token)) + ' ';
	}

	// Replace any sequence of whitespace characters with single space
	equalizeWhitespace(string: string) {
		return string.replace(/\s+/gu, ' ');
	}

	// Opening parentheses increase the block indent level and start a new line
	formatOpeningParentheses(token: Token, query: string) {
		// Take out the preceding space unless there was whitespace there in the original query
		// or another opening parens or line comment
		const preserveWhitespaceFor = {
			[tokenTypes.OPEN_PAREN]: true,
			[tokenTypes.LINE_COMMENT]: true,
			[tokenTypes.OPERATOR]: true,
		};
		if (
			token.whitespaceBefore?.length === 0 &&
			!preserveWhitespaceFor[this.tokenLookBehind()?.type]
		) {
			query = trimSpacesEnd(query);
		}
		query += this.show(token);

		this.inlineBlock.beginIfPossible(this.tokens, this.index);

		if (!this.inlineBlock.isActive()) {
			this.indentation.increaseBlockLevel();
			query = this.addNewline(query);
		}
		return query;
	}

	// Closing parentheses decrease the block indent level
	formatClosingParentheses(token: Token, query: string) {
		if (this.inlineBlock.isActive()) {
			this.inlineBlock.end();
			return this.formatWithSpaces(token, query, 'after');
		} else {
			this.indentation.decreaseBlockLevel();
			return this.formatWithSpaces(token, this.addNewline(query));
		}
	}

	formatPlaceholder(token: Token, query: string) {
		return query + this.params.get(token) + ' ';
	}

	// Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
	formatComma(token: Token, query: string) {
		query = trimSpacesEnd(query) + this.show(token) + ' ';

		if (this.inlineBlock.isActive()) {
			return query;
		} else if (isLimit(this.previousReservedToken)) {
			return query;
		} else if (this.currentNewline) {
			return this.addNewline(query);
		} else {
			return query;
		}
	}

	formatWithoutSpaces(token: Token, query: string) {
		return trimSpacesEnd(query) + this.show(token);
	}

	formatWithSpaces(token: Token, query: string, preserve: 'before' | 'after' | 'both' = 'both') {
		const before = preserve === 'after' ? trimSpacesEnd(query) : query;
		const after = preserve === 'before' ? '' : ' ';
		return before + this.show(token) + after;
	}

	formatQuerySeparator(token: Token, query: string) {
		this.indentation.resetIndentation();
		query = trimSpacesEnd(query);
		if (this.cfg.semicolonNewline) {
			query += '\n';
		}
		return query + this.show(token) + '\n'.repeat(this.cfg.linesBetweenQueries || 1);
	}

	// Converts token to string (uppercasing it if needed)
	show(token: Token) {
		if (
			isReserved(token) ||
			token.type === tokenTypes.OPEN_PAREN ||
			token.type === tokenTypes.CLOSE_PAREN
		) {
			return this.cfg.uppercase ? token.value.toUpperCase() : token.value.toLowerCase();
		} else {
			return token.value;
		}
	}

	addNewline(query: string) {
		query = trimSpacesEnd(query);
		if (!query.endsWith('\n')) {
			query += '\n';
		}
		return query + this.indentation.getIndent();
	}

	tokenLookBehind(n = 1) {
		return this.tokens[this.index - n];
	}

	tokenLookAhead(n = 1) {
		return this.tokens[this.index + n];
	}
}
