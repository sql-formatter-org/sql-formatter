const attachFormat = () => {
	const language = document.getElementById('language');
	const uppercase = document.getElementById('uppercase');
	const input = document.getElementById('input');
	const output = document.getElementById('output');

	function format() {
		console.time('formatting');
		output.value = prettierSql.format(input.value, {
			language: language.options[language.selectedIndex].value,
			uppercase: uppercase.checked,
		});
		console.timeEnd('formatting');
	}

	input.addEventListener('input', format);
	language.addEventListener('change', format);
	uppercase.addEventListener('change', format);

	format();
};

document.addEventListener('DOMContentLoaded', attachFormat);
