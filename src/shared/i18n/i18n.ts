import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import uk from './locales/uk.json';
import pl from './locales/pl.json';

export const LANGUAGE_STORAGE_KEY = 'app_language';
export const SUPPORTED_LANGUAGES = ['en', 'uk', 'pl'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const getStoredLanguage = (): AppLanguage => {
  const stored = sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.includes(stored as AppLanguage)) {
    return stored as AppLanguage;
  }
  return 'en';
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
    pl: { translation: pl },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export const changeAppLanguage = (language: AppLanguage) => {
  sessionStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  void i18n.changeLanguage(language);
};

export default i18n;
