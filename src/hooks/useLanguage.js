import { useState, useCallback } from 'react';
import { detectLang } from '../i18n/translations';
import { save } from '../utils/storage';

/**
 * Zarządza stanem języka aplikacji.
 * Persystuje wybór w localStorage i udostępnia funkcję toggle.
 * Uwaga: nie mylić z useT() / useLang() z i18n/translations (te dostarczają tłumaczenia przez Context).
 */
export function useLanguage() {
  const [lang, setLang] = useState(detectLang);

  const toggleLanguage = useCallback(() => {
    setLang(l => {
      const next = l === 'pl' ? 'en' : 'pl';
      save('hj_lang', next);
      return next;
    });
  }, []);

  return { lang, setLang, toggleLanguage };
}
