import { Parser as NearleyParser, Grammar } from 'nearley';

import Tokenizer from 'src/lexer/Tokenizer';
import { disambiguateTokens } from 'src/lexer/disambiguateTokens';
import { ParamTypes } from 'src/lexer/TokenizerOptions';
import { StatementNode } from 'src/parser/ast';
import grammar from 'src/parser/grammar';
import LexerAdapter from 'src/parser/LexerAdapter';
import { EOF_TOKEN } from 'src/lexer/token';

export interface Parser {
  parse(sql: string, paramTypesOverrides: ParamTypes): StatementNode[];
}

/**
 * Creates a parser object which wraps the setup of Nearley parser
 */
export function createParser(tokenizer: Tokenizer): Parser {
  let paramTypesOverrides: ParamTypes = {};
  const lexer = new LexerAdapter(chunk => [
    ...disambiguateTokens(tokenizer.tokenize(chunk, paramTypesOverrides)),
    EOF_TOKEN,
  ]);
  const parser = new NearleyParser(Grammar.fromCompiled(grammar), { lexer });

  return {
    parse: (sql: string, paramTypes: ParamTypes) => {
      // share paramTypesOverrides with Tokenizer
      paramTypesOverrides = paramTypes;

      const { results } = parser.feed(sql);

      if (results.length === 1) {
        return results[0];
      } else if (results.length === 0) {
        // Ideally we would report a line number where the parser failed,
        // but I haven't found a way to get this info from Nearley :(
        throw new Error('Parse error: Invalid SQL');
      } else {
        throw new Error('Parse error: Ambiguous grammar');
      }
    },
  };
}
