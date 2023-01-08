'use strict';

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initLinkReplacerSettings);
} else {
	initLinkReplacerSettings();
}

const storagedSettingsKey = 'linkReplacerSettings',
	rowTemplate = '<label>Искомая строка: <input type="text" name="regex#ROW_ID#" value="#REGEX_VALUE#"></label>\
	<label>На что заменить: <input type="text" name="replaceTo#ROW_ID#" value="#REPLACE_TO_VALUE#"></label>\
	<input type="button" class="setting__delete" value="X" />';

function initLinkReplacerSettings() {
	const formElement = document.getElementById('settingsForm');
	const saveButton = document.getElementById('saveButton');
	const addRowButton = document.getElementById('addRowButton');
	if (!formElement || !saveButton) {
		return;
	}

	initRows();
	initHandlers();
}

function initRows() {
	if (typeof chrome?.storage?.sync?.get !== 'function') {
		console.error(chrome?.storage);
		console.error('chrome storage is not accessible');

		return;
	}
	const formElement = document.getElementById('settingsForm');
	chrome.storage.sync.get([storagedSettingsKey], (result) => {
		const links = result[storagedSettingsKey].links

		formElement.innerHTML = '';
		for (let linkData of links) {
			createRow(linkData);
		}
	});
}

function initHandlers() {
	const formElement = document.getElementById('settingsForm');
	formElement.addEventListener('submit', saveSettings);

	document.addEventListener('click', (e) => {
		if (!e.target?.classList?.length) {
			return;
		}

		if (e.target.classList.contains('setting__delete')) {
			e.preventDefault();

			e.target.parentElement.remove();
		}

		if (e.target.id === 'saveButton') {
			saveSettings(e);
		}

		if (e.target.id === 'addRowButton') {
			createEmptyRow(e);
		}
	})
}

function createEmptyRow() {
	createRow();
}

function createRow(linkData = {}) {
	const formElement = document.getElementById('settingsForm');
	let newRow = document.createElement('div'),
		content = rowTemplate;
	newRow.className = 'settings__row';
	if (!linkData?.regex || !linkData?.replaceTo) {
		linkData = {
			regex: '',
			replaceTo: ''
		};
	}

	content = rowTemplate
		.replaceAll('#ROW_ID#', formElement.childElementCount)
		.replaceAll('#REGEX_VALUE#', linkData.regex)
		.replaceAll('#REPLACE_TO_VALUE#', linkData.replaceTo);

	newRow.innerHTML = content;


	formElement.append(newRow);
}

function saveSettings() {
	const formElement = document.getElementById('settingsForm'),
		formData = new FormData(formElement);

	let links = [];
	for(let row of formData) {
		const key = row[0] === 'regex' ? 'regex' : 'replaceTo',
			value = row[1];

		if (!key || !value) {
			continue;
		}

		let newObj = {};
		newObj[key] = value;

		links.push(newObj);
	}

	if (typeof chrome?.storage?.sync?.set !== 'function') {
		console.error('chrome storage is not accessible');

		return;
	}

	chrome.storage.sync.set({links: links}, console.log);
}

