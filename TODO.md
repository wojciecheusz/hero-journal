# Lista zadań — Hero Journal

## W trakcie
<!-- Zadania aktualnie wykonywane -->

## Do zrobienia
<!-- Zadania oczekujące na wykonanie -->

### ✅ P5.0 — PRIORYTET: napraw błąd synchronizacji z chmurą "DANE ZAPISANE LOKALNIE" — UKOŃCZONE
**Wdrożona poprawka:** w `cloudSave()` (`src/firebase/firestore.js:27-34`) dane są
teraz oczyszczane przez `JSON.parse(JSON.stringify({ value }))` tuż przed wysyłką
do `setDoc()` — usuwa to rekurencyjnie wszystkie klucze o wartości `undefined`
(np. `initiativeBonus`), zachowując strukturę `{ value }` odczytywaną przez
`syncFromCloud`. Wewnętrzny model danych aplikacji (sentinel `undefined` w
`CombatCard.jsx`) pozostał bez zmian — poprawka działa wyłącznie na granicy
zapisu do Firestore.

**Przyczyna (potwierdzona logiem z konsoli):**
`cloudSave()` w `src/firebase/firestore.js:29` wysyła surowy obiekt postaci wprost
do `setDoc()` Firestore. Pole `char.initiativeBonus` ma domyślnie wartość `undefined`
(`gameConstants.js:113` DEFAULT_CHAR, `sampleHero.js:22`, `ProfileScreen.jsx:111`
kreator postaci) — używane świadomie jako sentinel "brak ręcznego nadpisania"
(odczytywane w `CombatCard.jsx:37,47,51`). **Firestore SDK odrzuca `undefined`
jako wartość pola** i rzuca błąd synchronicznie przy KAŻDYM zapisie postaci:
```
Function setDoc() called with invalid data. Unsupported field value: undefined
(found in field value.initiativeBonus in document users/.../data/hj_char_sample_...)
```
Stąd błąd po dowolnej zmianie — zapis `char` zawsze zawiera to pole. Po 3 błędach
(`_cloudErrCount` w `HeroJournal.jsx:131`) pokazuje się toast. Dane lądują tylko
w localStorage — chmura nigdy się nie synchronizuje.

**Plan naprawy:**
Oczyszczać dane z `undefined` tuż przed wysyłką do Firestore w `cloudSave()`
(np. `JSON.parse(JSON.stringify(value))` — dane i tak muszą być JSON-serializowalne,
bo trafiają też do localStorage przez `JSON.stringify`; ten zabieg usuwa klucze
z wartością `undefined` rekurencyjnie i bezpiecznie). To rozwiązanie defensywne —
chroni też przed analogicznymi przyszłymi polami z sentinelem `undefined`, bez
zmiany wewnętrznego modelu danych aplikacji (CombatCard nadal może używać
`undefined` jako "brak nadpisania" lokalnie).
Plik: `src/firebase/firestore.js` (funkcja `cloudSave`).

**Uwaga poboczna (nie wymaga akcji):** ostrzeżenie w konsoli o przestarzałym
meta-tagu `apple-mobile-web-app-capable` to nieszkodliwe info przeglądarki
(zalecenie dodania `mobile-web-app-capable`) — kosmetyka PWA, osobna sprawa.

---

### ✅ P5 — Pakiet 8 usprawnień karty postaci/świata — UKOŃCZONY
Użytkownik zatwierdził cały pakiet poleceniem "Wykonaj wszystko". Zrealizowano w kolejności:
P5.2 → P5.6 → P5.7 → P5.8 → P5.3 → P5.5 → P5.1 → P5.4 (wszystkie 8 ukończone). Szczegóły poniżej.

**✅ P5.1 — Edytowalne wartości: bierna percepcja, DC umiejętności, atak czarami — UKOŃCZONE**
Pola bierna percepcja / DC czarów / atak czarami w `CombatCard.jsx` zamieniono
ze statycznych `<span>` na edytowalne `<input>` z mechanizmem nadpisania (override),
wzorem `savingThrowOverride`. Nowe pola w `char`: `passivePerceptionOverride`,
`skillDCOverride`, `spellAttackOverride` (dodane do `DEFAULT_CHAR` w `gameConstants.js`
oraz do kreatora postaci `ProfileScreen.jsx`). Wartość liczona automatycznie,
gdy pole puste/niepoprawne — czyszczone na `onBlur` (powrót do auto), wzorem
istniejącego `initiativeBonus`. Aktywne nadpisanie podświetlone kolorem
`var(--hj-pip-prof)`. Dodano tłumaczenie `overrideTip` (PL/EN) jako `title` pola.
Pliki: `CombatCard.jsx`, `gameConstants.js`, `ProfileScreen.jsx`, `translations.js`.

**✅ P5.2 — Długi odpoczynek resetuje stany (warunki) — UKOŃCZONE**
W `doLongRest` (`src/shared/ui.jsx:197-211`) dodano `conditions: {}` do obiektu
zwracanego przez `setChar`, obok istniejącego resetu HP/slotów/kości/death saves.
Czyści to wszystkie aktywne warunki, w tym poziom wycieńczenia (exhaustion),
zgodnie z zasadą, że długi odpoczynek usuwa stany.
Plik: `src/shared/ui.jsx`.

**✅ P5.3 — Przycisk biegłości (proficiency) przy rzutach obronnych — UKOŃCZONE**
Dodano `cycleSavingThrow` w `SavingThrowsCard.jsx`, dokładnie wzorem `cycleSkill`
z `SkillsCard.jsx` — klikalny pip (brak → biegły ● → ekspert ◆) w rogu każdego
pola rzutu obronnego, zapisujący do istniejących (wcześniej nieużywanych) pól
`char.savingThrows`/`char.savingThrowExp`. Wartość rzutu liczona jest teraz jako
`baza + pb` (biegły) lub `baza + pb*2` (ekspert), z zachowaniem priorytetu
ręcznego nadpisania `savingThrowOverride` (działa identycznie jak wcześniej —
dwuklik czyści override). Dodano prop `pb` do `SavingThrowsCard` (przekazywany
z `CharacterScreen.jsx`) oraz tłumaczenie `proficiency` (PL/EN, etykieta `title`/`aria-label`).
Pliki: `SavingThrowsCard.jsx`, `CharacterScreen.jsx`, `translations.js`.

**✅ P5.4 — Zmiana kolejności kafelków na karcie "Aktywne i Wyposażone" (drag&drop) + sortowanie czarów wg szkół magii — UKOŃCZONE**
a) Dodano natywny HTML5 drag&drop (`draggable`/`onDragStart`/`onDragOver`/`onDrop`,
   bez nowej zależności) do listy przedmiotów w `EquippedCard.jsx` — uchwyt ⠿
   (`.equipped-drag-handle`) przy każdym wyposażonym przedmiocie. Upuszczenie
   przenosi przeciągany przedmiot na pozycję docelowego w pełnej tablicy
   `inventory` (zachowując względną kolejność pozostałych) i zapisuje przez
   nowy prop `setInventory` przekazany przez `CharacterScreen` ← `HeroJournal`.
b) W `SpellsScreen.jsx` dodano przełącznik sortowania „Wg poziomu / Wg szkoły”
   (`sortMode`) w pasku filtrów — w trybie „szkoła” lista czarów grupowana jest
   alfabetycznie wg `school` (SPELL_SCHOOL) i filtrowana przyciskami szkół
   (z ikonami `SPELL_SCHOOL_ICONS` i licznikami), analogicznie do filtra poziomów.
   Dodano stan `activeSchool` i tłumaczenia `sortByLevel`/`sortBySchool` (PL/EN).
Przetestowano w przeglądarce (Playwright): przeciąganie zmienia kolejność
przedmiotów (np. Longsword +1 ↔ Plate Armor), sortowanie wg szkoły grupuje
poprawnie (Odrzucanie → Przywoływanie → Surogacja → Wywoływanie), filtrowanie
do jednej szkoły i powrót do sortowania wg poziomu działają bez błędów konsoli.
Pliki: `EquippedCard.jsx`, `SpellsScreen.jsx`, `CharacterScreen.jsx`,
`HeroJournal.jsx`, `translations.js`, `global.css`.

**✅ P5.5 — Rodzaj obrażeń broni jako lista wyboru (wzorem szkół magii) — UKOŃCZONE**
Dodano enum `DAMAGE_TYPE`/`DAMAGE_TYPES_ENUM` w `enums.js` (13 typów: cięte,
kłute, obuchowe + 10 żywiołowych/innych z 5e: kwas, zimno, ogień, siłowe,
piorun, nekrotyczne, trucizna, psychiczne, promieniste, dźwięk), wyeksportowano
jako `DAMAGE_TYPES` z `gameConstants.js`. Dodano tłumaczenia PL/EN
(`LABELS.damageType` + tablica `DAMAGE_TYPES`) w `translations.js`. Pole
tekstowe `damageType` w `InventoryScreen.jsx` zamieniono na `<select>`
analogicznie do wyboru szkoły czaru — zarówno w formularzu dodawania, jak
i przy edycji przedmiotu; podgląd wyświetla przetłumaczoną nazwę przez
nowy helper `displayDamageType`.
Pliki: `enums.js`, `gameConstants.js`, `translations.js`, `InventoryScreen.jsx`.

**✅ P5.6 — Nowe tagi lokacji: miasto, stolica, metropolia — UKOŃCZONE**
Dodano stałą `SUGGESTED_LOCATION_TAGS` (`gameConstants.js`) z wartościami
miasto/stolica/metropolia/wioska/twierdza/świątynia. `TagsEditor` (`shared/ui.jsx`)
otrzymał opcjonalny prop `suggestions` — wyświetla chipsy "+ tag" pod edytorem
dla tagów jeszcze nie dodanych, klikalne do dodania jednym ruchem. Podłączono
w `LocationsScreen.jsx` (`<TagsEditor … suggestions={SUGGESTED_LOCATION_TAGS}/>`).
Dodano tłumaczenia `tagSuggestions` (PL/EN) i style `.tags-suggestions`,
`.tags-suggest-label`, `.tag-suggestion` w `global.css`.
Pliki: `gameConstants.js`, `shared/ui.jsx`, `LocationsScreen.jsx`, `translations.js`, `global.css`.

**✅ P5.7 — Różne ikony dla rodzajów zdolności (cecha rasowa / atut / umiejętność) — UKOŃCZONE**
Dodano mapę `SKILL_CAT_ICONS` w `gameConstants.js` (🎯 umiejętność, 🧬 cecha
rasowa, ⭐ atut), wzorem `ITEM_ICONS`. Ikony wyświetlane są teraz przy: badge'u
kategorii na karcie zdolności, w legendzie kategorii, w przyciskach filtra,
w formularzu dodawania i w selektorze kategorii podczas edycji.
Pliki: `gameConstants.js`, `SkillsScreen.jsx`.

**✅ P5.8 — Różne ikony dla czarów wg szkół magii — UKOŃCZONE**
Dodano mapę `SPELL_SCHOOL_ICONS` w `gameConstants.js` (po jednej ikonie dla
8 szkół + "inna": 🛡️ abjuracja, 🌀 przywołanie, 👁️ wróżbiarstwo, 💫 zauroczenie,
🔥 ewokacja, 🎭 iluzja, 💀 nekromancja, 🔄 transmutacja, ✨ inna). `displaySchool()`
w `SpellsScreen.jsx` dołącza ikonę do nazwy szkoły — widoczne na badge'u czaru
oraz w obu rozwijanych listach wyboru szkoły (formularz dodawania i edycja).
Pliki: `gameConstants.js`, `SpellsScreen.jsx`.
Pliki: `gameConstants.js`, `SpellsScreen.jsx`, opcjonalnie `EquippedCard.jsx`
(zakładka przygotowanych czarów).

**Kolejność realizacji (jeśli zatwierdzone):** P5.2 i P5.6 są najmniejsze/najbezpieczniejsze
(bez nowych enumów), potem P5.7/P5.8 (mapy ikon), potem P5.3/P5.5 (nowe pola/enum +
tłumaczenia), na końcu P5.1 i P5.4 (najbardziej złożone — nowe pola override / drag&drop).

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
