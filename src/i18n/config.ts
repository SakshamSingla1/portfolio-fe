import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translations.json';
import hiTranslations from './locales/hi/translations.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: { translations: enTranslations },
    es: { translations: hiTranslations },
  },
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: '.'
});

i18n.languages = ['en', 'hi'];

export default i18n;