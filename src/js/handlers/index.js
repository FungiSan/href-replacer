'use strict';

if (globalThis.window.document.readyState === 'loading') {
	globalThis.window.document.addEventListener('DOMContentLoaded', initLinkReplacer);
} else {
	initLinkReplacer();
}

let replaceLinksMapper = [];
function initLinkReplacer() {
	if (typeof chrome?.storage?.local?.get !== 'function') {
		console.error('chrome storage is not accessible');

		return;
	}

	chrome.storage.local.get(['linkReplacerSettings'], function(result) {
		replaceLinksMapper = result['linkReplacerSettings']?.links;

		globalThis.window.document.querySelectorAll('a').forEach(replaceLinkHref);
	});
}

function replaceLinkHref(linkElement) {
	const currentHref = linkElement?.getAttribute('href');
	if (!currentHref) {
		return;
	}

	for (let replaceLinkData of replaceLinksMapper) {
		const regexp = new RegExp(replaceLinkData.regex.replace('\\\\', '\\'), 'i');
		if (currentHref.match(regexp)?.length > 0) {
			linkElement.href = currentHref.replace(regexp, replaceLinkData.replaceTo);
		}
	}
}