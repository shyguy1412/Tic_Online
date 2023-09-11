import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

if ('window' in globalThis) {
  const language = 'navigator' in globalThis ? navigator.language : 'en';

  const translation = await fetch(`/i18n/${language}.json`).then(r => r.json());

  i18next
    .use(initReactI18next)
    .init({
      language,
      debug: true,
      fallbackLng: language,
      nsSeparator: false,
      keySeparator: false,
      resources: {
        [language]: {
          translation
        }
      }
    });

}

export default i18next;
