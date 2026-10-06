import { TRANSLATIONS } from '../i18n/translations';

/* Tagi sugerowane przez aplikację (akcja / bonus akcja / reakcja / pasywna,
   typy miejsc) są częścią interfejsu, więc wyświetlamy je w języku
   interfejsu niezależnie od tego, w jakim języku zostały zapisane (P29/E1).
   Kanoniczna forma = wersja angielska. Tagi wpisane przez użytkownika
   zostają dokładnie takie, jakie są. */
const LISTS = ["SUGGESTED_ACTION_TAGS", "SUGGESTED_LOCATION_TAGS"];
const LANGS = Object.keys(TRANSLATIONS);

const CANON = (() => {
  const map = new Map();
  LISTS.forEach(list => {
    const en = TRANSLATIONS.en.UI[list] || [];
    LANGS.forEach(lang => (TRANSLATIONS[lang].UI[list] || []).forEach((t, i) => {
      if (en[i]) map.set(t.toLowerCase(), { list, index: i, canon: en[i] });
    }));
  });
  return map;
})();

export const canonTag = tag => CANON.get(String(tag ?? "").trim().toLowerCase())?.canon ?? tag;

export function displayTag(tag, lang) {
  const hit = CANON.get(String(tag ?? "").trim().toLowerCase());
  if (!hit) return tag;
  return (TRANSLATIONS[lang] || TRANSLATIONS.en).UI[hit.list]?.[hit.index] ?? tag;
}

export const sameTag = (a, b) => canonTag(a) === canonTag(b);
export const hasTag = (tags, tag) => (tags || []).some(t => sameTag(t, tag));
