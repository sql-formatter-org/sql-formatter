const attachFormat = () => {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const error = document.getElementById('error');

  const language = document.getElementById('language');
  const tabWidth = document.getElementById('tabWidth');
  const useTabs = document.getElementById('useTabs');
  const keywordCase = document.getElementById('keywordCase');
  const indentStyle = document.getElementById('indentStyle');
  const logicalOperatorNewline = document.getElementById('logicalOperatorNewline');
  const aliasAs = document.getElementById('aliasAs');
  const multilineLists = document.getElementById('multilineLists');
  const itemCount = document.getElementById('multilineLists-itemCount');
  const tabulateAlias = document.getElementById('tabulateAlias');
  const commaPosition = document.getElementById('commaPosition');
  const newlineBeforeOpenParen = document.getElementById('newlineBeforeOpenParen');
  const newlineBeforeCloseParen = document.getElementById('newlineBeforeCloseParen');
  const expressionWidth = document.getElementById('expressionWidth');
  const lineBetweenQueries = document.getElementById('lineBetweenQueries');
  const denseOperators = document.getElementById('denseOperators');
  const newlineBeforeSemicolon = document.getElementById('newlineBeforeSemicolon');

  function showOutput(text) {
    output.value = text;
    output.style.display = 'block';
    error.style.display = 'none';
  }

  function showError(text) {
    error.innerHTML = text;
    output.style.display = 'none';
    error.style.display = 'block';
  }

  function format() {
    if (multilineLists.options[multilineLists.selectedIndex].value === 'itemCount') {
      itemCount.style.display = 'inline';
    } else {
      itemCount.style.display = 'none';
    }

    try {
      const config = {
        language: language.options[language.selectedIndex].value,
        tabWidth: tabWidth.value,
        useTabs: useTabs.checked,
        keywordCase: keywordCase.options[keywordCase.selectedIndex].value,
        indentStyle: indentStyle.options[indentStyle.selectedIndex].value,
        logicalOperatorNewline:
          logicalOperatorNewline.options[logicalOperatorNewline.selectedIndex].value,
        aliasAs: aliasAs.options[aliasAs.selectedIndex].value,
        multilineLists:
          multilineLists.options[multilineLists.selectedIndex].value === 'itemCount'
            ? itemCount.value
            : multilineLists.options[multilineLists.selectedIndex].value,
        tabulateAlias: tabulateAlias.checked,
        commaPosition: commaPosition.options[commaPosition.selectedIndex].value,
        newlineBeforeOpenParen: newlineBeforeOpenParen.checked,
        newlineBeforeCloseParen: newlineBeforeCloseParen.checked,
        expressionWidth: expressionWidth.value,
        lineBetweenQueries: lineBetweenQueries.value,
        denseOperators: denseOperators.checked,
        newlineBeforeSemicolon: newlineBeforeSemicolon.checked,
      };
      showOutput(sqlFormatter.format(input.value, config));
    } catch (e) {
      if (e instanceof sqlFormatter.ConfigError) {
        showError(`<h2>Configuration error</h2><p>${e.message}</p>`);
      } else {
        showError(
          `
<h2>An Unexpected Error Occurred</h2>
<p><strong>${e.message}</strong></p>
<p>
  Please report this at
  <a href="https://github.com/zeroturnaround/sql-formatter/issues">Github issues page.<a>
</p>
<p>Stack Trace:</p>
<pre>${e.stack.toString()}</pre>
`
        );
      }
    }
  }

  input.addEventListener('input', format);
  [
    language,
    tabWidth,
    useTabs,
    keywordCase,
    indentStyle,
    multilineLists,
    itemCount,
    logicalOperatorNewline,
    aliasAs,
    tabulateAlias,
    commaPosition,
    newlineBeforeOpenParen,
    newlineBeforeCloseParen,
    expressionWidth,
    lineBetweenQueries,
    denseOperators,
    newlineBeforeSemicolon,
  ].forEach(option => option.addEventListener('change', format));

  format();
};

document.addEventListener('DOMContentLoaded', attachFormat);
