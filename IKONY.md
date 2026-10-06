# Ikony — Hero Journal (spis do P29)

Wszystkie ikony interfejsu pochodzą z biblioteki **lucide-react** i są rejestrowane
w jednym miejscu: `src/shared/icons.jsx` (`ICONS`, `ICON_COLORS`, `PALETTE_ICONS`).
Mapowania domenowe (typ przedmiotu, szkoła magii, relacja NPC itd.) leżą
w `src/constants/gameConstants.js`, nawigacja w `src/app/navigation.js`
i `src/constants/systems.js`.

Wszystkie nazwy w kolumnie „Propozycja" sprawdzono w zainstalowanej wersji lucide-react.

**Status:** ✅ jest i pasuje · ⚠️ jest, do zmiany/ujednolicenia · ➕ brak — nowa ikona · 🐞 błąd

---

## 1. Nawigacja główna (sidebar / menu mobilne)

| Element | Obecnie (lucide) | Status | Uwagi |
|---|---|---|---|
| Bohater → Postać | `sword` (Sword) | ✅ | |
| Bohater → Ekwipunek | `backpack` | ✅ | |
| Świat | `globe` | ✅ | |
| Dziennik (grupa) | `scroll` (ScrollText) | ✅ | |
| Kronika | `book-open` | ✅ | |
| Zadania | `zap` | ⚠️ | „zap" kojarzy się z akcją/błyskawicą; propozycja `flag`/`target`/`compass`. Do decyzji |

## 2. Podzakładki (nowe w P29 — A1/A2)

| Podzakładka | Propozycja | Status | Uwagi |
|---|---|---|---|
| Ekwipunek → Przedmioty | `backpack` / `package` | ✅ | ikony istnieją (stary układ `navigation.js`) |
| Ekwipunek → Zdolności | `sparkles` | ✅ | |
| Ekwipunek → Czary | `wand` (Wand2) | ✅ | |
| Świat → Postacie | `users` | ✅ | |
| Świat → Lokacje | `map` | ✅ | |
| Świat → Frakcje | `flag` | ✅ | |

## 3. Pasek narzędzi podzakładki (nowy w P29 — A4)

| Element | Propozycja | Status |
|---|---|---|
| Szukaj | `Search` | ➕ |
| Filtry (otwórz panel) | `SlidersHorizontal` (lub `Filter`) | ➕ |
| Usuń aktywny filtr (chip) | `close` (X) | ✅ |
| Dodaj wpis | `plus` | ✅ |
| Sortowanie (Czary: wg poziomu / szkoły) | `ArrowUpDown` | ➕ |

## 4. Akcje na karcie wpisu (wszystkie listy)

| Element | Obecnie | Status | Uwagi |
|---|---|---|---|
| Przypnij / odepnij | `pin` | ✅ | |
| Edytuj | `edit` (Pencil) | ✅ | |
| Rozwiń / zwiń | `chevron-down` / `chevron-up` | ✅ | |
| Pokaż więcej opisu (B2) | `chevron-down` | ✅ | |
| Usuń wpis | listy: przycisk tekstowy „Usuń" + `warning` przy potwierdzeniu; Zadania: `close` (X) | ⚠️ | ujednolicić: `Trash2` ➕ wszędzie (X sugeruje „zamknij") |
| Przeciągnij (kolejność) | `grip` | ✅ | |
| Dodaj tag | `plus` | ✅ | |
| Więcej akcji (gdy brak miejsca na wąskich ekranach) | `MoreHorizontal` | ➕ |

## 5. Sidebar — blok Życia (D1–D3)

| Element | Obecnie | Status | Propozycja / uwagi |
|---|---|---|---|
| Punkty życia | `heart` | ✅ | |
| Tymczasowe PŻ | brak czytelnej ikony (mały znak przy liczbie) | ➕ | `ShieldPlus` + etykieta „Tymcz." (D3) |
| − / + PŻ | `minus` / `plus` | ✅ | |
| Doświadczenie (XP) | brak | ➕ | `Star` lub `Trophy` |
| Dodaj XP (D2) | brak | ➕ | `CirclePlus` |
| Awansuj (D2) | brak (tylko znak „✦" w tekście) | ➕ | `ChevronsUp` / `CircleArrowUp` |
| Premia z biegłości | brak (tylko skrót PROF) | ➕ | `Award` |
| Percepcja pasywna | brak (PERC) | ➕ | `eye` |
| ST czarów | brak (SPELL DC) | ➕ | `Target` |
| Atak czarem | brak (SPELL ATK) | ➕ | `wand` |
| KP | `shield` | ✅ | |
| Inicjatywa | brak | ➕ | `zap` (jeśli Zadania dostaną inną ikonę) |
| Szybkość | brak | ➕ | `footprints` (dziś zajęta przez klasę Łotrzyk — dopuszczalne) |
| Stany (przycisk) | `activity` | 🐞 | **ikony nie ma w rejestrze `ICONS`, więc się nie renderuje** (`VitalsBar.jsx:196`, `Header.jsx:471`); dodać `Activity` |
| Rzuty przeciw śmierci | `heart` / `skull` | ✅ | |
| Wyczerpanie | brak | ➕ | `BatteryLow` |
| Krótki odpoczynek | `moon` | ✅ | |
| Długi odpoczynek | `sun` | ✅ | |
| Kości wytrzymałości | `dice` (Dices) | ✅ | |

## 6. Sidebar — nagłówek i stopka (D4–D9)

| Element | Obecnie | Status | Uwagi |
|---|---|---|---|
| Zmień bohatera (lewy górny róg) | ikona postaci + „HJ" | ⚠️ | do przeprojektowania razem z D4; `users` |
| Ikona bohatera (wybierana przez gracza) | `CharIconPicker` (np. `sparkles`) | ✅ | |
| „More" | strzałka `chevron-down` | ⚠️ | razem z D6 |
| Pomoc | `help-circle` | ✅ | |
| Wesprzyj autora | `beer` | ✅ | |
| Ustawienia | `settings` | ✅ | |

## 7. Panel Ustawień (D8)

| Element | Obecnie | Status | Uwagi |
|---|---|---|---|
| Przełącz język | `globe` | ✅ | |
| Zmień bohatera | `user` | ✅ | |
| Resetuj postać | brak (czerwony tekst) | ➕ | `RotateCcw` lub `warning` — strefa niebezpieczna |
| Synchronizuj | `sync` / `cloud` | ✅ | |
| Wyloguj | `logout` | ✅ | |
| Pobierz kopię / Importuj | `download` / `upload` | ✅ | |
| 12 motywów (Arcane, Pergamin, Dawn, Wschód, Drewno, Bone, Feywild, Eldritch, Dungeon, Shadowfell, Wrath, Meadow) | `sparkle`, `scroll`, `sun`, `sunrise`, `tree-deciduous`, `bone`, `sprout`, `orbit`, `key-round`, `moon-star`, `flame`, `flower` | ✅ | |

## 8. Przedmioty — typy (`ITEM_ICONS`)

| Typ | Ikona | Status |
|---|---|---|
| Ogólny | `package` | ✅ |
| Broń | `sword` | ✅ |
| Pancerz | `shirt` | ⚠️ koszulka słabo czyta się jako zbroja — rozważyć `ShieldHalf`/własną |
| Tarcza | `shield` | ✅ |
| Zwój z czarem | `scroll` | ✅ |
| Cudowny przedmiot | `sparkles` | ✅ |
| Jednorazowy / eksploatacyjny | `flask` | ✅ |
| Narzędzie | `wrench` | ✅ |
| Inny | `diamond` | ✅ |
| Monety (złoto / srebro / miedź) | `coins` (3 kolory) | ✅ |

**Nowe dla C2 (użycia i ładunki):**

| Element | Propozycja | Status |
|---|---|---|
| Pozostałe użycia (kropki) | `circle` pusta / wypełniona | ✅ |
| Zużyj jedno użycie | `minus` | ✅ |
| Odnawia się po krótkim / długim odpoczynku | `moon` / `sun` | ✅ |
| Odnawia się o świcie | `sunrise` | ✅ |
| Ładunki | `BatteryMedium` lub `zap` | ➕ |

## 9. Zdolności — kategorie (`SKILL_CAT_ICONS`)

| Kategoria | Ikona | Status |
|---|---|---|
| Zdolność klasowa | `target` | ✅ |
| Cecha rasowa | `dna` | ✅ |
| Atut | `star` | ✅ |

## 10. Czary — szkoły magii (`SPELL_SCHOOL_ICONS`)

| Szkoła | Ikona | Status |
|---|---|---|
| Odpychanie (Abjuration) | `shield` | ✅ |
| Przywoływanie (Conjuration) | `rotate-cw` | ✅ |
| Wróżbiarstwo (Divination) | `eye` | ✅ |
| Zauroczenie (Enchantment) | `sparkles` | ✅ |
| Wywoływanie (Evocation) | `flame` | ✅ |
| Iluzja | `drama` | ✅ |
| Nekromancja | `skull` | ✅ |
| Przemiana (Transmutation) | `orbit` | ✅ |
| Inna | `sparkle` | ✅ |
| Sloty czarów (przycisk „Zarządzaj") | `settings` | ✅ |
| Przygotowany / nieprzygotowany | przełącznik | ✅ |

## 11. Tagi akcji (Przedmioty, Zdolności, Czary)

Dziś tagi to sam tekst. Proponuję ikony dla 4 sugerowanych tagów:

| Tag | Propozycja | Status |
|---|---|---|
| Akcja | `CircleDot` | ➕ |
| Bonus akcja | `CirclePlus` | ➕ |
| Reakcja | `Reply` (lub `corner-down-right`) | ➕ |
| Pasywna | `Infinity` | ➕ |
| Tagi własne użytkownika (np. księga, list, mapa, klucz, mikstura, skarb) | `Tag` (wspólna) | ➕ |

## 12. Świat — Postacie (relacja, `REL_ICONS`)

| Relacja | Ikona | Status |
|---|---|---|
| Sojusznik | `handshake` | ✅ |
| Neutralny | `scale` | ✅ |
| Wrogi | `swords` | ✅ |
| Nieznany | `help-circle` | ✅ |

## 13. Świat — Lokacje (`LOC_TYPE_ICONS`)

| Typ | Ikona | Status |
|---|---|---|
| Osada | `home` | ✅ |
| Loch | `door-open` | ✅ |
| Dzicz | `trees` | ✅ |
| Budynek | `landmark` | ⚠️ karczma jako „landmark" (kolumny) wygląda jak urząd — rozważyć `Store`/`Beer` dla karczm albo osobny typ |
| Ruiny | `castle` | ✅ |
| Punkt orientacyjny | `gem` | ✅ |
| Inne | `diamond` | ✅ |

## 14. Świat — Frakcje

**Ranga/stosunek (`FACTION_RANK_ICONS`):** nieznany `help-circle`, sojusznik `handshake`,
neutralny `scale`, wróg `swords`, członek `user`, oficer `medal`, przywódca `crown`. Wszystkie ✅.

**Typ frakcji — dziś bez ikon** (karta pokazuje ikonę rangi):

| Typ | Propozycja | Status |
|---|---|---|
| Gildia | `Anvil` (lub `Hammer`) | ➕ |
| Zakon | `ShieldHalf` | ➕ |
| Kult | `skull` / `eye` | ➕ |
| Rząd | `landmark` | ➕ |
| Wojsko | `swords` | ➕ |
| Przestępcy | `VenetianMask` | ➕ |
| Kupcy | `coins` | ➕ |
| Religijna | `Church` | ➕ |
| Polityczna | `Gavel` | ➕ |
| Inna | `diamond` | ➕ |

## 15. Postać — atrybuty, rzuty, umiejętności

| Element | Obecnie | Status | Propozycja |
|---|---|---|---|
| Znacznik: brak biegłości / biegłość / ekspertyza | pusty `circle` / kropka / `diamond` | ✅ | dodać legendę (obserwacja z #4) |
| SIŁ / ZRĘ / KON / INT / MDR / CHA | brak | ➕ (opcjonalne) | `BicepsFlexed`, `Feather`, `HeartPulse`, `Brain`, `eye`, `crown` |

## 16. Stany (14 + Wyczerpanie) — dziś bez ikon

Opcjonalnie, jako ikony na chipach aktywnych stanów:

| Stan | Propozycja |
|---|---|
| Oślepiony | `EyeOff` |
| Zauroczony | `heart` |
| Głuchy | `EarOff` |
| Przerażony | `Frown` |
| Schwytany | `HandGrab` |
| Obezwładniony | `Ban` |
| Niewidzialny | `Ghost` |
| Sparaliżowany | `ZapOff` |
| Skamieniały | `Mountain` |
| Otruty | `Biohazard` |
| Powalony | `ArrowDownToLine` |
| Unieruchomiony | `Link` |
| Oszołomiony | `CircleSlash` |
| Nieprzytomny | `Bed` |
| Wyczerpanie (0–6) | `BatteryLow` |

## 17. Typy obrażeń (13) — dziś tekst, opcjonalnie

cięte `Slice`, kłute `crosshair`, obuchowe `Hammer`, kwas `Droplet`, zimno `Snowflake`,
ogień `flame`, moc `Magnet`, elektryczność `zap`, nekrotyczne `skull`, trucizna `Biohazard`,
psychiczne `Brain`, promieniste `sun`, grzmot `AudioWaveform`.

## 18. Dziennik — Kronika i Zadania

| Element | Propozycja | Status |
|---|---|---|
| Sesja (data) | `CalendarDays` | ➕ |
| Zadanie aktywne | `CircleDot` | ➕ |
| Zadanie ukończone | `CircleCheck` | ➕ |
| Zadanie nieudane | `CircleX` | ➕ |
| Nagroda | `star` | ✅ |

## 19. Klasy postaci (`DND_CLASSES`) — wszystkie ✅

Barbarzyńca `axe`, Bard `music`, Kleryk `cross`, Druid `leaf`, Wojownik `sword`,
Mnich `hand`, Paladyn `shield`, Łowca `crosshair`, Łotrzyk `footprints`,
Czarownik `flame`, Zaklinacz `sparkles`, Mag `book`, Inna `circle-ellipsis`.

## 20. Komunikaty i stany systemowe

ostrzeżenie `warning` ✅, sukces `check` ✅, zamknij `close` ✅, synchronizacja `sync`/`cloud` ✅,
informacja `Info` ➕, kości `dice` ✅, porada w samouczku `lightbulb` ✅.

## 21. Ikony aplikacji (PWA / przeglądarka) — pliki w `public/`

| Plik | Zastosowanie | Status |
|---|---|---|
| `favicon.svg` | karta przeglądarki | ✅ |
| `icon-192.png`, `icon-512.png` | PWA (Android/Chrome, instalacja na PC) | ✅ — sprawdzić wariant `maskable` w `manifest.json` |
| `apple-touch-icon.png` | iPad/iPhone (ekran główny) | ✅ |
| `icons.svg` | sprite | do weryfikacji, czy jest jeszcze używany |

---

### Podsumowanie

- **Do naprawy (🐞):** 1 — `activity` (przycisk Stanów) nie istnieje w rejestrze, więc ikona się nie wyświetla.
- **Nowe, potrzebne do P29 (➕):** szukaj, filtry, sortowanie, usuń (kosz), więcej akcji, tymczasowe PŻ, XP, dodaj XP, awans, 4 mini-staty, inicjatywa, szybkość, wyczerpanie, reset postaci, ładunki.
- **Nowe, rozszerzające (➕, do decyzji):** 4 tagi akcji + tag własny, 10 typów frakcji, 15 stanów, 13 typów obrażeń, 6 atrybutów, Kronika/Zadania, informacja.
- **Do ujednolicenia (⚠️):** Zadania (`zap`), Usuń (tekst / `X`), Pancerz (`shirt`), Budynek/karczma (`landmark`), przycisk zmiany bohatera, „More".
