# Lista zadań — Hero Journal

## W trakcie
<!-- Zadania aktualnie wykonywane -->

## Do zrobienia
<!-- Zadania oczekujące na wykonanie -->

### ✅ P10 — "Pasywna" wśród sugerowanych tagów + wzajemne wykluczanie — UKOŃCZONE
Polecenie: dodać tag "Pasywna" do sugerowanych tagów wpisów w Wyposażeniu oraz
po wyborze jednego z nich (akcja/bonus akcja/pasywna) ukryć całą sugestię w tym
wpisie — traktując je jako wzajemnie wykluczającą się grupę (pozycja D&D może
być albo Akcją, albo Akcją Dodatkową, albo cechą Pasywną — nie kilkoma naraz).
Dodano `"pasywna"` do `SUGGESTED_ACTION_TAGS` w `gameConstants.js`. Zamiast
zmieniać generyczny `TagsEditor` (używany też przez Lokacje z niewykluczającymi
się sugestiami), w miejscach wywołania (`InventoryScreen`, `SkillsScreen`,
`SpellsScreen`) obliczono `suggestions` jako `[]`, gdy wpis ma już którykolwiek
z tagów grupy, w przeciwnym razie pełną listę `SUGGESTED_ACTION_TAGS`.
Zweryfikowano w Playwright: po kliknięciu "+ akcja" sugestie "+ bonus akcja" i
"+ pasywna" znikają z tego wpisu.

---

### ✅ P9 — Skrócone etykiety walki + tagi akcji + przypinanie Przedmiotów — UKOŃCZONE
Trzy niezależne polecenia użytkownika:
1. **Skrócenie etykiet w karcie Walka** — `Inicjatywa→Inicjat.`, `Prędkość→Pręd.`,
   `Biegłość→Biegł.` (tylko PL — etykiety EN już były krótkie). Zmiana w
   `translations.js` (`CHAR.initiative/speed/profBonus`), bez zmian w komponencie.
2. **Tagi "Akcja"/"Bonus Akcja" we wszystkich wpisach Wyposażenia** — dodano
   stałą `SUGGESTED_ACTION_TAGS = ["akcja","bonus akcja"]` w `gameConstants.js`
   i podpięto jako `suggestions` do `TagsEditor` w Przedmiotach, Zdolnościach
   i Czarach (zakładka "Wyposażenie" to widok 3-kolumnowy łączący te 3 ekrany).
3. **Przypinanie wpisów Przedmiotów** — Przedmioty jako jedyny ekran encji nie
   miały pola `pinned`/przycisku `PrzypnijBtn`/sortowania wg przypięcia, mimo że
   mają już system tagów (dodany w tym samym zadaniu — wcześniej `InventoryScreen`
   nie miał `TagsEditor` wcale). Dodano `tags:[]`, `pinned:false` przy tworzeniu,
   `PrzypnijBtn` w nagłówku, `TagsEditor` z sugestiami oraz sort
   `(a,b)=>(b.pinned?1:0)-(a.pinned?1:0)`, plus klasę CSS `.pack-item.pinned`
   (analogiczną do `.card.pinned`, której `.pack-item` nie miało).
Pliki: `translations.js`, `gameConstants.js`, `InventoryScreen.jsx`,
`SkillsScreen.jsx`, `SpellsScreen.jsx`, `global.css`.
Zweryfikowano w Playwright na przykładowej postaci (1500×950 i 1920×1080).

---

### ✅ P8 — Tag/typ "Tarcza" w Przedmiotach + osobna ikona "Pancerza" — UKOŃCZONE
Dwa polecenia użytkownika dotyczące "tagów" Przedmiotów — po analizie okazało
się, że `InventoryScreen` nie ma systemu tagów, a "tagi" odnoszą się do
filtrowalnych **typów przedmiotów** (`ITEM_TYPE`, wyświetlanych jako przyciski
`filter-tag` z ikoną z `ITEM_ICONS`). Dodano nowy typ `ITEM_TYPE.SHIELD`
(`"shield"`/"Tarcza") z ikoną tarczy 🛡️ oraz zmieniono ikonę istniejącego typu
`ARMOR` ("Pancerz") na 🥋, by oba typy miały odrębne, czytelne ikony (wcześniej
oba współdzieliły 🛡️). Zmiany w `enums.js` (`ITEM_TYPE.SHIELD`,
`ITEM_TYPES_ENUM`), `translations.js` (PL/EN etykiety i tablice `ITEM_TYPES`)
oraz `gameConstants.js` (`ITEM_ICONS`, w tym klucze legacy PL).

---

### ✅ P7 — Nieczytelne pole "KP" w karcie Walka przy 1920×1080 — UKOŃCZONE
**Przyczyna:** siatka 4 boksów AC/Inicjatywa/Prędkość/Biegłość w `CombatCard.jsx`
używała `gridTemplateColumns:"repeat(4,1fr)"`. `1fr` to skrót `minmax(auto,1fr)`
— przy wąskiej dostępnej szerokości (przy układzie dwukolumnowym karty postaci
na 1920px szerokość `.combat-group` wynosiła ~302px) silnik Grid przydzielał
kolumnom miejsce wg ich `min-content` (najdłuższe nierozdzielne słowo etykiety),
więc kolumna "KP" (najkrótsza etykieta, 16px) skurczyła się do ~30px — za wąsko
na wartość "18" (21px czcionki, ~36px), która nachodziła na etykietę. Pozostałe
3 kolumny ("Inicjatywa" 91px, "Prędkość" 80px, "Biegłość" 77px) "zabierały"
przestrzeń kosztem najkrótszej.
**Poprawka:** zmieniono na `repeat(4, minmax(0,1fr))` (i analogicznie
`repeat(3, minmax(0,1fr))` dla siatki Percepcja/DC czarów/Atak czarami) —
wymusza równe szerokości kolumn niezależnie od długości treści, z `min-width:0`
pozwalającym na poprawne ścieśnianie zawartości. Zweryfikowano w Playwright
przy viewport 1920×1080: wszystkie 4 boksy mają teraz równą szerokość ~68px,
wartość "18" mieści się czytelnie w boksie "KP".
Plik: `CombatCard.jsx`.

---

### ✅ P6 — Pakiet 5 poprawek: Zdolności/Czary/Aktywne i Wyposażone — UKOŃCZONE
Polecenie użytkownika rozbite na 5 niezależnych zadań:

- [x] **P6.1** — Przypięte czary nie trafiały na szczyt listy: `SpellsScreen.jsx`
  nie miało sortowania `pinned` w `visible` (jedyny ekran z `pinned`, który go
  nie miał — Skills/NPCs/Locations/Factions mają). Dodano `pinned` jako sort
  nadrzędny nad sortowaniem wg szkoły/poziomu (`[...filtered].sort(...)`,
  zachowuje stabilność reszty kolejności).
- [x] **P6.2** — Ikony zdolności/czarów przeniesione obok pola nazwy (osobny
  `<span style={{fontSize:"1.1rem"}}>` w `entity-header`, analogicznie do
  `ITEM_ICONS[item.type]` w `InventoryScreen.jsx`), zamiast wewnątrz odznaki
  kategorii/szkoły pod nazwą. `SpellsScreen.jsx`: `displaySchool()` zwraca już
  tylko nazwę (bez ikony — usunięcie duplikatu). `SkillsScreen.jsx`: ikona
  usunięta z odznaki kategorii.
- [x] **P6.3** — Usunięto legendę kategorii zdolności (`SkillsScreen.jsx`, blok
  `{/* Legenda kategorii */}`) wraz z nieużywanymi klasami `.legend`/`.legendItem`/
  `.legendDot`/`.legendLabel` z `SkillsScreen.module.css`.
- [x] **P6.4** — Statyczne ikony zdolności/czarów (✨ / 🔮) w `EquippedCard.jsx`
  zamienione na `SKILL_CAT_ICONS[sk.category]` / `SPELL_SCHOOL_ICONS[sp.school]`
  (z fallbackiem do starych emoji) — odzwierciedlają teraz kategorię/szkołę
  wpisaną w zakładce Wyposażenie, tak jak `ITEM_ICONS[item.type]` dla przedmiotów.
- [x] **P6.5** — Drag&drop ręczne sortowanie dodane też do podzakładek "Zdolności"
  i "Czary" w `EquippedCard.jsx` (uchwyt ⠿, te same handlery co w "Przedmiotach"
  z P5.4, wydzielona wspólna funkcja `reorder`). Dodano `setSkills`/`setSpells`
  do łańcucha propsów `HeroJournal` → `CharacterScreen` → `EquippedCard`
  (operują na pełnych tablicach `skills`/`spells`, analogicznie do `inventory`).
Pliki: `SpellsScreen.jsx`, `SkillsScreen.jsx`, `SkillsScreen.module.css`,
`EquippedCard.jsx`, `CharacterScreen.jsx`, `HeroJournal.jsx`.

---

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
