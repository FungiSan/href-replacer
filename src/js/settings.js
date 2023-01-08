'use strict';

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initLinkReplacerSettings);
} else {
	initLinkReplacerSettings();
}

const storagedSettingsKey = 'linkReplacerSettings',
	rowTemplate = '<label>Искомая строка: <input type="text" name="regex" value="#REGEX_VALUE#"></label>\
	<label>На что заменить: <input type="text" name="replaceTo" value="#REPLACE_TO_VALUE#"></label>\
	<input type="button" class="setting__delete" value="X" />';

function initLinkReplacerSettings() {
	const formElement = document.getElementById('settingsForm'),
		saveButton = document.getElementById('saveButton'),
		addRowButton = document.getElementById('addRowButton');

	if (!formElement || !saveButton) {
		return;
	}

	initRows();
	initHandlers();
}

function initRows() {
	if (typeof chrome?.storage?.local?.get !== 'function') {
		console.error('chrome storage is not accessible');

		return;
	}
	const formElement = document.getElementById('settingsForm');
	chrome.storage.local.get([storagedSettingsKey], function(result) {
		const links = result[storagedSettingsKey]?.links;

		if (!links) {
			return;
		}

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
		if (e.target.classList.contains('setting__delete')) {
			e.preventDefault();

			e.target.parentElement.remove();
		}

		if (e.target.id === 'saveButton') {
			saveSettings(e);
		}

		if (e.target.id === 'addRowButton') {
			createRow();
		}
	})
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
		.replaceAll('#REGEX_VALUE#', linkData.regex)
		.replaceAll('#REPLACE_TO_VALUE#', linkData.replaceTo);

	newRow.innerHTML = content;

	formElement.append(newRow);
}

function saveSettings() {
	const formElement = document.getElementById('settingsForm'),
		formData = new FormData(formElement),
		rowsCount = Object.values(formData).length / 2;

	let links = new Array(rowsCount),
		i = 0;
	links.fill({});
	for(let row of formData) {
		i++;
		const key = row[0],
			value = row[1];

		if (!key || !value) {
			continue;
		}

		let newObj = links[Math.ceil(i / 2) - 1] ?? {};
		newObj[key] = value;

		links[Math.ceil(i / 2) - 1] = newObj;
	}

	if (typeof chrome?.storage?.local?.set !== 'function') {
		console.error('chrome storage is not accessible');

		return;
	}

	const result = {};
	result[storagedSettingsKey] = {links: links};

	chrome.storage.local.set(result);
}
