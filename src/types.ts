export enum KeywordMode {
	standard = 'standard',
	standardTabbed = 'standardTabbed',
	tenSpaceLeft = 'tenSpaceLeft',
	tenSpaceRight = 'tenSpaceRight',
	tabular = 'tabular',
}

export enum NewlineMode {
	always = 'always',
	never = 'never',
	lineWidth = 'lineWidth',
	itemCount = 'itemCount',
	hybrid = 'hybrid',
}
export interface NewlineOptions {
	mode: NewlineMode | keyof typeof NewlineMode;
	itemCount?: number;
}

export enum AliasMode {
	always = 'always',
	never = 'never',
	select = 'select',
}
