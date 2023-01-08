'use strict';

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initLinkReplacer);
} else {
	initLinkReplacer();
}

const storagedSettingsKey = 'linkReplacerSettings';

let replaceLinksMapper = [];
function initLinkReplacer() {
	if (typeof chrome?.storage?.sync?.set !== 'function') {
		console.error('chrome storage is not accessible');

		return;
	}

	chrome.storage.sync.get([storagedSettingsKey], (result) => {
		replaceLinksMapper = result[storagedSettingsKey].links;

		document.querySelectorAll('a').forEach(replaceLinkHref);
	});
}

function replaceLinkHref(linkElement) {
	const currentHref = linkElement?.getAttribute('href');
	if (!currentHref) {
		return;
	}

	for (let replaceLinkData of replaceLinksMapper) {
		const regexp = new RegExp(replaceLinkData.regex, 'i');
		if (currentHref.match(regexp)?.length > 0) {
			currentHref.replace(regexp, replaceLinkData.replaceTo);
		}
	}
}