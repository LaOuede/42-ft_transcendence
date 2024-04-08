import { translatePage, translatePlaceholder } from "./translate.js";

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('language-select').addEventListener('change', function(e) {
		e.preventDefault();
		let selectedLanguage = this.value;
		console.log(this.value);
		setCurrentLanguage(selectedLanguage);
		updateLanguage();
	});
});

function setCurrentLanguage(langCode) {
	if (langCode) {
		localStorage.setItem('currentLanguage', langCode);
	} else {
		localStorage.setItem('currentLanguage', 'en');
	}
}

export function getCurrentLanguage() {
	if (localStorage.getItem('currentLanguage')) {
		console.log("Current language: " + langCode);
		return localStorage.getItem('currentLanguage');
	} else {
		console.log("Current language: en");
		return 'en';
	}
}

function updateLanguage() {
	translatePage();
	translatePlaceholder();
}