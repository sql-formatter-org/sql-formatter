const attachFormat = () => {
  const language = document.getElementById('language');
  const keywordCase = document.getElementById('keywordCase');
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const keywordPosition = document.getElementById('keywordPosition');
  const logicalOperatorNewline = document.getElementById('logicalOperatorNewline');
  const aliasAs = document.getElementById('aliasAs');
  const newline = document.getElementById('newline');
  const itemCount = document.getElementById('newline.itemCount');
  const tabulateAlias = document.getElementById('tabulateAlias');
  const commaPosition = document.getElementById('commaPosition');
  const newlineBeforeOpenParen = document.getElementById('newlineBeforeOpenParen');
  const newlineBeforeCloseParen = document.getElementById('newlineBeforeCloseParen');
  const lineWidth = document.getElementById('lineWidth');
  const lineBetweenQueries = document.getElementById('lineBetweenQueries');
  const denseOperators = document.getElementById('denseOperators');
  const newlineBeforeSemicolon = document.getElementById('newlineBeforeSemicolon');

  function format() {
    try {
      const config = {
        language: language.options[language.selectedIndex].value,
        keywordCase: keywordCase.options[keywordCase.selectedIndex].value,
        keywordPosition: keywordPosition.options[keywordPosition.selectedIndex].value,
        logicalOperatorNewline:
          logicalOperatorNewline.options[logicalOperatorNewline.selectedIndex].value,
        aliasAs: aliasAs.options[aliasAs.selectedIndex].value,
        newline:
          itemCount.value > 0 ? itemCount.value : newline.options[newline.selectedIndex].value,
        tabulateAlias: tabulateAlias.checked,
        commaPosition: commaPosition.options[commaPosition.selectedIndex].value,
        newlineBeforeOpenParen: newlineBeforeOpenParen.checked,
        newlineBeforeCloseParen: newlineBeforeCloseParen.checked,
        lineWidth: lineWidth.value,
        lineBetweenQueries: lineBetweenQueries.value,
        denseOperators: denseOperators.checked,
        newlineBeforeSemicolon: newlineBeforeSemicolon.checked,
      };
      output.value = sqlFormatter.format(input.value, config);
    } catch (e) {
      output.value = `
An Error Occurred, please report this at:
https://github.com/zeroturnaround/sql-formatter/issues\n
Stack Trace:
${e.stack.toString()}
`;
    }
  }

  input.addEventListener('input', format);
  [
    language,
    keywordCase,
    keywordPosition,
    newline,
    itemCount,
    logicalOperatorNewline,
    aliasAs,
    tabulateAlias,
    commaPosition,
    newlineBeforeOpenParen,
    newlineBeforeCloseParen,
    lineWidth,
    lineBetweenQueries,
    denseOperators,
    newlineBeforeSemicolon,
  ].forEach(option => option.addEventListener('change', format));

  format();

  const fontSize = document.getElementById('font-size');
  fontSize.addEventListener('change', () => {
    input.style.fontSize = fontSize.value + 'px';
    output.style.fontSize = fontSize.value + 'px';
  });
};

document.addEventListener('DOMContentLoaded', attachFormat);
