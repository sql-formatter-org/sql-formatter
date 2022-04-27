const attachFormat = () => {
	const language = document.getElementById('language');
	const uppercase = document.getElementById('uppercase');
	const input = document.getElementById('input');
	const output = document.getElementById('output');
	const keywordPosition = document.getElementById('keywordPosition');
	const breakBeforeBooleanOperator = document.getElementById('breakBeforeBooleanOperator');
	const aliasAs = document.getElementById('aliasAs');
	const newline = document.getElementById('newline');
	const itemCount = document.getElementById('newline.itemCount');
	const tabulateAlias = document.getElementById('tabulateAlias');
	const commaPosition = document.getElementById('commaPosition');
	const openParenNewline = document.getElementById('openParenNewline');
	const closeParenNewline = document.getElementById('closeParenNewline');
	const lineWidth = document.getElementById('lineWidth');
	const lineBetweenQueries = document.getElementById('lineBetweenQueries');
	const denseOperators = document.getElementById('denseOperators');
	const semicolonNewline = document.getElementById('semicolonNewline');

	function format() {
		try {
			console.time('formatting');
			const config = {
				language: language.options[language.selectedIndex].value,
				uppercase: uppercase.checked,
				keywordPosition: keywordPosition.options[keywordPosition.selectedIndex].value,
				breakBeforeBooleanOperator: breakBeforeBooleanOperator.checked,
				aliasAs: aliasAs.options[aliasAs.selectedIndex].value,
				newline:
					itemCount.value > 0 ? itemCount.value : newline.options[newline.selectedIndex].value,
				tabulateAlias: tabulateAlias.checked,
				commaPosition: commaPosition.options[commaPosition.selectedIndex].value,
				parenOptions: {
					openParenNewline: openParenNewline.checked,
					closeParenNewline: closeParenNewline.checked,
				},
				lineWidth: lineWidth.value,
				lineBetweenQueries: lineBetweenQueries.value,
				denseOperators: denseOperators.checked,
				semicolonNewline: semicolonNewline.checked,
			};
			output.value = prettierSql.format(input.value, config);
			console.timeEnd('formatting');
		} catch (e) {
			output.value = `
An Error Occurred, please report this at:
https://github.com/inferrinizzard/prettier-sql/issues\n
Stack Trace:
${e.stack.toString()}
`;
		}
	}

	input.addEventListener('input', format);
	[
		language,
		uppercase,
		keywordPosition,
		newline,
		itemCount,
		breakBeforeBooleanOperator,
		aliasAs,
		tabulateAlias,
		commaPosition,
		openParenNewline,
		closeParenNewline,
		lineWidth,
		lineBetweenQueries,
		denseOperators,
		semicolonNewline,
	].forEach(option => option.addEventListener('change', format));

	format();

	const fontSize = document.getElementById('font-size');
	fontSize.addEventListener('change', () => {
		input.style.fontSize = fontSize.value + 'px';
		output.style.fontSize = fontSize.value + 'px';
	});
};

document.addEventListener('DOMContentLoaded', attachFormat);
