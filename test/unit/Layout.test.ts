import Indentation from 'src/formatter/Indentation';
import Layout, { WS } from 'src/formatter/Layout';

describe('Layout', () => {
  function testLayout(...items: (WS | string)[]): string {
    // an Indentation object with two steps of indentation
    const indentation = new Indentation('-->');
    indentation.increaseTopLevel();
    indentation.increaseTopLevel();

    const layout = new Layout(indentation);
    layout.add(...items);
    return layout.toString();
  }

  it('simply concatenates plain strings', () => {
    expect(testLayout('hello', 'world')).toBe('helloworld');
  });

  describe('WS.SPACE', () => {
    it('inserts single space', () => {
      expect(testLayout('hello', WS.SPACE, 'world')).toBe('hello world');
    });
  });

  describe('WS.SINGLE_INDENT', () => {
    it('inserts single indentation step', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.SINGLE_INDENT, 'world')).toBe('hello\n-->world');
    });

    it('inserts two indentation steps when used twice', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.SINGLE_INDENT, WS.SINGLE_INDENT, 'world')).toBe(
        'hello\n-->-->world'
      );
    });
  });

  describe('WS.INDENT', () => {
    it('inserts current amount of indentation', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.INDENT, 'world')).toBe('hello\n-->-->world');
    });

    it('inserts double the current indentation when used twice', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.INDENT, WS.INDENT, 'world')).toBe(
        'hello\n-->-->-->-->world'
      );
    });
  });

  describe('WS.NO_SPACE', () => {
    it('does nothing when no preceding whitespace', () => {
      expect(testLayout('hello', WS.NO_SPACE, 'world')).toBe('helloworld');
    });

    it('removes all preceding spaces', () => {
      expect(testLayout('hello', WS.SPACE, WS.SPACE, WS.NO_SPACE, 'world')).toBe('helloworld');
    });

    it('removes all preceding indentation', () => {
      expect(
        testLayout('hello', WS.NEWLINE, WS.SINGLE_INDENT, WS.SINGLE_INDENT, WS.NO_SPACE, 'world')
      ).toBe('hello\nworld');
      expect(testLayout('hello', WS.NEWLINE, WS.INDENT, WS.NO_SPACE, 'world')).toBe('hello\nworld');
    });

    it('does not remove preceding newline', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.NO_SPACE, 'world')).toBe('hello\nworld');
      expect(testLayout('hello', WS.MANDATORY_NEWLINE, WS.NO_SPACE, 'world')).toBe('hello\nworld');
    });

    it('removes preceding spaces up to first newline', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.SPACE, WS.NO_SPACE, 'world')).toBe('hello\nworld');
      expect(testLayout('hello', WS.MANDATORY_NEWLINE, WS.SPACE, WS.NO_SPACE, 'world')).toBe(
        'hello\nworld'
      );
    });
  });

  describe('WS.NEWLINE', () => {
    it('inserts single newline', () => {
      expect(testLayout('hello', WS.NEWLINE, 'world')).toBe('hello\nworld');
    });

    it('inserts single newline, even when used twice', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.NEWLINE, 'world')).toBe('hello\nworld');
    });

    it('trims preceding horizontal whitespace', () => {
      expect(testLayout('hello', WS.SPACE, WS.NEWLINE, 'world')).toBe('hello\nworld');
      expect(testLayout('hello', WS.INDENT, WS.NEWLINE, 'world')).toBe('hello\nworld');
      expect(testLayout('hello', WS.SINGLE_INDENT, WS.NEWLINE, 'world')).toBe('hello\nworld');
    });
  });

  describe('WS.MANDATORY_NEWLINE', () => {
    it('inserts single newline', () => {
      expect(testLayout('hello', WS.MANDATORY_NEWLINE, 'world')).toBe('hello\nworld');
    });

    it('inserts single newline, even when used twice', () => {
      expect(testLayout('hello', WS.MANDATORY_NEWLINE, WS.MANDATORY_NEWLINE, 'world')).toBe(
        'hello\nworld'
      );
    });

    it('inserts single newline, even when used after plain WS.NEWLINE', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.MANDATORY_NEWLINE, 'world')).toBe('hello\nworld');
    });

    it('inserts single newline, even when used before plain WS.NEWLINE', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.MANDATORY_NEWLINE, 'world')).toBe('hello\nworld');
    });
  });

  describe('WS.NO_NEWLINE', () => {
    it('removes all preceding spaces', () => {
      expect(testLayout('hello', WS.SPACE, WS.NO_NEWLINE, 'world')).toBe('helloworld');
    });

    it('removes all preceding newlines', () => {
      expect(testLayout('hello', WS.NEWLINE, WS.NO_NEWLINE, 'world')).toBe('helloworld');
    });

    it('does not remove preceding mandatory newlines', () => {
      expect(testLayout('hello', WS.MANDATORY_NEWLINE, WS.NO_NEWLINE, 'world')).toBe(
        'hello\nworld'
      );
    });
  });
});
