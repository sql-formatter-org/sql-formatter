import * as vscode from 'vscode';
import { format } from 'prettier-sql';
import type {
	AliasMode,
	CommaPosition,
	FormatterLanguage,
	KeywordMode,
	NewlineMode,
} from 'prettier-sql';

export function activate(context: vscode.ExtensionContext) {
	console.log('Prettier-SQL VSCode activated');

	const formatProvider = (language: FormatterLanguage) => ({
		provideDocumentFormattingEdits(
			document: vscode.TextDocument,
			options: vscode.FormattingOptions
		): vscode.TextEdit[] {
			console.log('Formatter language:', language);

			const settings = vscode.workspace.getConfiguration('Prettier-SQL');
			const { tabSize, insertSpaces } = options;
			const indent = insertSpaces ? ' '.repeat(tabSize) : '\t';

			const lines = [...new Array(document.lineCount)].map((_, i) => document.lineAt(i).text);
			const formatConfigs = {
				language,
				indent,
				uppercase: settings.get<boolean>('uppercaseKeywords'),
				keywordPosition: settings.get<KeywordMode>('keywordPosition'),
				breakBeforeBooleanOperator: settings.get<boolean>('breakBeforeBooleanOperator'),
				aliasAs: settings.get<AliasMode>('aliasAS'),
				tabulateAlias: settings.get<boolean>('tabulateAlias'),
				commaPosition: settings.get<CommaPosition>('commaPosition'),
				newlineOptions: settings.get<NewlineMode | number>('keywordNewline'),
				parenOptions: {
					openParenNewline: settings.get<boolean>('openParenNewline'),
					closeParenNewline: settings.get<boolean>('closeParenNewline'),
				},
				lineWidth: settings.get<number>('lineWidth'),
				linesBetweenQueries: settings.get<number>('linesBetweenQueries'),
				denseOperators: settings.get<boolean>('denseOperators'),
				semicolonNewline: settings.get<boolean>('semicolonNewline'),
			};

			const text = format(lines.join('\n'), formatConfigs);

			return [
				vscode.TextEdit.replace(
					new vscode.Range(
						document.positionAt(0),
						document.lineAt(document.lineCount - 1).range.end
					),
					text + (settings.get('trailingNewline') ? '\n' : '')
				),
			];
		},
	});

	const languages: { [lang: string]: FormatterLanguage } = {
		'sql': 'sql',
		'plsql': 'plsql',
		'mysql': 'mysql',
		'postgres': 'postgresql',
		'hql': 'sql',
		'hive-sql': 'sql',
		// 'sql-bigquery': 'bigquery',
	};
	Object.entries(languages).forEach(([vscodeLang, prettierLang]) =>
		context.subscriptions.push(
			vscode.languages.registerDocumentFormattingEditProvider(
				vscodeLang,
				formatProvider(prettierLang)
			)
		)
	);
}

export function deactivate() {}
