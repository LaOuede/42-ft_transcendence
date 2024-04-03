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
	console.log("Chosen language: " + langCode);
	if (langCode) {
		localStorage.setItem('currentLanguage', langCode);
	} else {
		localStorage.setItem('currentLanguage', 'en');
	}
}

export function getCurrentLanguage() {
	return localStorage.getItem('currentLanguage');
}

function updateLanguage() {
	translatePage();
	translatePlaceholder();
}