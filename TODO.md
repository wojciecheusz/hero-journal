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

### ⏳ P5 — Pakiet 8 usprawnień karty postaci/świata (ZATWIERDZONE — W TRAKCIE)
Użytkownik zatwierdził cały pakiet poleceniem "Wykonaj wszystko". Realizacja w kolejności:
P5.2 → P5.6 → P5.7 → P5.8 → P5.3 → P5.5 → P5.1 → P5.4. Plan szczegółowy poniżej.

**P5.1 — Edytowalne wartości: bierna percepcja, DC umiejętności, atak czarami**
Obecnie `10 + percBonus` (CombatCard.jsx:122), `8 + pb + spellAbi` (CombatCard.jsx:126)
i bonus ataku czarami (CombatCard.jsx:130) są tylko wyświetlane (auto-liczone w
CharacterScreen.jsx:34-36). Dodać pole nadpisania (override) analogiczne do
`savingThrowOverride` — przechowywać w `char` (np. `passivePerceptionOverride`,
`skillDCOverride`, `spellAttackOverride`), a w UI: wartość liczona domyślnie,
edytowalna ręcznie z przyciskiem powrotu do auto.
Pliki: `CombatCard.jsx`, `CharacterScreen.jsx`, `gameConstants.js` (DEFAULT_CHAR).

**P5.2 — Długi odpoczynek resetuje stany (warunki)**
`doLongRest` w `shared/ui.jsx` (RestModal, ok. linii 197-210) resetuje HP, sloty
czarów, kości wytrzymałości i death saves, ale NIE czyści `char.conditions`.
Dodać reset `conditions: {}` (włącznie z poziomem wycieńczenia/exhaustion) do
długiego odpoczynku.
Plik: `src/shared/ui.jsx`.

**P5.3 — Przycisk biegłości (proficiency) przy rzutach obronnych**
`SavingThrowsCard.jsx` ma pole nadpisania wartości, ale nie ma przełącznika
biegłości — mimo że `char.savingThrows`/`char.savingThrowExp` istnieją w
DEFAULT_CHAR i są nieużywane. Dodać przełącznik analogiczny do `cycleSkill`
w `SkillsCard.jsx` (pip: brak → biegłość → ekspertyza, jeśli dotyczy) dla
każdego z 6 rzutów obronnych, z odpowiednim bonusem do wartości.
Plik: `src/features/character/cards/SavingThrowsCard.jsx`.

**P5.4 — Zmiana kolejności kafelków na karcie "Aktywne i Wyposażone" (drag&drop) + sortowanie czarów wg szkół magii**
a) `EquippedCard.jsx` renderuje `equippedItems` w kolejności z tablicy ekwipunku,
   bez możliwości zmiany. Brak biblioteki drag&drop w projekcie — dodać obsługę
   przeciągania (HTML5 `draggable`/`dragover`/`drop` natywnie, bez nowej zależności,
   żeby nie rozdmuchiwać bundle'a) i zapisywać nową kolejność do `inventory`.
b) `SpellsScreen.jsx` filtruje obecnie tylko wg poziomu czaru (linia ~17-23).
   Dodać grupowanie/sortowanie wg `school` (SPELL_SCHOOL, enums.js:77-87) —
   np. dodatkowy przełącznik sortowania poziom/szkoła.
Pliki: `EquippedCard.jsx`, `SpellsScreen.jsx`.

**P5.5 — Rodzaj obrażeń broni jako lista wyboru (wzorem szkół magii)**
`InventoryScreen.jsx` (linie ~64-69, 137-142) ma `damageType` jako wolny tekst.
Dodać enum `DAMAGE_TYPE` w `enums.js` (cięte/kłute/obuchowe + ew. żywiołowe typy
z 5e: ogień, zimno, kwas, piorun, dźwięk, trucizna, psychiczne, nekrotyczne,
promieniste, siłowe), tłumaczenia PL/EN w `translations.js` (LABELS.damageType),
i zamienić pole tekstowe na `<select>` analogicznie do wyboru szkoły czaru
w `SpellsScreen.jsx`.
Pliki: `enums.js`, `gameConstants.js`, `translations.js`, `InventoryScreen.jsx`.

**P5.6 — Nowe tagi lokacji: miasto, stolica, metropolia**
`LocationsScreen.jsx` (linia ~89) używa `TagsEditor` z dowolnym tekstem — tagi są
swobodne, nie enumem. Dodać listę sugerowanych tagów (np. `SUGGESTED_LOCATION_TAGS`
w `gameConstants.js` z wartościami "Miasto", "Stolica", "Metropolia" + ew. inne
typowe) wyświetlaną jako szybkie przyciski/chipsy obok edytora tagów, klikalne
do dodania.
Pliki: `gameConstants.js`, `LocationsScreen.jsx`, ew. `shared/ui.jsx` (TagsEditor —
opcjonalny prop `suggestions`).

**P5.7 — Różne ikony dla rodzajów zdolności (cecha rasowa / atut / umiejętność)**
`SkillsScreen.jsx` koduje kategorię (`SKILL_CAT`) tylko kolorem (linie 9-22),
bez ikon. Dodać mapę `SKILL_CAT_ICONS` w `gameConstants.js` (wzorem `ITEM_ICONS`,
linie 41-60) i wyświetlać ikonę przy każdej zdolności oraz w legendzie.
Pliki: `gameConstants.js`, `SkillsScreen.jsx`, opcjonalnie `EquippedCard.jsx`
(zakładka zdolności pokazuje obecnie stałe "✨").

**P5.8 — Różne ikony dla czarów wg szkół magii**
`SpellsScreen.jsx` pokazuje szkołę czaru jako sam tekst (badge, linia ~113),
bez ikony. Dodać mapę `SPELL_SCHOOL_ICONS` w `gameConstants.js` (9 szkół +
"inna") i renderować ikonę obok/zamiast nazwy szkoły.
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
