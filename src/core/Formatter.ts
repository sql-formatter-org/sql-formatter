import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import { maxLength, trimSpacesEnd } from '../utils';
import { isReserved, isCommand, isToken, Token, TokenType, ZWS } from './token';
import Tokenizer from './Tokenizer';
import type { FormatOptions } from '../sqlFormatter';
import { AliasMode, CommaPosition, KeywordMode, NewlineMode } from '../types';

/** Main formatter class that produces a final output string from list of tokens */
export default class Formatter {
	cfg: FormatOptions & { tenSpace?: boolean };
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
	 *	@param {FormatOptions} cfg - config object
	 *	@param {string} cfg.language - the current SQL dialect
	 *	@param {string} cfg.indent - the indentation string, either tabs or a number of spaces
	 *	@param {Boolean} cfg.uppercase - whether to use uppercase keywords
	 *	@param {NewlineMode} cfg.newline - setting to control when to break onto newlines
	 *	@param {Integer} cfg.lineWidth - the maximum line width before breaking
	 *	@param {Integer} cfg.linesBetweenQueries - the number of blank lines between each query
	 *	@param {ParamItems | string[]} cfg.params - placeholder tokens to substitute
	 */
	constructor(cfg: FormatOptions) {
		this.cfg = cfg;
		this.cfg.tenSpace =
			this.cfg.keywordPosition === KeywordMode.tenSpaceLeft ||
			this.cfg.keywordPosition === KeywordMode.tenSpaceRight;
		this.newline = cfg.newline;
		this.currentNewline = true;
		this.lineWidth = cfg.lineWidth;
		this.indentation = new Indentation(this.cfg.indent);
		this.inlineBlock = new InlineBlock(this.lineWidth);
		this.params = new Params(this.cfg.params);

		this.previousReservedToken = {} as Token;
		this.withinSelect = false;
		this.tokens = [];
		this.index = -1;
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
	 * @param {Token} token - The token to modify
	 * @return {Token} new token or the original
	 */
	tokenOverride(token: Token): Token {
		// subclasses can override this to modify tokens during formatting
		return token;
	}

	/**
	 * Formats whitespace in a SQL string to make it easier to read.
	 *
	 * @param {string} query - The SQL query string
	 */
	format(query: string): string {
		this.tokens = this.tokenizer().tokenize(query);
		const formattedQuery = this.getFormattedQueryFromTokens();
		const finalQuery = this.postFormat(formattedQuery);

		return finalQuery.replace(/^\n*/u, '').trimEnd();
	}

	/**
	 * Does post-processing on the formatted query.
	 * @param {string} query - the query string produced from `this.format`
	 */
	postFormat(query: string): string {
		if (this.cfg.tabulateAlias) {
			query = this.formatAliasPositions(query);
		}
		if (this.cfg.commaPosition !== CommaPosition.after) {
			query = this.formatCommaPositions(query);
		}

		return query;
	}

	/**
	 * Handles comma placement - either before, after or tabulated
	 * @param {string} query - input query string
	 */
	formatCommaPositions(query: string): string {
		// const trailingComma = /,$/;
		const lines = query.split('\n');
		let newQuery: string[] = [];
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].match(/.*,$/)) {
				let commaLines = [lines[i]];
				// find all lines in comma-bound clause, + 1
				while (lines[i++].match(/.*,$/)) {
					commaLines.push(lines[i]);
				}

				if (this.cfg.commaPosition === CommaPosition.tabular) {
					commaLines = commaLines.map(commaLine => commaLine.replace(/,$/, ''));
					const commaMaxLength = maxLength(commaLines); // get longest for alignment
					commaLines = commaLines.map((commaLine, j) =>
						j < commaLines.length - 1 // do not add comma for last item
							? commaLine + ' '.repeat(commaMaxLength - commaLine.length) + ','
							: commaLine
					);
				} else if (this.cfg.commaPosition === CommaPosition.before) {
					const isTabs = this.cfg.indent.includes('\t'); // loose tab check
					commaLines = commaLines.map(commaLine => commaLine.replace(/,$/, ''));
					const whitespaceRegex = this.tokenizer().WHITESPACE_REGEX;
					commaLines = commaLines.map((commaLine, j) =>
						j // do not add comma for first item
							? commaLine.replace(
									whitespaceRegex,
									commaLine.match(whitespaceRegex)![1].replace(
										new RegExp((isTabs ? '\t' : this.cfg.indent) + '$'), // replace last two spaces in preceding whitespace with ', '
										(isTabs ? '    ' : this.cfg.indent).replace(/ {2}$/, ', ') // using 4 width tabs
									)
							  )
							: commaLine
					);
				}

				newQuery = [...newQuery, ...commaLines];
			}
			newQuery.push(lines[i]);
		}

		return newQuery.join('\n');
	}

	/**
	 * Handles select alias placement - tabulates if enabled
	 * @param {string} query - input query string
	 */
	formatAliasPositions(query: string): string {
		const lines = query.split('\n');

		let newQuery: string[] = [];
		for (let i = 0; i < lines.length; i++) {
			// find SELECT rows with trailing comma, if no comma (only one row) - no-op
			if (lines[i].match(/^\s*SELECT/i)) {
				let aliasLines: string[] = [];
				if (lines[i].match(/.*,$/)) {
					aliasLines = [lines[i]]; // add select to aliasLines in case of tenSpace formats
				} else {
					newQuery.push(lines[i]); // add select to new query
					if (lines[i].match(/^\s*SELECT\s+.+(?!,$)/i)) {
						continue;
					}
					aliasLines.push(lines[++i]);
				}

				// get all lines in SELECT clause
				while (lines[i++].match(/.*,$/)) {
					aliasLines.push(lines[i]);
				}

				const splitLines = aliasLines
					.map(line => line.split(/(?<=[^\s]+) (AS )?(?=[^\s]+,?$)/i)) // break lines into alias with optional AS, and all preceding text
					.map(slugs => ({
						precedingText: slugs[0], // always first split
						alias: slugs.length > 1 ? slugs[slugs.length - 1] : undefined, // always last in split
						as: slugs.length === 3 ? slugs[1] : undefined, // 2nd if AS is present, else omitted
					}));

				const aliasMaxLength = maxLength(
					splitLines.map(({ precedingText }) => precedingText.replace(/\s*,\s*$/, '')) // get longest of precedingText, trim trailing comma for non-alias columns
				);
				aliasLines = splitLines.map(
					({ precedingText, as, alias }) =>
						precedingText +
						(alias
							? ' '.repeat(aliasMaxLength - precedingText.length + 1) + (as ?? '') + alias
							: '')
				);
				newQuery = [...newQuery, ...aliasLines];
			}
			newQuery.push(lines[i]);
		}

		return newQuery.join('\n');
	}

	/**
	 * Performs main construction of query from token list, delegates to other methods for formatting based on token criteria
	 * @return {string} formatted query
	 */
	getFormattedQueryFromTokens(): string {
		let formattedQuery = '';

		for (this.index = 0; this.index < this.tokens.length; this.index++) {
			let token = this.tokenOverride(this.tokens[this.index]);

			if (isReserved(token)) {
				this.previousReservedToken = token;
				if (token.type !== TokenType.RESERVED_KEYWORD) {
					token = this.tenSpacedToken(token);
				}
				if (token.type === TokenType.RESERVED_COMMAND) {
					this.withinSelect = isToken.SELECT(token);
				}
			}

			if (token.type === TokenType.LINE_COMMENT) {
				formattedQuery = this.formatLineComment(token, formattedQuery);
			} else if (token.type === TokenType.BLOCK_COMMENT) {
				formattedQuery = this.formatBlockComment(token, formattedQuery);
			} else if (token.type === TokenType.RESERVED_COMMAND) {
				this.currentNewline = this.checkNewline(this.index);
				formattedQuery = this.formatCommand(token, formattedQuery);
			} else if (token.type === TokenType.RESERVED_BINARY_COMMAND) {
				formattedQuery = this.formatBinaryCommand(token, formattedQuery);
			} else if (token.type === TokenType.RESERVED_DEPENDENT_CLAUSE) {
				formattedQuery = this.formatDependentClause(token, formattedQuery);
			} else if (token.type === TokenType.RESERVED_LOGICAL_OPERATOR) {
				formattedQuery = this.formatLogicalOperator(token, formattedQuery);
			} else if (token.type === TokenType.RESERVED_KEYWORD) {
				formattedQuery = this.formatKeyword(token, formattedQuery);
				this.previousReservedToken = token;
			} else if (token.type === TokenType.BLOCK_START) {
				formattedQuery = this.formatBlockStart(token, formattedQuery);
			} else if (token.type === TokenType.BLOCK_END) {
				formattedQuery = this.formatBlockEnd(token, formattedQuery);
			} else if (token.type === TokenType.PLACEHOLDER) {
				formattedQuery = this.formatPlaceholder(token, formattedQuery);
			} else if (token.type === TokenType.OPERATOR) {
				formattedQuery = this.formatOperator(token, formattedQuery);
			} else {
				formattedQuery = this.formatWord(token, formattedQuery);
			}
		}
		return formattedQuery.replace(new RegExp(ZWS, 'ugim'), ' ');
	}

	/**
	 * Formats word tokens + any potential AS tokens for aliases
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatWord(token: Token, query: string): string {
		const prevToken = this.tokenLookBehind();
		const nextToken = this.tokenLookAhead();
		const asToken = { type: TokenType.RESERVED_KEYWORD, value: this.cfg.uppercase ? 'AS' : 'as' };

		const missingTableAlias = // if table alias is missing and alias is always
			this.cfg.aliasAs === AliasMode.always &&
			token.type === TokenType.WORD &&
			prevToken?.value === ')';

		const missingSelectColumnAlias = // if select column alias is missing and alias is not never
			this.cfg.aliasAs !== AliasMode.never &&
			this.withinSelect &&
			token.type === TokenType.WORD &&
			(isToken.END(prevToken) || // isAs(prevToken) ||
				((prevToken?.type === TokenType.WORD || prevToken?.type === TokenType.NUMBER) &&
					(nextToken?.value === ',' || isCommand(nextToken))));

		// bandaid fix until Nearley tree
		const missingCastTypeAs =
			this.cfg.aliasAs === AliasMode.never && // checks for CAST(«expression» [AS] type)
			this.withinSelect &&
			isToken.CAST(this.previousReservedToken) &&
			isToken.AS(nextToken) &&
			(this.tokenLookAhead(2)?.type === TokenType.WORD ||
				this.tokenLookAhead(2)?.type === TokenType.RESERVED_KEYWORD) &&
			this.tokenLookAhead(3)?.value === ')';

		const isEdgeCaseCTE = // checks for WITH `table` [AS] (
			this.cfg.aliasAs === AliasMode.never &&
			isToken.WITH(prevToken) &&
			(nextToken?.value === '(' ||
				(isToken.AS(nextToken) && this.tokenLookAhead(2)?.value === '('));

		const isEdgeCaseCreateTable = // checks for CREATE TABLE `table` [AS] WITH (
			this.cfg.aliasAs === AliasMode.never &&
			(isToken.TABLE(prevToken) || prevToken?.value.endsWith('TABLE')) &&
			(isToken.WITH(nextToken) || (isToken.AS(nextToken) && isToken.WITH(this.tokenLookAhead(2))));

		let finalQuery = query;
		if (missingTableAlias || missingSelectColumnAlias) {
			// insert AS before word
			finalQuery = this.formatWithSpaces(asToken, finalQuery);
		}

		// insert word
		finalQuery = this.formatWithSpaces(token, finalQuery);

		if (isEdgeCaseCTE || isEdgeCaseCreateTable || missingCastTypeAs) {
			// insert AS after word
			finalQuery = this.formatWithSpaces(asToken, finalQuery);
		}

		return finalQuery;
	}

	/**
	 * Checks if a newline should currently be inserted
	 * @param {number} index - index of current token
	 * @return {boolean} Whether or not a newline should be inserted
	 */
	checkNewline(index: number): boolean {
		const tail = this.tokens.slice(index + 1);
		const nextTokens = tail.slice(
			0,
			tail.length
				? tail.findIndex(
						({ type, value }) =>
							type === TokenType.RESERVED_COMMAND ||
							type === TokenType.RESERVED_BINARY_COMMAND ||
							value === ';'
				  )
				: undefined // add undefined for EOF
		);

		if (
			this.newline === NewlineMode.always ||
			(this.withinSelect &&
				nextTokens.some(({ type, value }) => type === TokenType.BLOCK_START && value.length > 1)) // auto break if SELECT includes CASE statements
		) {
			return true;
		}
		if (this.newline === NewlineMode.never) {
			return false;
		}

		const numItems = nextTokens.reduce(
			(acc, { type, value }) => {
				if (value === ',' && !acc.inParen) {
					return { ...acc, count: acc.count + 1 };
				} // count commas between items in clause
				if (type === TokenType.BLOCK_START) {
					return { ...acc, inParen: true };
				} // don't count commas in functions
				if (type === TokenType.BLOCK_END) {
					return { ...acc, inParen: false };
				}
				return acc;
			},
			{ count: 1, inParen: false } // start with 1 for first word
		).count;

		// calculate length if it were all inline
		const inlineWidth = `${this.tokens[index].whitespaceBefore}${
			this.tokens[index].value
		} ${nextTokens.map(({ value }) => (value === ',' ? value + ' ' : value)).join('')}`.length;

		if (this.newline === NewlineMode.lineWidth) {
			return inlineWidth > this.lineWidth;
		} else if (!Number.isNaN(this.newline)) {
			return numItems > this.newline || inlineWidth > this.lineWidth;
		}

		return true;
	}

	/** Formats a line comment onto query */
	formatLineComment(token: Token, query: string): string {
		return this.addNewline(query + this.show(token));
	}

	/** Formats a block comment onto query */
	formatBlockComment(token: Token, query: string): string {
		return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
	}

	/** Aligns comment to current indentation level */
	indentComment(comment: string): string {
		return comment.replace(/\n[ \t]*/gu, '\n' + this.indentation.getIndent() + ' ');
	}

	/**
	 * Formats a Reserved Command onto query, increasing indentation level where necessary
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatCommand(token: Token, query: string): string {
		this.indentation.decreaseTopLevel();

		query = this.addNewline(query);

		if (this.cfg.tenSpace) {
			if (this.tokenLookAhead()?.value !== '(') {
				this.indentation.increaseTopLevel();
			}
		} else if (!(this.tokenLookAhead()?.value === '(' && isToken.FROM(token))) {
			this.indentation.increaseTopLevel();
		}

		query += this.equalizeWhitespace(this.show(token));
		if (this.currentNewline && !this.cfg.tenSpace) {
			query = this.addNewline(query);
		} else {
			query += ' ';
		}
		return query;
	}

	/**
	 * Formats a Reserved Binary Command onto query, joining neighbouring tokens
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatBinaryCommand(token: Token, query: string): string {
		const isJoin = /JOIN/i.test(token.value);
		if (!isJoin || this.cfg.tenSpace) {
			// decrease for boolean set operators or in tenSpace modes
			this.indentation.decreaseTopLevel();
		}
		query = this.addNewline(query) + this.equalizeWhitespace(this.show(token));
		return isJoin ? query + ' ' : this.addNewline(query);
	}

	/**
	 * Formats a Reserved Keyword onto query, skipping AS if disabled
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatKeyword(token: Token, query: string): string {
		if (
			isToken.AS(token) &&
			(this.cfg.aliasAs === AliasMode.never || // skip all AS if never
				(this.cfg.aliasAs === AliasMode.select &&
					this.tokenLookBehind()?.value === ')' && // ) [AS] alias but not SELECT (a) [AS] alpha
					!this.withinSelect && // skip WITH foo [AS] ( ...
					this.tokenLookAhead()?.value !== '('))
		) {
			// do not format if skipping AS
			return query;
		}

		return this.formatWithSpaces(token, query);
	}

	/**
	 * Formats a Reserved Dependent Clause token onto query, supporting the keyword that precedes it
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatDependentClause(token: Token, query: string): string {
		return this.addNewline(query) + this.equalizeWhitespace(this.show(token)) + ' ';
	}

	/**
	 * Formats an Operator onto query, following rules for specific characters
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatOperator(token: Token, query: string): string {
		// special operator
		if (token.value === ',') {
			return this.formatComma(token, query);
		} else if (token.value === ';') {
			return this.formatQuerySeparator(token, query);
		} else if (['$', '['].includes(token.value)) {
			return this.formatWithSpaces(token, query, 'before');
		} else if ([':', ']'].includes(token.value)) {
			return this.formatWithSpaces(token, query, 'after');
		} else if (['.', '{', '}', '`'].includes(token.value)) {
			return this.formatWithoutSpaces(token, query);
		}

		// regular operator
		if (this.cfg.denseOperators && this.tokenLookBehind()?.type !== TokenType.RESERVED_COMMAND) {
			// do not trim whitespace if SELECT *
			return this.formatWithoutSpaces(token, query);
		}
		return this.formatWithSpaces(token, query);
	}

	/**
	 * Formats a Logical Operator onto query, joining boolean conditions
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatLogicalOperator(token: Token, query: string): string {
		if (isToken.AND(token) && isToken.BETWEEN(this.tokenLookBehind(2))) {
			return this.formatWithSpaces(token, query);
		}

		if (this.cfg.tenSpace) {
			this.indentation.decreaseTopLevel();
		}

		if (this.cfg.breakBeforeBooleanOperator) {
			return (
				(this.currentNewline ? this.addNewline(query) : query) +
				this.equalizeWhitespace(this.show(token)) +
				' '
			);
		} else {
			query += this.show(token);
			return this.currentNewline ? this.addNewline(query) : query;
		}
	}

	/** Replace any sequence of whitespace characters with single space */
	equalizeWhitespace(string: string): string {
		return string.replace(/\s+/gu, ' ');
	}

	/**
	 * Formats a Block Start token (left paren/bracket/brace, CASE) onto query, beginning an Inline Block or increasing indentation where necessary
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatBlockStart(token: Token, query: string): string {
		if (isToken.CASE(token)) {
			query = this.formatWithSpaces(token, query);
		} else {
			// Take out the preceding space unless there was whitespace there in the original query
			// or another opening parens or line comment
			const preserveWhitespaceFor = [
				TokenType.BLOCK_START,
				TokenType.LINE_COMMENT,
				TokenType.OPERATOR,
			];
			if (
				token.whitespaceBefore?.length === 0 &&
				!preserveWhitespaceFor.includes(this.tokenLookBehind()?.type)
			) {
				query = trimSpacesEnd(query);
			} else if (!this.cfg.parenOptions.openParenNewline) {
				query = query.trimEnd() + ' ';
			}
			query += this.show(token);
			this.inlineBlock.beginIfPossible(this.tokens, this.index);
		}

		if (!this.inlineBlock.isActive()) {
			this.indentation.increaseBlockLevel();
			if (!isToken.CASE(token) || this.newline === NewlineMode.always) {
				query = this.addNewline(query);
			}
		}
		return query;
	}

	/**
	 * Formats a Block End token (right paren/bracket/brace, END) onto query, closing an Inline Block or decreasing indentation where necessary
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatBlockEnd(token: Token, query: string): string {
		if (this.inlineBlock.isActive()) {
			this.inlineBlock.end();
			if (isToken.END(token)) {
				return this.formatWithSpaces(token, query); // add space before END when closing inline block
			}
			return this.formatWithSpaces(token, query, 'after'); // do not add space before )
		} else {
			this.indentation.decreaseBlockLevel();

			if (this.cfg.tenSpace) {
				query = this.addNewline(query) + this.cfg.indent;
			} else if (this.cfg.parenOptions.closeParenNewline) {
				query = this.addNewline(query);
			} else {
				query = query.trimEnd() + ' ';
			}

			return this.formatWithSpaces(token, query);
		}
	}

	/**
	 * Formats a Placeholder item onto query, to be replaced with the value of the placeholder
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatPlaceholder(token: Token, query: string): string {
		return query + this.params.get(token) + ' ';
	}

	/**
	 * Formats a comma Operator onto query, ending line unless in an Inline Block
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatComma(token: Token, query: string): string {
		query = trimSpacesEnd(query) + this.show(token) + ' ';

		if (this.inlineBlock.isActive()) {
			return query;
		} else if (isToken.LIMIT(this.previousReservedToken)) {
			return query;
		} else if (this.currentNewline) {
			return this.addNewline(query);
		} else {
			return query;
		}
	}

	/** Simple append of token onto query */
	formatWithoutSpaces(token: Token, query: string): string {
		return trimSpacesEnd(query) + this.show(token);
	}

	/**
	 * Add token onto query with spaces - either before, after, or both
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 * @param {'before' | 'after' | 'both'} addSpace - where to add spaces around token
	 * @return {string} token string with specified spaces
	 */
	formatWithSpaces(
		token: Token,
		query: string,
		addSpace: 'before' | 'after' | 'both' = 'both'
	): string {
		const before = addSpace === 'after' ? trimSpacesEnd(query) : query;
		const after = addSpace === 'before' ? '' : ' ';
		return before + this.show(token) + after;
	}

	/**
	 * Format Delimiter token onto query, adding newlines accoring to `this.cfg.linesBetweenQueries`
	 * @param {Token} token - current token
	 * @param {string} query - formatted query so far
	 */
	formatQuerySeparator(token: Token, query: string): string {
		this.indentation.resetIndentation();
		query = trimSpacesEnd(query);
		if (this.cfg.semicolonNewline) {
			query += '\n';
			if (this.cfg.tenSpace) {
				query += this.cfg.indent;
			}
		}
		return query + this.show(token) + '\n'.repeat(this.cfg.linesBetweenQueries + 1);
	}

	/** Converts token to string, uppercasing if enabled */
	show(token: Token): string {
		if (
			isReserved(token) ||
			token.type === TokenType.BLOCK_START ||
			token.type === TokenType.BLOCK_END
		) {
			return this.cfg.uppercase ? token.value.toUpperCase() : token.value.toLowerCase();
		} else {
			return token.value;
		}
	}

	/** Inserts a newline onto the query */
	addNewline(query: string): string {
		query = trimSpacesEnd(query);
		if (!query.endsWith('\n')) {
			query += '\n';
		}
		return query + this.indentation.getIndent();
	}

	/** Produces a 10-char wide version of reserved token for TenSpace modes */
	tenSpacedToken(token: Token): Token {
		const addBuffer = (string: string, bufferLength = 9) =>
			ZWS.repeat(Math.max(bufferLength - string.length, 0));
		if (this.cfg.tenSpace) {
			let bufferItem = token.value; // store which part of keyword receives 10-space buffer
			let tail = [] as string[]; // rest of keyword
			if (bufferItem.length >= 10 && bufferItem.includes(' ')) {
				// split for long keywords like INNER JOIN or UNION DISTINCT
				[bufferItem, ...tail] = bufferItem.split(' ');
			}

			if (this.cfg.keywordPosition === KeywordMode.tenSpaceLeft) {
				bufferItem += addBuffer(bufferItem);
			} else {
				bufferItem = addBuffer(bufferItem) + bufferItem;
			}

			token.value = bufferItem + ['', ...tail].join(' ');
		}
		return token;
	}

	/** Fetches nth previous token from the token stream */
	tokenLookBehind(n = 1) {
		return this.tokens[this.index - n];
	}

	/** Fetches nth next token from the token stream */
	tokenLookAhead(n = 1) {
		return this.tokens[this.index + n];
	}
}
