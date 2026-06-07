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

**✅ P5.2 — Długi odpoczynek resetuje stany (warunki) — UKOŃCZONE**
W `doLongRest` (`src/shared/ui.jsx:197-211`) dodano `conditions: {}` do obiektu
zwracanego przez `setChar`, obok istniejącego resetu HP/slotów/kości/death saves.
Czyści to wszystkie aktywne warunki, w tym poziom wycieńczenia (exhaustion),
zgodnie z zasadą, że długi odpoczynek usuwa stany.
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
