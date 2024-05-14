import { translatePage, translatePlaceholder } from "./translate.js";

document.addEventListener('DOMContentLoaded', function() {
	const icon = document.getElementById('language-icon');
	const languageList = document.getElementById('language-list');

	icon.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		languageList.style.display = languageList.style.display === 'none' ? 'block' : 'none';
	});

	languageList.querySelectorAll('li').forEach(function(item) {
		item.addEventListener('click', function() {
			const selectedLanguage = this.getAttribute('data-lang');
			setCurrentLanguage(selectedLanguage);
			updateLanguage();
			languageList.style.display = 'none';
		});
	});

	document.addEventListener('click', function() {
		if (languageList.style.display === 'block') {
			languageList.style.display = 'none';
		}
	});
  });

function setCurrentLanguage(langCode) {
	if (langCode) {
		localStorage.setItem('currentLanguage', langCode);
	} else {
		localStorage.setItem('currentLanguage', 'en');
	}
	window.apiHandler.post('user/update/', {'current_language': langCode || 'en'})
}

export function getCurrentLanguage() {
	if (localStorage.getItem('currentLanguage')) {
		return localStorage.getItem('currentLanguage');
	} else {
		return 'en';
	}
}

function updateLanguage() {
	translatePage();
	translatePlaceholder();
}