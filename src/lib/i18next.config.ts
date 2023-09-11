import i18next from 'i18next';
import fs from 'fs';
import path from 'path';

// const i18nPath = path.resolve('./build/');
// export const availableLanguages = getAvailableLanguages();
export default i18next;
export const t = i18next.t;
// function getAvailableLanguages() {
//     const langFiles = fs.readdirSync(i18nPath)
//         .map(file => file.split('.')[0]);
//     return langFiles;
// }

// function loadLanguageMetaData() {
//     availableLanguages.forEach(lang => {
//         const languagePath = path.resolve(i18nPath, `${lang}.json`);
//         if (!fs.existsSync(languagePath)) return;
//         const resource = JSON.parse(fs.readFileSync(languagePath).toString());
//         i18n.addResources(lang, 'meta', resource['meta']);
//     })
// }

// function loadLanguage(lang: string) {
//     const languagePath = path.resolve(i18nPath, `${lang}.json`);
//     if (!fs.existsSync(languagePath)) return;
//     const resource = JSON.parse(fs.readFileSync(languagePath).toString());
//     Object.keys(resource).forEach(ns => {
//         i18n.addResources(lang, ns, resource[ns]);
//     })
//     //TODO: load extension aswell
// }

// i18n.on('languageChanged', (lang) => {
//     //TODO Optimization possible, langs dont need to be loaded multiple times
//     loadLanguage(lang);
// })

// const namespaces = [
//     'menu',
//     'actions'
// ]

i18next.init({
  language: 'en',
  fallbackLng: false,
  returnNull: false,
  debug: true
});

// loadLanguageMetaData();
// loadLanguage('en_US');
