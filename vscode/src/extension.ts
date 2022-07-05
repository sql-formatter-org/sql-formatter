import * as vscode from 'vscode';
import { format } from 'sql-formatter';
import type {
  SqlLanguage,
  KeywordCase,
  IndentStyle,
  AliasMode,
  CommaPosition,
  LogicalOperatorNewline,
} from 'sql-formatter';

const getConfigs = (
  settings: vscode.WorkspaceConfiguration,
  formattingOptions: vscode.FormattingOptions | { tabSize: number; insertSpaces: boolean },
  language: SqlLanguage
) => {
  const ignoreTabSettings = settings.get<boolean>('ignoreTabSettings');
  const { tabSize, insertSpaces } = ignoreTabSettings // override tab settings if ignoreTabSettings is true
    ? {
        tabSize: settings.get<number>('tabSizeOverride')!,
        insertSpaces: settings.get<boolean>('insertSpacesOverride')!,
      }
    : formattingOptions;
  const indent = insertSpaces ? ' '.repeat(tabSize) : '\t';

  // build format configs from settings
  const formatConfigs = {
    language:
      language === 'sql' // override default SQL language mode if SQLFlavourOverride is set
        ? settings.get<SqlLanguage>('SQLFlavourOverride') ?? 'sql'
        : language,
    indent,
    keywordCase: settings.get<KeywordCase>('keywordCase'),
    indentStyle: settings.get<IndentStyle>('indentStyle'),
    logicalOperatorNewline: settings.get<LogicalOperatorNewline>('logicalOperatorNewline'),
    aliasAs: settings.get<AliasMode>('aliasAS'),
    tabulateAlias: settings.get<boolean>('tabulateAlias'),
    commaPosition: settings.get<CommaPosition>('commaPosition'),
    expressionWidth: settings.get<number>('expressionWidth'),
    linesBetweenQueries: settings.get<number>('linesBetweenQueries'),
    denseOperators: settings.get<boolean>('denseOperators'),
    newlineBeforeSemicolon: settings.get<boolean>('newlineBeforeSemicolon'),
  };

  return formatConfigs;
};

export function activate(context: vscode.ExtensionContext) {
  const formatProvider = (language: SqlLanguage) => ({
    provideDocumentFormattingEdits(
      document: vscode.TextDocument,
      options: vscode.FormattingOptions
    ): vscode.TextEdit[] {
      const settings = vscode.workspace.getConfiguration('Prettier-SQL');
      const formatConfigs = getConfigs(settings, options, language);

      // extract all lines from document
      const lines = [...new Array(document.lineCount)].map((_, i) => document.lineAt(i).text);
      let text;
      try {
        text = format(lines.join('\n'), formatConfigs);
      } catch (e) {
        vscode.window.showErrorMessage('Unable to format SQL:\n' + e);
        return [];
      }

      // replace document with formatted text
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

  const languages: { [lang: string]: SqlLanguage } = {
    'sql': 'sql',
    'plsql': 'plsql',
    'mysql': 'mysql',
    'postgres': 'postgresql',
    'hql': 'hive',
    'hive-sql': 'hive',
    'sql-bigquery': 'bigquery',
    'sqlite': 'sqlite',
  };
  // add Prettier-SQL as a format provider for each language
  Object.entries(languages).forEach(([vscodeLang, prettierLang]) =>
    context.subscriptions.push(
      vscode.languages.registerDocumentFormattingEditProvider(
        vscodeLang,
        formatProvider(prettierLang)
      )
    )
  );

  const formatSelectionCommand = vscode.commands.registerCommand(
    'prettier-sql-vscode.format-selection',
    () => {
      const documentLanguage = vscode.window.activeTextEditor?.document.languageId ?? 'sql';
      const formatterLanguage = languages[documentLanguage] ?? 'sql';

      const settings = vscode.workspace.getConfiguration('Prettier-SQL');

      // get tab settings from workspace
      const workspaceConfig = vscode.workspace.getConfiguration('editor');
      const tabOptions = {
        tabSize: workspaceConfig.get<number>('tabSize')!,
        insertSpaces: workspaceConfig.get<boolean>('insertSpaces')!,
      };

      const formatConfigs = getConfigs(settings, tabOptions, formatterLanguage);

      const editor = vscode.window.activeTextEditor;
      try {
        // format and replace each selection
        editor?.edit(editBuilder => {
          editor.selections.forEach(sel =>
            editBuilder.replace(sel, format(editor.document.getText(sel), formatConfigs))
          );
        });
      } catch (e) {
        vscode.window.showErrorMessage('Unable to format SQL:\n' + e);
      }
    }
  );

  context.subscriptions.push(formatSelectionCommand);
}

export function deactivate() {}
