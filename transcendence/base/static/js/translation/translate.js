import { translations } from "./dictionnary.js"
import { getCurrentLanguage } from "./chooseLanguage.js"

document.addEventListener('DOMContentLoaded', function(e) {
	e.preventDefault();
	translatePage();
});

export function translatePage() {
	let elements = document.querySelectorAll('[data-translate]');
	elements.forEach(function(element) {
		const key = element.getAttribute('data-translate');
		const translation = translate(key);
		const sanitizedTranslation = DOMPurify.sanitize(translation);
		element.innerHTML = sanitizedTranslation;
	});
}

export function translatePlaceholder() {
	let elements = document.querySelectorAll('[data-translate-placeholder]');
	elements.forEach(function(element) {
		const key = element.getAttribute('data-translate-placeholder');
		const translation = translate(key);
		element.placeholder = translation;
	});
}

export function translate(key) {
	if (translations.hasOwnProperty(key)) {
		console.log("Current language = " + getCurrentLanguage())
		const translation = translations[key][getCurrentLanguage()];
		return translation || key;
	}
	return key;
}