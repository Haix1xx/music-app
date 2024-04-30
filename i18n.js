module.exports = {
	locales: ["en", "vi"],
	defaultLocale: "en",
	localeDetection: false,
	pages: {
		"*": ["common"],
		"/home": ["home"],

	},
	loadLocaleFrom: (lang, namespace) => {
		return import(`./src/locales/${lang}/${namespace}.json`).then((m) => m.default);
	},
};