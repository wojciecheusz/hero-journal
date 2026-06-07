# Lista zadań — Hero Journal

## W trakcie
<!-- Zadania aktualnie wykonywane -->

## Do zrobienia
<!-- Zadania oczekujące na wykonanie -->

## Ukończone

### ✅ P4.1 — CSS Modules: pilot na SkillsScreen
Utworzono `SkillsScreen.module.css` z klasami `.legend`, `.legendItem`, `.legendDot`, `.legendLabel`, `.countBar`.
Zamieniono inline styles legendy i licznika na klasy z modułu CSS.

### ✅ P4.2 — i18next: warstwa kompatybilności i konfiguracja
- Zainstalowano `react-i18next` i `i18next`
- Utworzono `src/i18n/locales/pl.json` i `src/i18n/locales/en.json` z tłumaczeniami NAV, UI, LABELS, SESSIONS, QUESTS, LOCATIONS
- Utworzono `src/i18n/i18n.js` z konfiguracją (zapamiętany język, fallback EN)
- Dodano inicjalizację i18n w `App.jsx` i synchronizację z `HeroJournal`
- Istniejący `useT()` i `TRANSLATIONS` pozostają aktywne (migracja przyrostowa)

### ↩️ P4.3 — i18next: migracja pierwszych 3 komponentów (cofnięta)
Pierwotnie zmigrowano `QuestScreen.jsx`, `SessionsScreen.jsx`, `LocationsScreen.jsx`
z `useT()` na `useTranslation()`/`t('QUESTS.*')` z react-i18next (commit 895ecd2).

Cofnięto w ramach commitu `ed04a02` ("unifikacja i18n") — `locales/pl.json`/`en.json`
pokrywają tylko ułamek tekstów (NAV, UI, LABELS, SESSIONS, QUESTS, LOCATIONS — 57 linii),
podczas gdy `TRANSLATIONS` w `translations.js` obejmuje kompletnie wszystkie ekrany
(784 linie: CHAR, INVENTORY, SKILLS, SPELLS, NPCS, FACTIONS, PROFILES…). Trzymanie
dwóch równoległych systemów groziło rozjazdami kluczy, więc wrócono do jednego
spójnego `useT()`. Pełne przejście na react-i18next pozostaje możliwe, ale wymagałoby
osobnej, zaplanowanej migracji całego zbioru tłumaczeń — nie tylko trzech ekranów.

---
*Plik zarządzany przez automatycznego agenta. Dodaj zadania w sekcjach "W trakcie" lub "Do zrobienia".*
*Agent wykonuje jedno zadanie na raz, zaczynając od pierwszego w sekcji "Do zrobienia".*
*Po ukończeniu zadania przenosi je do "Ukończone" i pushuje zmiany.*
