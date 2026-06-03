# Lista zadań — Hero Journal

## W trakcie
<!-- Zadania aktualnie wykonywane -->

## Do zrobienia

### P4.1 — CSS Modules: pilot na SkillsScreen

**Kontekst:**
Aplikacja używa ~80% inline styles w JSX (np. `style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", ... }}`). CSS Modules to przemysłowy standard: scoped styles, możliwe media queries, lepsze DevTools.

**Zakres tego zadania:** TYLKO `SkillsScreen.jsx` jako pilot — żeby zweryfikować podejście bez ryzyka.

**Kroki do wykonania:**

1. Utwórz plik `src/features/skills/SkillsScreen.module.css` z selektorami dla statycznych (nie-dynamicznych) stylów z SkillsScreen.jsx — np. `.filterBar`, `.legend`, `.legendItem`, `.legendDot`, `.legendLabel`.

2. W `SkillsScreen.jsx` dodaj import: `import styles from './SkillsScreen.module.css';`

3. Zastąp inline style objecty klasami z modułu wszędzie tam, gdzie style NIE zależą od zmiennych JS (np. kolory kategorii `cc` muszą pozostać inline). Przykład do zamiany:
   - `<div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", padding:"0.4rem 0.6rem", ... }}>` → `<div className={styles.legend}>`

4. Uruchom `npm run build` — build musi przejść bez błędów.

5. Uruchom `npm test` — 25 testów musi przejść.

6. Wykonaj `git add -A && git commit -m "feat(P4.1-pilot): CSS Modules na SkillsScreen — legend i filtry" && git push`

**Weryfikacja:** `npm run build` i `npm test` muszą przejść. Commit do GitHub.

---

### P4.2 — i18next: warstwa kompatybilności i konfiguracja

**Kontekst:**
Aplikacja używa własnego systemu `TRANSLATIONS` (~700 linii w translations.js). i18next to branżowy standard z lazy-loadingiem, pluralizacją i ekosystemem narzędzi. Migracja będzie przyrostowa przez warstwę kompatybilności — istniejący `useT()` pozostaje jako wrapper.

**Kroki do wykonania:**

1. Zainstaluj pakiety:
   ```
   npm install react-i18next i18next
   ```

2. Utwórz `src/i18n/locales/pl.json` — wyeksportuj do JSON wszystkie klucze z `TRANSLATIONS.pl` (pomiń funkcje — tylko stringi i tablice). Struktura: `{ "NAV": { "hero": "Bohater", ... }, "CHAR": { "title": "Postać", ... }, ... }`.

3. Utwórz `src/i18n/locales/en.json` — analogicznie z `TRANSLATIONS.en`.

4. Utwórz `src/i18n/i18n.js`:
   ```js
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import pl from './locales/pl.json';
   import en from './locales/en.json';

   i18n.use(initReactI18next).init({
     resources: { pl: { translation: pl }, en: { translation: en } },
     lng: localStorage.getItem('hj_lang') || 
          (navigator.language?.startsWith('pl') ? 'pl' : 'en'),
     fallbackLng: 'en',
     interpolation: { escapeValue: false },
   });

   export default i18n;
   ```

5. W `src/App.jsx` dodaj import na górze: `import './i18n/i18n.js';`

6. Zaktualizuj `src/i18n/translations.js` — dodaj eksport pomocniczy `useI18nT()` oparty na `useTranslation()` z react-i18next, żeby stopniowo migrować komponenty bez zmiany wszystkich naraz:
   ```js
   export { useTranslation } from 'react-i18next';
   ```

7. Uruchom `npm run build` — build musi przejść bez błędów. Istniejący `useT()` z TRANSLATIONS nadal działa (nic nie usuwamy).

8. Uruchom `npm test` — 25 testów musi przejść.

9. Wykonaj `git add -A && git commit -m "feat(P4.2): i18next setup + locales JSON + warstwa kompatybilności" && git push`

**Weryfikacja:** `npm run build` i `npm test` muszą przejść. Commit do GitHub. Aplikacja działa identycznie jak przed (TRANSLATIONS nadal aktywne).

---

### P4.3 — i18next: migracja pierwszych 3 komponentów

**Kontekst:** Po wykonaniu P4.2, ten krok migruje pierwsze 3 komponenty z `useT()` na `useTranslation()` jako proof of concept.

**Warunek wstępny:** P4.2 musi być ukończone (i18n.js i locales JSON muszą istnieć).

**Komponenty do migracji w tym kroku:**
- `src/features/quests/QuestScreen.jsx`
- `src/features/sessions/SessionsScreen.jsx`
- `src/features/world/LocationsScreen.jsx`

**Kroki dla każdego komponentu:**
1. Zamień `import { useT } from '../../i18n/translations'` na `import { useTranslation } from 'react-i18next'`
2. Zamień `const T = useT()` na `const { t } = useTranslation()`
3. Zamień użycia np. `T.QUESTS.newTitle` na `t('QUESTS.newTitle')`, `T.NAV.quests` na `t('NAV.quests')` itd.
4. Dla funkcji (np. `Q.count(n)`) — te zostają w TRANSLATIONS jako JS (i18next nie obsługuje funkcji w JSON).

**Weryfikacja:** `npm run build && npm test` muszą przejść. Commit: `"feat(P4.3): migracja QuestScreen, SessionsScreen, LocationsScreen na i18next"`

---

## Ukończone
<!-- Zadania zakończone -->

---
*Plik zarządzany przez automatycznego agenta. Dodaj zadania w sekcjach "W trakcie" lub "Do zrobienia".*
*Agent wykonuje jedno zadanie na raz, zaczynając od pierwszego w sekcji "Do zrobienia".*
*Po ukończeniu zadania przenosi je do "Ukończone" i pushuje zmiany.*
