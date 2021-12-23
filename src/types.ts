export enum KeywordMode {
	standard = 'standard',
	tenSpaceLeft = 'tenSpaceLeft',
	tenSpaceRight = 'tenSpaceRight',
}

export enum NewlineMode {
	always = 'always',
	never = 'never',
	lineWidth = 'lineWidth',
}

export enum AliasMode {
	always = 'always',
	never = 'never',
	select = 'select',
}

export enum CommaPosition {
	before = 'before',
	after = 'after',
	tabular = 'tabular',
}

export interface ParenOptions {
	openParenNewline?: boolean;
	closeParenNewline?: boolean;
	// reservedFunctionParens: boolean;
	// functionParenSpace: boolean;
}
