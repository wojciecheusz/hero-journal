import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pl from './locales/pl.json';
import en from './locales/en.json';

const savedLang = localStorage.getItem('hj_lang');
const browserLang = navigator.language?.startsWith('pl') ? 'pl' : 'en';
const initialLang = (savedLang === 'pl' || savedLang === 'en') ? savedLang : browserLang;

i18n.use(initReactI18next).init({
  resources: {
    pl: { translation: pl },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

/** Synchronizuje język i18next ze stanem aplikacji */
export function syncI18nLang(lang) {
  if (i18n.language !== lang) i18n.changeLanguage(lang);
}
