import { formatters } from './sqlFormatter';

export type FormatterLanguage = keyof typeof formatters;

export enum NewlineMode {
	always,
	never,
	lineWidth,
	itemCount,
	hybrid,
}
export interface NewlineOptions {
	mode: NewlineMode;
	itemCount?: number;
}
