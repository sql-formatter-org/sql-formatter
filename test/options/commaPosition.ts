import { expect } from "@jest/globals";
import dedent from "dedent-js";

import { FormatFn } from "../../src/sqlFormatter.js";
import {
  getCommentsRanges,
  queryToLinesWithIndexes, splitContentAndComments
} from '../../src/formatter/formatCommaPositions.js';

export default function supportsCommaPosition(format: FormatFn) {
  it("defaults to comma after column", () => {
    const result = format(
      "SELECT alpha , MAX(beta) , delta AS d ,epsilon FROM gamma GROUP BY alpha , delta, epsilon"
    );
    expect(result).toBe(
      dedent`
        SELECT
          alpha,
          MAX(beta),
          delta AS d,
          epsilon
        FROM
          gamma
        GROUP BY
          alpha,
          delta,
          epsilon
      `
    );
  });

  describe("commaPosition: before", () => {
    it("adds comma before column", () => {
      const result = format(
        "SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon",
        { commaPosition: "before" }
      );
      expect(result).toBe(
        dedent`
          SELECT
            alpha
          , MAX(beta)
          , delta AS d
          , epsilon
          FROM
            gamma
          GROUP BY
            alpha
          , delta
          , epsilon
        `
      );
    });

    it("handles comments after commas", () => {
      const result = format(
        `SELECT alpha, --comment1
        MAX(beta), --comment2
        delta AS d, epsilon --comment3`,
        { commaPosition: "before" }
      );
      expect(result).toBe(
        dedent`
          SELECT
            alpha --comment1
          , MAX(beta) --comment2
          , delta AS d
          , epsilon --comment3
        `
      );
    });

    it("works with larger indent", () => {
      const result = format(
        "SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon",
        { commaPosition: "before", tabWidth: 4 }
      );
      expect(result).toBe(
        dedent`
          SELECT
              alpha
            , MAX(beta)
            , delta AS d
            , epsilon
          FROM
              gamma
          GROUP BY
              alpha
            , delta
            , epsilon
        `
      );
    });

    it('should work with multiline comment between column and comma', () => {
      const result = format(
        'SELECT alpha, MAX(beta) /* as b */, delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon',
        { commaPosition: 'before', tabWidth: 4 }
      );
      expect(result).toBe(
        dedent`
          SELECT
              alpha
            , MAX(beta) /* as b */
            , delta AS d
            , epsilon
          FROM
              gamma
          GROUP BY
              alpha
            , delta
            , epsilon
        `
      );
    });

    it('should work with multiline comment and with strings with -- and ,', () => {
      const q = `
      SELECT
        "5 -- 6," as col1, /*
        as mycol
        */ 8 as col2,
        --, b
        c
      FROM T1
      WHERE /*
        c > 20 and
      */ c < 100
    `.trim();
      const result = format(q, { commaPosition: 'before', tabWidth: 4 });
      expect(result).toBe(
        dedent`
          SELECT
              "5 -- 6," as col1
              /*
              as mycol
              */
            , 8 as col2
              --, b
            , c
          FROM
              T1
          WHERE
              /*
              c > 20 and
              */
              c < 100
        `
      );
    });

    // This style is fundamentally incompatible with tabs
    it("throws error when tabs used for indentation", () => {
      expect(() => {
        format("SELECT alpha, MAX(beta), delta AS d, epsilon", {
          commaPosition: "before",
          useTabs: true
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"commaPosition: before does not work when tabs are used for indentation."`
      );
    });
  });

  describe("commaPosition: tabular", () => {
    it("aligns commas to a column", () => {
      const result = format(
        "SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon",
        { commaPosition: "tabular" }
      );
      expect(result).toBe(
        dedent`
          SELECT
            alpha     ,
            MAX(beta) ,
            delta AS d,
            epsilon
          FROM
            gamma
          GROUP BY
            alpha  ,
            delta  ,
            epsilon
        `
      );
    });

    it("handles comments after commas", () => {
      const result = format(
        `SELECT alpha, --comment1
        beta,--comment2
        delta, epsilon,--comment3
        iota --comment4`,
        { commaPosition: "tabular" }
      );
      expect(result).toBe(
        dedent`
          SELECT
            alpha  , --comment1
            beta   , --comment2
            delta  ,
            epsilon, --comment3
            iota --comment4
        `
      );
    });

    it("is not effected by indent size", () => {
      const result = format(
        "SELECT alpha, MAX(beta), delta AS d, epsilon FROM gamma GROUP BY alpha, delta, epsilon",
        { commaPosition: "tabular", tabWidth: 6 }
      );
      expect(result).toBe(
        dedent`
          SELECT
                alpha     ,
                MAX(beta) ,
                delta AS d,
                epsilon
          FROM
                gamma
          GROUP BY
                alpha  ,
                delta  ,
                epsilon
        `
      );
    });

    it("handles tabs", () => {
      const result = format("SELECT alpha, MAX(beta), delta AS d, epsilon", {
        commaPosition: "tabular",
        useTabs: true
      });
      expect(result).toBe(
        dedent`
          SELECT
          \talpha     ,
          \tMAX(beta) ,
          \tdelta AS d,
          \tepsilon
        `
      );
    });

    it('should prepare array of comment ranges ordered by start', () => {
      expect(
        getCommentsRanges(`SELECT
        5 - 6 as col1, -- comment with -- ,
        8 as col2 /*
        --, b
        */ , c`)
      ).toEqual([
        { start: 30, end: 50 },
        { start: 69, end: 96 },
      ]);
    });

    it('should split query into lines objects', () => {
      expect(
        queryToLinesWithIndexes(`SELECT
        5 - 6 as col1, -- comment with -- ,
        8 as col2 /*
        --, b
        */ , c`)
      ).toEqual([
        {
          content: 'SELECT',
          lineNumber: 1,
          start: 0,
        },
        {
          content: '        5 - 6 as col1, -- comment with -- ,',
          lineNumber: 2,
          start: 7,
        },
        {
          content: '        8 as col2 /*',
          lineNumber: 3,
          start: 51,
        },
        {
          content: '        --, b',
          lineNumber: 4,
          start: 72,
        },
        {
          content: '        */ , c',
          lineNumber: 5,
          start: 86,
        },
      ]);
    });

    it('should split content and comments and handle -- and /**/ comments', () => {
      const q = `
      SELECT
        5 - 6 /* as mycol */ as col1, -- comment with -- ,
        8 as col2
        --, b
        , c
      FROM T1
      WHERE /*
        c > 20 and
      */ c < 100
    `.trim();
      expect(splitContentAndComments(q)).toEqual([
        {
          content: 'SELECT',
          commentAtLineStart: '',
          commentAtLineEnd: '',
          originalContent: 'SELECT',
        },
        {
          content: '        5 - 6 /* as mycol */ as col1,',
          commentAtLineStart: '',
          commentAtLineEnd: '-- comment with -- ,',
          originalContent: '        5 - 6 /* as mycol */ as col1, -- comment with -- ,',
        },
        {
          content: '        8 as col2',
          commentAtLineStart: '',
          commentAtLineEnd: '',
          originalContent: '        8 as col2',
        },
        {
          content: '',
          commentAtLineStart: '',
          commentAtLineEnd: '--, b',
          originalContent: '        --, b',
        },
        {
          content: '        , c',
          commentAtLineStart: '',
          commentAtLineEnd: '',
          originalContent: '        , c',
        },
        {
          content: '      FROM T1',
          commentAtLineStart: '',
          commentAtLineEnd: '',
          originalContent: '      FROM T1',
        },
        {
          content: '      WHERE',
          commentAtLineStart: '',
          commentAtLineEnd: '/*',
          originalContent: '      WHERE /*',
        },
        {
          content: '',
          commentAtLineStart: '        c > 20 and',
          commentAtLineEnd: '',
          originalContent: '        c > 20 and',
        },
        {
          commentAtLineEnd: '',
          commentAtLineStart: '      */',
          content: ' c < 100',
          originalContent: '      */ c < 100',
        },
      ]);
    });

    it('should handle comma in comments with comaPosition:before', () => {
      const result = format(
        `
        SELECT
          a, -- comment with -- ,
          --, b
          c
        FROM
          T1
    `,
        { commaPosition: 'before' }
      );
      expect(result).toBe(dedent`
      SELECT
        a -- comment with -- ,
        --, b
      , c
      FROM
        T1
    `);
    });
  });
}
