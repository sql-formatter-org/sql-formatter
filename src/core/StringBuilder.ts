import { trimSpacesEnd } from '../utils';
import Indentation from './Indentation';

export default class StringBuilder {
  private query = '';

  constructor(private indentation: Indentation) {}

  public addWithoutSpaces(text: string) {
    this.query = trimSpacesEnd(this.query) + text;
  }

  public addWithSpaces(text: string) {
    this.query += text + ' ';
  }

  public addWithSpaceBefore(text: string) {
    this.query += text;
  }

  public addWithSpaceAfter(text: string) {
    this.query = trimSpacesEnd(this.query) + text + ' ';
  }

  public addNewline() {
    this.query = trimSpacesEnd(this.query);
    if (!this.query.endsWith('\n') && this.query !== '') {
      this.query += '\n';
    }
    this.query += this.indentation.getIndent();
  }

  public addWithoutNewlinesBefore(text: string) {
    this.query = this.query.trimEnd() + ' ' + text;
  }

  public toString(): string {
    return this.query;
  }
}
