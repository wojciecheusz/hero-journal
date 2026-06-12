# Lista zadań — Hero Journal

## Do zrobienia
<!-- Zadania oczekujące na wykonanie -->

### 🔄 P22 — Nowa estetyka ekranu Postać (PODGLĄD na branchu dev, 2026-06-12)
Polecenie: zaprojektować ekran Postać w stylu ciemnej, "appkowej" karty
(zaokrąglone rogi, granat + złoto, serif Cinzel) wg dostarczonego mockupu —
przygotowane jako podgląd na branchu `dev` (nie `main`) do oceny.
- [x] `src/features/character/cards/HeroHeaderCard.jsx` (nowy) — karta nagłówkowa:
      eyebrow "Hero Journal", imię, klasa/poziom, divider, PŻ + pasek + przyciski
      ±, miniodznaki KP/Inicjatywa/Prędkość, siatka Atrybutów (6) z wyróżnieniem
      cechy zarzucającej (spellcastingAbility), siatka Walki (KP/Inicj./Pręd./Biegł.)
      z wyróżnieniem Biegłości. Własna paleta kolorów (`.hcv2-*` zmienne CSS),
      niezależna od aktywnego motywu.
- [x] `global.css` — nowe klasy `.hcv2*` (karta, divider, stat-grid, combat-grid)
- [x] `translations.js` — `CHAR.abilitiesTitle`, `CHAR.statAbbr` (PL: SIL/ZRC/KON/INT/MDR/CHA)
- [x] Wpięcie `<HeroHeaderCard/>` na górze `CharacterScreen.jsx` (nad istniejącymi kartami)
- [x] Build + test wizualny (Playwright, mobile + desktop)
- [ ] Decyzja: czy rozszerzyć estetykę na resztę ekranów / scalić z `main`

### ✅ P21 — Zamiana wszystkich ikon emoji na SVG (lucide-react) — UKOŃCZONE (2026-06-11)
Cel: spójna grubość linii, kolorystyka per-kontekst (nie wszystko czarne/monochrom).
- [x] `npm install lucide-react`
- [x] `src/shared/icons.jsx` — komponent `Icon` (size="1em", strokeWidth=1.75,
      currentColor domyślnie) + rejestr `ICONS`/`ICON_COLORS`
- [x] `src/shared/ui.jsx` + `cards/shared.jsx` — ▲▼ (CardHeader), ✕ (tagi/search),
      📌📍 (PrzypnijBtn), ▸ (sugestie tagów)
- [x] `gameConstants.js`/`enums.js` — SKILL_CAT_ICONS, SPELL_SCHOOL_ICONS,
      REL_ICONS, FACTION_RANK_ICONS, LOC_TYPE_ICONS, ITEM_ICONS, DND_CLASSES
      → klucze semantyczne + mapy kolorów
- [x] `navigation.js` + `constants/systems.js` — ikony nawigacji (⚔🎒✨🔮🌍👥🗺⚜📜📖⚡💀📝 itd.)
- [x] App chrome: Header, Sidebar, MobileNav, SettingsMenu, LoginScreen,
      ProfileScreen, ErrorBoundary, HelpPanel
- [x] Karta postaci: CharCard, CombatCard, EquippedCard, RestModal, SpellSlotsWidget
- [x] Ekrany encji: InventoryScreen, SkillsScreen, SpellsScreen, NPCsScreen,
      LocationsScreen, FactionsPanel, SessionsScreen, QuestScreen (✎▲▼✓✕⊕⠿)
- [x] DiceRoller (🎲)
- [x] `translations.js` — usunięcie prefiksów emoji z etykiet (PL+EN), osobne
      mapy ikon: PALETTE_ICONS (motywy), REST/TUTORIAL/DICE, HELP.*.items
- [x] Build + szybki test wizualny (dev server)
- [x] Poprawka: czarne/wypełnione tła pod ikonami (Shirt, Package, Shield,
      Diamond, Sparkles itd.) — `Icon` przekazywał `fill={undefined}`, co
      nadpisywało `fill="none"` z lucide-react i włączało domyślny czarny
      fill SVG; naprawiono domyślną wartością `fill = "none"`.

### ✅ P20 — Faza 1: system Uniwersalny — UKOŃCZONE (2026-06-10)
**Status wdrożenia fazy 1:**
- `ProfileScreen.jsx` — dodano `SystemPicker` (wybór systemu przed kreatorem;
  WFRP zablokowany z etykietą "wkrótce") oraz `UniversalWizard` (2-krokowy:
  nazwa postaci → checkboxy funkcji z `DEFAULT_UNIVERSAL_SCHEMA`; wywołuje
  `makeUniversalDefaultChar`; zapisuje `system:"universal"` + `schema` w profileMeta).
- `src/features/universal/UniversalCharacterScreen.jsx` (nowy) — 3 typy kart:
  Atrybuty (grid nazwanych pól liczbowych z `schema.statGroups`), Zasoby
  (liczniki current/max z przyciskami ±, z `schema.resources`), Notatki
  (pola textarea z `schema.textFields` + ogólne `char.notes`). Dane przez `char.custom[id]`.
- `HeroJournal.jsx` — wykrywa `activeProfile.system === "universal"`, podmienia
  nawigację na `buildUniversalNavGroups(activeProfile.schema)` (mobile + desktop),
  renderuje `UniversalCharacterScreen` zamiast `CharacterScreen` dla taba "character".
- Ekwipunek/Dziennik/Zadania — reuse istniejących ekranów (`InventoryScreen`,
  `SessionsScreen`, `QuestScreen`) bez zmian — były już systemowo-neutralne.
- Tłumaczenia: sekcja `UNIVERSAL` + klucze `PROFILES.systemPicker*` w PL i EN.
- 55/55 testów przechodzi.
- Fazy 2-3 (edytowalny układ, szablony startowe) — patrz plan poniżej.

### 📋 P20 — Plan pełny: customowe profile niezależne od systemu D&D (FAZA 1 UKOŃCZONA)
Polecenie: zaplanować prosty, ale użyteczny sposób tworzenia w aplikacji profili
niezależnych od D&D 5e — użytkownik sam ustawia karty/zakładki/zasoby "po swojemu".
Poniżej plan fazowy (bez implementacji).

**Punkt wyjścia — odkryto martwy szkic:** `src/constants/systems.js` zawiera
`SYSTEMS` (z wpisem `"universal"` / "Sam określasz atrybuty, zasoby i sekcje karty"),
`DEFAULT_UNIVERSAL_SCHEMA`, `buildUniversalNavGroups(schema)`, `makeUniversalDefaultChar`
— kompletnie niepodłączone do reszty appki (zero referencji poza tym plikiem;
`ProfileScreen`/`CharacterScreen`/`navigation.js` są na sztywno D&D 5e). To dobry
fundament — plan poniżej go rozwija zamiast zaczynać od zera.

**Zasada przewodnia:** NIE budować pełnego, dowolnego page-buildera (drag&drop
siatka, dowolne pola) — zbyt drogie wdrożeniowo i pielęgnacyjnie (PDF export,
cloud sync, migracje danych musiałyby obsłużyć dowolność). Zamiast tego: kurator
mały zestaw gotowych, generycznych "typów kart/widżetów", które user układa
i konfiguruje (nazwa, kolejność, włącz/wyłącz) — pokrywa ~80% potrzeb homebrew
przy ułamku złożoności.

**Faza 1 — odpalić istniejący szkic "Uniwersalny" (najmniejszy koszt, realna wartość):**
- Przy zakładaniu profilu z systemem `"universal"` zamiast kreatora D&D pokazać
  prosty formularz: nazwa postaci + checkboxy funkcji (`features.inventory/world/
  journal/quests` — pola już istnieją w `DEFAULT_UNIVERSAL_SCHEMA`).
- Zbudować `UniversalCharacterScreen` z 3 generycznymi typami kart, renderowanymi
  z `schema` + zapisem do `char.custom[id]` (wzorzec już naszkicowany
  w `makeUniversalDefaultChar`):
  - **Karta Atrybutów** — nazwane wartości liczbowe, pogrupowane (`statGroups`)
  - **Karta Zasobów** — liczniki current/max (HP-podobne, np. "Many", "Wytrzymałości")
  - **Karta Notatek** — dowolne nazwane bloki tekstowe (`textFields`)
- Ekwipunek/Świat/Dziennik = **odsyłacz do istniejących generycznych ekranów**
  (`InventoryScreen`, `NPCsScreen`, `LocationsScreen`, `SessionsScreen`, `QuestScreen`
  już są systemowo-neutralne — działają na ogólnym kształcie `{id,name,tags,...}`).
  `buildUniversalNavGroups(schema)` (już istnieje) generuje z tego nawigację.
- Efekt: user dostaje działającą, samodzielną kartę postaci dla dowolnego systemu
  bez czekania na fazę 2 — krzywa naturalna, jak przy P19.3 (`useEntityList`).

**Faza 2 — edytowalny układ (dodawaj/usuwaj/zmieniaj kolejność):**
- W ustawieniach profilu: tryb "Edytuj układ karty" — dodawanie/usuwanie/przemianowanie/
  zmiana kolejności grup atrybutów, zasobów, bloków tekstowych i zakładek.
- Reorder przez już zbudowany `useDragReorder` (P19.5) — ten sam wzorzec
  (mysz + dotyk) co w `EquippedCard`.
- Krytyczne dla integralności danych: **stabilne `id` + edytowalna `name`**
  (już tak zaprojektowano w `DEFAULT_UNIVERSAL_SCHEMA` — `{id:"st1",name:"Atrybut 1"}`)
  — zmiana nazwy nie gubi danych zapisanych pod `custom[id]`.
- Persystencja: `schema` jako część metadanych profilu (Firestore + localStorage,
  obok `char`), współdzielona przez `cloudSave`/`cloudLoad` z istniejącym pipeline'm.

**Faza 3 — opcjonalna, długoterminowa (tylko jeśli faza 1-2 się przyjmie):**
- Customowe listy encji wykraczające poza Ekwipunek/Świat (np. "Kontakty",
  "Mutacje", system-specific rzeczy) — re-use `useEntityList` + generyczny
  renderer pól na bazie prostego opisu kolumn (`{key,label,type:"text"|"number"|"tags"}`).
- Gotowe szablony startowe (np. "Ogólne fantasy", "Sci-fi", "Horror") jako punkt
  wyjścia zamiast pustej kartki — redukuje tarcie "od czego zacząć".

**Co NIE robić (świadome ograniczenie zakresu):** dowolna siatka/pozycjonowanie
widżetów, pola o w pełni dowolnym typie/walidacji, eksport PDF dla customowych
schematów (na start — może być "tylko D&D ma PDF", z jasnym komunikatem).

**Pliki, które trzeba będzie ruszyć:** `systems.js` (rozbudowa, nie przepisanie),
`ProfileScreen.jsx` (rozgałęzienie kreatora wg `SYSTEMS`), nowy katalog
`features/universal/` (ekran + karty), `navigation.js` (połączenie z
`buildUniversalNavGroups`), `useProfileManager.js`/storage (persystencja `schema`).

 — Audyt całościowy (struktura/UX-lore/bezpieczeństwo/inżynieria) + plan poprawek (W TRAKCIE WDRAŻANIA)
Polecenie: przeprowadzić 4 audyty (strukturalny, UX/UI+lore D&D 5e, bezpieczeństwo
pod kątem udostępnienia testerom + publikacji w Google Play, inżynierii
oprogramowania) i zaplanować priorytet wdrożenia poprawek. Wykonano czterema
równoległymi agentami badawczymi (read-only); poniżej skonsolidowana,
zdeduplikowana lista poprawek do wdrożenia w kolejnych zadaniach (P20+),
podzielona wg priorytetu. **To zadanie = sam audyt i plan; wdrożenie poprawek
to osobne, przyszłe polecenia.**

#### 🔴 Priorytet WYSOKI (dane użytkownika / blokery publikacji / dług architektoniczny)
1. [x] **Brak potwierdzenia usunięcia całego profilu/postaci** — `ProfileScreen.jsx:60`
   → `useProfileManager.js:80 deleteProfile` kasuje wszystkie dane postaci jednym
   kliknięciem `✕`, bez modala potwierdzenia (wzorem istniejącego `ResetModal`).
   Najbardziej destrukcyjna akcja w aplikacji, zero zabezpieczenia.
   ✅ **UKOŃCZONE** — dodano stan `confirmDelete` + modal w `ProfileScreen.jsx`
   (wzorowany na `modal-overlay`/`modal-box` z `ResetModal`), nowe klucze
   `deleteTitle/deleteText/deleteCancel/deleteConfirm` w `translations.js` (PL+EN).
2. [x] **Brak polityki prywatności** — wymagana przez Google Play (sekcja "Bezpieczeństwo
   danych"/Data Safety) dla aplikacji z logowaniem Google i danymi osobowymi.
   Obecnie tylko luźny string `loginPrivacy` (`translations.js:88,481`). Trzeba
   napisać i opublikować stronę polityki prywatności + link z ekranu logowania.
   ✅ **UKOŃCZONE** — utworzono dwujęzyczną statyczną stronę
   `public/polityka-prywatnosci.html` (stylizowana jak reszta appki: Cinzel/
   Crimson Text, kolory pergaminu; opisuje dane logowania Google, przechowywanie
   w localStorage+Firestore z regułami per-user, brak udostępniania stronom
   trzecim, sposób usunięcia danych, kontakt: mwojciechowski069@gmail.com),
   dodano link `T.UI.loginPrivacyLink` pod tekstem na `LoginScreen.jsx`.
3. [x] **Masowa duplikacja logiki CRUD encji** — 8 niemal identycznych implementacji
   `add*/upd/del/toggle/pin/filterByTag` w `InventoryScreen`, `SkillsScreen`,
   `SpellsScreen`, `NPCsScreen`, `LocationsScreen`, `FactionsPanel` (np.
   `InventoryScreen.jsx:25-43`, `NPCsScreen.jsx:24,30-34,42-46`). Wyodrębnić
   współdzielony hook `useEntityList(items, setItems)` (`add/update/remove/
   toggle/pin/filterByTag/sortPinned`) — szacunkowo redukuje setki linii i
   centralizuje przyszłe poprawki (np. filtrowanie po tagach trzeba było
   powielić 6×, jak w P17).
   ✅ **UKOŃCZONE** — nowy hook `src/hooks/useEntityList.js`
   (`expanded/editing/activeTag/allTags` + `upd/del/toggle/startEdit/stopEdit`),
   wdrożony we wszystkich 6 ekranach encji (`InventoryScreen`, `SkillsScreen`,
   `SpellsScreen`, `NPCsScreen`, `LocationsScreen`, `FactionsPanel`) — lokalne
   pozostały tylko filtry specyficzne dla ekranu (`filterType/activeCat/
   activeLevel/activeSchool/filterRel/search`) i operacje spoza wzorca
   (`toggleEquip` w Inventory, `toggleInUse` w Skills/Spells).
4. [x] **`HeroJournal.jsx` jako god component** (477 linii) — sidebar (linie 225-271),
   panel pomocy (274-319), kolejka cloud-save (117-138), auto-resize textarea
   (82-100) renderowane/zarządzane inline zamiast w wydzielonych komponentach/
   hookach. Wydzielić `Sidebar`, renderer treści `HelpPanel`, kolejkę zapisu do
   chmury jako osobny hook.
   ✅ **UKOŃCZONE** — plik skrócony z 477 do 251 linii. Wydzielono:
   `src/app/Sidebar.jsx` (sidebar desktopowy + wewnętrzny `SidebarHelp`),
   `src/app/Header.jsx` (pasek mobile), `src/app/MobileNav.jsx` (szuflada +
   dolna nawigacja, z lokalnym stanem `openGroup`), `src/hooks/
   useTextareaAutoResize.js` (oba efekty auto-resize textarea), `src/hooks/
   useCloudSaveQueue.js` (kolejka debounce + licznik błędów + `syncFailed`).
5. [x] **Drag&drop reorder nie działa na ekranach dotykowych** — `EquippedCard.jsx:93-115`
   (Przedmioty/Zdolności/Czary) używał wyłącznie natywnego HTML5 DnD (`draggable`,
   `onDragStart/onDragOver/onDrop`) — to wzorzec myszy desktopowej; na telefonie/PWA/
   Google Play (czyli docelowej platformie) użytkownik **nie mógł** zmienić
   kolejności wyposażenia.
   ✅ **UKOŃCZONE (2026-06-08)**: Dodano `src/hooks/useDragReorder.js` — hybrydowy
   hook obsługujący zarówno HTML5 DnD (mysz/desktop, `bindRow`) jak i dotyk
   (`bindHandle` na uchwycie ⠿: `onTouchStart` + globalne `touchmove/touchend`
   z `elementFromPoint` do wykrycia elementu pod palcem, `e.preventDefault()`
   na `touchmove` żeby nie scrollować listy podczas przeciągania). Podświetlenie
   celu (`overId`) dodaje wizualny feedback podczas dragu. CSS: `touch-action: none`
   + powiększony obszar dotykowy na `.equipped-drag-handle` (`global.css:1092`).
   Zastąpiono trzy zduplikowane bloki dragowe (Przedmioty/Zdolności/Czary) jednym
   wzorcem `{...xDrag.bindRow(id)}` / `{...xDrag.bindHandle(id)}`. Zweryfikowano
   build (`npx vite build` ✓) i testy (37 pass / 6 pre-existing fail — bez regresji).
   Pliki: `src/hooks/useDragReorder.js` (nowy), `EquippedCard.jsx`, `global.css`.
6. [x] **Martwe podwójne systemy i18n** — `react-i18next`/`i18next` +
   `src/i18n/locales/{pl,en}.json` są zainicjalizowane (`i18n.js`, importy w
   `App.jsx`/`HeroJournal.jsx:3,79`), ale `useTranslation()` nigdzie nie jest
   wywoływane — realny system to `useT()`/`TRANSLATIONS` z `translations.js`
   (migracja P4.3 została cofnięta, zostały po niej "duchy"). Usunąć zależności
   `i18next`/`react-i18next`, `i18n.js`, `locales/`, wywołanie `syncI18nLang`.
   ✅ **UKOŃCZONE** — usunięto `src/i18n/i18n.js`, `src/i18n/locales/`,
   import `i18n.js` w `App.jsx`, wywołanie `syncI18nLang` w `HeroJournal.jsx`,
   odinstalowano pakiety `i18next`/`react-i18next` (`npm uninstall`, -7 paczek,
   0 podatności).
7. [x] **Ryzyko wyścigu (race condition) przy synchronizacji z chmurą** —
   `syncFromCloud` (`firestore.js:8-21`) nadpisuje `localStorage` całościowo przy
   logowaniu, bez znaczników czasu/scalania (`updatedAt`/last-write-wins);
   edycja w trakcie synchronizacji może zostać ubita.
   ✅ **UKOŃCZONE** — `syncFromCloud` używa teraz `updatedAt` (timestamp)
   per-klucz i logiki last-write-wins: lokalny zapis wygrywa jeśli `hj_ts_{key}`
   jest nowszy niż `doc.updatedAt`; pola z `value === undefined` są pomijane.
   `cloudSave` dołącza `updatedAt: Date.now()` do każdego zapisu i zapisuje
   znacznik czasu do `hj_ts_{key}` w localStorage. Pliki: `src/firebase/firestore.js`.
8. [x] **Zerowe pokrycie testami warstwy synchronizacji z Firestore** —
   ✅ **UKOŃCZONE** — dodano `src/__tests__/firestore.test.js` (12 testów):
   cloudSave strippuje `undefined` (w tym zagnieżdżone), dołącza `updatedAt`
   jako liczbę, zapisuje `hj_ts_*`; syncFromCloud — last-write-wins, brak
   nadpisania gdy lokalny nowszy, brak nadpisania gdy legacy-doc (bez `updatedAt`),
   pomija `value === undefined`, obsługuje wiele dokumentów niezależnie, łyka
   błędy sieci. Mock pattern: `vi.mock('firebase/firestore', ...)` +
   `vi.mock('../firebase/index.js', ...)`. Wszystkie 55 testów przechodzi.

#### 🟡 Priorytet ŚREDNI
9. [x] **Brak potwierdzenia usuwania pojedynczych wpisów** (przedmioty/czary/NPC/...) —
   `del(id)` wywoływane wprost z przycisku. Dodać lekkie potwierdzenie.
   ✅ **UKOŃCZONE** — 2-step delete w `useEntityList`: pierwsze kliknięcie ustawia
   `pendingDelete[id]` i podświetla przycisk na czerwono z etykietą `⚠ Usuń?`
   (klucz `T.UI.confirmDelete`); drugie w ciągu 2.5 s faktycznie usuwa; brak
   drugiego kliknięcia auto-resetuje po czasie. Wdrożone we wszystkich 6 ekranach
   encji. Pliki: `useEntityList.js`, `InventoryScreen`, `SkillsScreen`,
   `SpellsScreen`, `NPCsScreen`, `LocationsScreen`, `FactionsPanel`, `translations.js`.
10. [x] **`user-scalable=no` blokuje pinch-zoom** (`index.html:5`) — antywzorzec
    dostępności, szczególnie szkodliwy dla osób słabowidzących.
    ✅ **UKOŃCZONE** — usunięto `maximum-scale=1.0`, `minimum-scale=1.0`,
    `user-scalable=no` z meta viewport w `index.html`; pozostało tylko
    `width=device-width, initial-scale=1.0, viewport-fit=cover`.
11. [x] **Brak nagłówka Content-Security-Policy** (`Vercel.json`/`index.html`).
    ✅ **UKOŃCZONE** — dodano CSP + `X-Content-Type-Options: nosniff` +
    `X-Frame-Options: DENY` + `Referrer-Policy` w `vercel.json` dla wszystkich
    ścieżek `(.*)`. CSP pokrywa Firebase Auth/Firestore (Google APIs, WebSocket),
    Google Fonts (style/font-src), Google OAuth (frame-src/accounts.google.com);
    `style-src 'unsafe-inline'` zachowany (wymagany przez React inline styles).
12. **Reguły Firestore bez walidacji kształtu/rozmiaru danych** (`firestore.rules`) —
    poprawnie izolują dane per-user, ale zalogowany użytkownik może zapisać
    dowolnie duży/zniekształcony dokument (koszty/awarie klienta). Dodać
    `request.resource.size()` i podstawową walidację typów/rozmiaru w `allow write`.
13. [x] **Podwójna reprezentacja Wycieńczenia (lore bug)** — binarny `exhausted`
    w `CONDITIONS` sprzeczny z licznikiem poziomów 0-6 `conditions.exhaustion`.
    ✅ **UKOŃCZONE** — usunięto wpis `{ key:"exhausted", label:"Wyczerpany" }`
    z `CONDITIONS` w `gameConstants.js`; komentarz wyjaśnia dlaczego. Licznik
    poziomów w `CombatCard` pozostaje jako jedyna reprezentacja Wycieńczenia.
14. [x] **Długi odpoczynek całkowicie czyścił Wycieńczenie** (`ui.jsx conditions:{}`)
    — wg PHB 2014 usuwa tylko 1 poziom; pozostałe stany (Skamieniały, Otruty...)
    nie kończą się snem.
    ✅ **UKOŃCZONE** — `doLongRest` w `shared/ui.jsx` teraz robi `conditions:
    {...prevCond, exhaustion: Math.max(0, prevExh - 1)}` zamiast `conditions: {}`
    — Wycieńczenie dekrementuje o 1, wszystkie inne stany zachowane.
15. [x] **`dev-dist/` (artefakty builda PWA) commitowane do gita** — brak w
    `.gitignore` (jest tylko `dist`/`dist-ssr`), pliki `dev-dist/registerSW.js`,
    `sw.js`, `workbox-*.js` powtarzalnie trafiają do commitów. Dodać `dev-dist`
    do `.gitignore` i `git rm -r --cached dev-dist`.
    ✅ **UKOŃCZONE** — dodano `dev-dist` do `.gitignore`, odpięto z repo
    (`git rm -r --cached dev-dist`).
16. [x] **Niespójne umiejscowienie Frakcji** — `FactionsPanel` był w `features/factions/`
    zamiast obok `NPCsScreen`/`LocationsScreen` w `features/world/`.
    ✅ **UKOŃCZONE** — przeniesiono do `features/world/factions/FactionsPanel.jsx`;
    zaktualizowano ścieżki importów (wszystkie `../../` → `../../../`); import
    w `HeroJournal.jsx` zaktualizowany; stary katalog `features/factions/` usunięty.
    Build zweryfikowany.
17. **System migracji danych nieskalowalny** — dwie migracje (`migrateLegacy`,
    `migrateToEnums`, `storage.js:149-244`) oparte na ad-hoc flagach/sprawdzeniach
    obecności, bez numerowanej wersji schematu. Wprowadzić `schemaVersion` per
    profil + łańcuch migracji `v1→v2→v3…` zanim pojawi się trzecia zmiana schematu.
18. [x] **Komunikat o błędzie synchronizacji dopiero po 3 niepowodzeniach** —
    licznik nigdy nie resetował się po sukcesie; pojedyncze błędy ciche.
    ✅ **UKOŃCZONE** — `useCloudSaveQueue` teraz: (a) eksportuje `syncWarning`
    ustawiany po 1. błędzie — pokazuje delikatny żółty baner `☁ Synchronizacja…`
    (non-interactive, `pointerEvents:none`); (b) `syncFailed` nadal po 3+; (c) licznik
    i `syncWarning` resetują się przy każdym udanym zapisie (`.then(() => { ... })`).
    Pliki: `useCloudSaveQueue.js`, `HeroJournal.jsx`.

#### 🟢 Priorytet NISKI (porządki kosmetyczne/techniczne)
19. **Literówka w kluczu danych `sleightzhand`** (`gameConstants.js:154`,
    powielona w `translations.js:60,453`) zamiast `sleightofhand` — etykiety
    poprawne (Polskie/EN nazwy OK), ale klucz wprowadza w błąd; wymaga migracji
    danych przy zmianie.
20. **Osierocony `SkillsScreen.module.css`** — jedyny moduł CSS w całym
    `features/`, reszta ekranów używa `global.css` (1326 linii). Ujednolicić
    konwencję stylowania (albo rozszerzyć moduły CSS wszędzie, albo usunąć ten jeden).
21. **`shared/ui.jsx` jako "worek" 317 linii** — miesza generyczne prymitywy
    (`TagsEditor`, `FilterBar`, `SearchBar`, `Toggle`) z widżetami domenowymi
    (`RestModal`, `SpellSlotsWidget`, linie 153-303). Rozbić na `shared/ui/`
    (prymitywy) i np. `features/character/widgets/` (domenowe).
22. **Drobna pośrednia warstwa w `gameConstants.js`** — re-eksportuje/przemianowuje
    tablice z `enums.js` (linie 7,18-25), co utrudnia odnalezienie źródła wartości.
23. **`translations.js` jako jeden płaski plik 800 linii** — działa, ale trudny
    w przeglądaniu/diff'owaniu; rozważyć podział wg funkcji (per-feature namespaces).
24. **Brak typowania (JSDoc/TS/PropTypes)** — w pełni nietypowany JS dla
    aplikacji z zagnieżdżonymi strukturami danych (`char.stats`, `spellSlots`...),
    którą `validateCharData` musi bronić defensywnie w runtime. Rozważyć
    `@typedef`y JSDoc + `checkJs` w `jsconfig.json` (bez pełnej migracji do TS).
25. **Tutorial/Pomoc mogą nie nadążać za nowymi funkcjami** — brak slajdów/wpisów
    o filtrowaniu po tagach i zwijaniu kart Świata (dodanych w P17/P18).
    Zaktualizować `TutorialModal`/`HelpPanel`.

#### Pozycje sprawdzone i uznane za poprawne (bez akcji)
- Bezpieczeństwo: brak XSS (`dangerouslySetInnerHTML`/`eval` nie występują),
  `npm audit` = 0 podatności, sekrety nieobecne w repo (mitygacje z incydentu
  [[Wyciek klucza Firebase]] nadal aktywne — `.gitignore`, restrykcje klucza w GCP,
  reguły Firestore), `ErrorBoundary` nie wycieka stack trace do użytkownika,
  `localStorage` nie przechowuje tokenów/poświadczeń.
- Lore D&D 5e: formuły poprawne (percepcja bierna `10+mod`, DC czarów `8+pb+mod`,
  atak czarami `pb+mod`, inicjatywa = mod. Zręczności, rzuty śmierci ograniczone
  do 3), kompletne i poprawne listy: 18 umiejętności, 8 szkół magii, 13 typów
  obrażeń, polskie nazewnictwo zgodne z oficjalnym podręcznikiem PHB.
- Inżynieria: dobra separacja warstwy danych (`useCharacterData`/`storage.js`/
  `firestore.js`) od UI, code-splitting przez `React.lazy` na wszystkie ekrany,
  sanityzacja `JSON.parse(JSON.stringify())` konsekwentnie stosowana w jedynym
  punkcie zapisu do Firestore (`cloudSave`).

**Sugerowana kolejność wdrażania:** zacząć od pozycji 1-2 (najmniejszy nakład,
największe ryzyko — utrata danych usera / blokada publikacji), potem 6 i 15
(czyszczenie, niskie ryzyko regresji), następnie 3-4 (refaktoryzacja strukturalna
— duży nakład, ale odblokowuje szybsze wdrażanie kolejnych funkcji), na końcu
pakiety 9-14 i 16-25 wg dostępnego czasu.

**Status wdrożenia (2026-06-10):** Wykonano pozycje 1–9, 11, 13–16, 18
(wszystkie 🔴 i większość 🟡). Testy: 55/55 zielonych (wszystkie pre-existing
failures naprawione: `ITEM_TYPES_ENUM` → 9, środowisko `jsdom` dla storage tests).
Pozostałe pozycje (10, 12, 17, 19–25) czekają na kolejne zadania/polecenia.

---

### ✅ P18 — Edycja typu Przedmiotów po utworzeniu + zwinięte karty Świata = nazwa+tagi — UKOŃCZONE
Dwa powiązane polecenia użytkownika:
- [x] **P18.1** — Po utworzeniu Przedmiotu (np. z typem "Broń") nie dało się zmienić
  jego typu/kategorii (np. na "Pancerz") — brakowało selektora typu w trybie edycji
  `InventoryScreen`. Dodano rząd przycisków wyboru typu na początku `pack-item-body`
  w edycji (ikony `ITEM_ICONS` + `T.ITEM_TYPES`, `onClick={() => upd(item.id,"type",t)}`),
  analogicznie do wyboru typu w `LocationsScreen`/`FactionsPanel`. Sprawdzono też
  `NPCsScreen` — relacja (odpowiednik "kategorii") była już w pełni edytowalna
  (rząd przycisków w trybie edycji), więc nie wymagała poprawki.
- [x] **P18.2** — Zwinięty wpis w podzakładkach Świata (Postacie/Miejsca/Frakcje)
  pokazuje teraz WYŁĄCZNIE nazwę i tagi; cała reszta treści (odznaka relacji/typu/
  rangi, pola szczegółowe, podgląd notatek, formularz edycji) renderuje się dopiero
  po rozwinięciu — przeniesiona pod wspólny blok `{open && (...)}` w `NPCsScreen.jsx`,
  `LocationsScreen.jsx` i `FactionsPanel.jsx`. Usunięto przy okazji zbędne
  dwustanowe (2-linie/pełny tekst) style `entry-preview`, bo podgląd notatek
  renderuje się teraz tylko w stanie rozwiniętym (zawsze pełny, `whiteSpace:pre-wrap`).

Zweryfikowano wizualnie w Playwright na przykładowej postaci: dodanie Przedmiotu
z typem "Broń", zmiana w edycji na "Pancerz" → odznaka typu w nagłówku zmienia się
("Broń"→"Pancerz"); zwinięte karty NPC/Lokacji/Frakcji pokazują tylko nazwę i
odznaki tagów (np. "Elara Moonwhisp" + priest/elf/ally), rozwinięte pokazują
odznakę relacji/typu/rangi, pola szczegółowe i pełną treść notatek.

### ✅ P17 — Filtrowanie po tagach (Plecak/Czary) + tagi w karcie "Aktywne i Wyposażone" — UKOŃCZONE
Dwa powiązane polecenia użytkownika:
- [x] **P17.1** — W kolumnach Plecak i Czary dodano filtrowanie po ręcznie dodanych
  tagach (np. "magic", "healing", "combat") — analogicznie do sekcji Zdolności,
  przez `<FilterBar allTags={...} activeTag={...} onSelect={...}/>` ze `shared/ui.jsx`,
  pod istniejącym paskiem filtrowania po typach/poziomach/szkołach (bez zmian w nim).
  Dodano `allTags`/`activeTag` i filtr w `visible`/`filtered` w `InventoryScreen.jsx`
  i `SpellsScreen.jsx`.
- [x] **P17.2** — W karcie "Aktywne i Wyposażone" (`EquippedCard.jsx`) dodano
  wyświetlanie tagów przypisanych do wpisów (Przedmioty/Zdolności/Czary) — te same
  tagi, które użytkownik dodaje przez `TagsEditor` w zakładkach Wyposażenie/Świat —
  jako małe odznaki `.tag.tag-default` obok plakietek typu/kategorii/szkoły
  w wierszach `equipped-item`.

Zweryfikowano wizualnie w Playwright na przykładowej postaci: pasek "Filtr: ..."
z tagami (np. magic/medicine/order/scouting w Plecaku, combat/control/damage/
enchantment/healing/protection w Czarach) renderuje się pod paskiem typu/poziomu/
szkoły; karta "Aktywne i Wyposażone" pokazuje tagi (magic, order, combat,
bonus-action, healing, paladin, damage, protection itd.) przy każdym wpisie
we wszystkich trzech zakładkach (Przedmioty/Zdolności/Czary).

### ✅ P15 — Pakiet poprawek: czary, wpisy Świata jak w Wyposażeniu, etykiety pól edycji — UKOŃCZONE
Sześć powiązanych poleceń użytkownika:
- [x] **P15.1** — W kolumnie Czary zmieniono tekst przycisku "⚙ Zarządzaj komórkami"
  na samo "Komórki" (`SP.manageSlots` w `translations.js:163`).
- [x] **P15.2** — Rząd z licznikiem czarów i przyciskami w nagłówku kolumny Czary
  był niewyrównany do prawej przy zawijaniu (`flex-wrap` w `.screen-col-header`
  z `justify-content:space-between` — pojedynczy element na zawiniętej linii
  lądował przy lewej krawędzi). Naprawiono przez `margin-left:auto` na
  `.screen-col-header .col-actions` (`global.css`).
- [x] **P15.3** — Wpisy zakładki Świat (Postacie/Lokacje/Frakcje) wyglądają teraz
  jak wpisy Wyposażenia: duża ikona typu (1.1rem, wzorem `ITEM_ICONS` w
  `InventoryScreen`) obok pola nazwy w nagłówku karty (relacja NPC — `REL_ICONS`,
  typ lokacji — `LOC_TYPE_ICONS`, ranga frakcji — `FACTION_RANK_ICONS`), odznaka
  pod nazwą stała się statycznym tekstem bez ikony (uniknięcie duplikacji wizualnej).
  Klasa `.badge-icon` pozostała — nadal używana w paskach filtrów (NPC/Lokacje).
- [x] **P15.4** — Wybór relacji NPC / rangi frakcji działa teraz przez bezpośredni
  wybór z rzędu przycisków (analogicznie do typu lokacji w `LocationsScreen`),
  zamiast przeklikiwania odznaki. Usunięto `cycleRel`/`cycleRank` oraz nieużywaną
  już stałą `REL_CYCLE` z `gameConstants.js`; w trybie edycji dodano rzędy przycisków
  z bezpośrednim `upd(id,"relation"/"rank",val)` (z ikonami `REL_ICONS`/`FACTION_RANK_ICONS`).
- [x] **P15.5** — Usunięto tekst "naniesionych na mapę" / "on the map" z licznika
  lokacji (`T.LOCATIONS.count` w `translations.js`, PL i EN).
- [x] **P15.6** — W oknach edycji wpisów Postaci i Frakcji pola (rola,
  przynależność, miejsce poznania, powiązania / typ, lider, siedziba, cel) miały
  tylko placeholdery, które znikały po wypełnieniu. Owinięto je w `.pack-field`/
  `.pack-field-label` (wzorem `InventoryScreen`) z nowymi kluczami tłumaczeń
  (`T.NPCS.role/affiliation/metAt/connections`, `T.FACTIONS.type/leader/headquarters/goal`),
  dzięki czemu etykieta pola jest zawsze widoczna.

Zweryfikowano wizualnie w Playwright na przykładowej postaci ("John Silverblade"):
przycisk komórek czarów = "⚙ Komórki" i wiersz wyrównany do prawej; karty NPC/Lokacji/
Frakcji mają dużą ikonę typu obok nazwy i odznakę tekstową; tryb edycji NPC/Frakcji
pokazuje etykiety pól oraz rzędy przycisków bezpośredniego wyboru relacji/rangi
(z ikonami); licznik lokacji nie zawiera już "naniesionych na mapę".

### ✅ P13 — Kolejność kolumn podzakładek Wyposażenia na PC — UKOŃCZONE
Polecenie: zmienić kolejność 3-kolumnowego widoku desktopowego zakładki
"Wyposażenie" z `Plecak, Czary, Zdolności` na `Plecak, Zdolności, Czary`.
Zmieniono kolejność `<div className="screen-col">` w `HeroJournal.jsx`
(linie ~394-401, widok `multi-col-desktop`) — zamieniono miejscami kolumny
`SkillsScreen`/`SpellsScreen`. Zweryfikowano w Playwright na przykładowej
postaci: nagłówki kolumn renderują się w kolejności `["Plecak","Zdolności","Czary"]`.

---

### ✅ P12 — Ikony tagów/odznak w zakładce Świat + usunięcie reputacji frakcji + przeniesienie sugerowanych tagów lokacji — UKOŃCZONE
Trzy powiązane polecenia użytkownika dot. ujednolicenia wyglądu zakładki
"Świat" (NPC/Lokacje/Frakcje) z benchmarkiem zakładki "Wyposażenie"
(gdzie typ przedmiotu wyświetla się z ikoną, np. `ITEM_ICONS[item.type]`):
1. **Ikony przy odznakach** — dodano 3 nowe mapy ikon w `gameConstants.js`
   (`REL_ICONS` dla relacji NPC: 🤝/⚖️/⚔️/❓, `FACTION_RANK_ICONS` dla rang
   frakcji: 🤝/⚖️/⚔️/👤/🎖️/👑/❓, `LOC_TYPE_ICONS` dla typów lokacji:
   🏘️/🕳️/🌲/🏛️/🏚️/🗿/◈) i wyświetlono je przed etykietą w `rel-badge`
   (`NPCsScreen.jsx`), odznace rangi (`FactionsPanel.jsx`) oraz `loc-type`
   i przyciskach wyboru typu w formularzu (`LocationsScreen.jsx`).
2. **Usunięcie paska reputacji frakcji** — usunięto cały suwak −100..+100
   wraz z opisem z wpisów `FactionsPanel.jsx`, pole `reputation` z tworzenia
   nowych frakcji i danych przykładowych (`sampleHero.js`), oraz osierocone
   klucze tłumaczeń `FACTIONS.reputation` i wpisy samouczka "REP." (PL+EN).
3. **Przeniesienie sugerowanych tagów lokacji** — usunięto sekcję "sugerowane"
   (`suggestions={SUGGESTED_LOCATION_TAGS}`) z wpisów `TagsEditor` lokacji
   i dodano w jej miejsce rząd przełączalnych przycisków domyślnych tagów
   (miasto/stolica/metropolia/wioska/twierdza/świątynia) w formularzu
   tworzenia nowej lokacji — wybrane trafiają od razu do `tags` nowego wpisu.
Pliki: `gameConstants.js`, `NPCsScreen.jsx`, `LocationsScreen.jsx`,
`FactionsPanel.jsx`, `translations.js`, `sampleHero.js`. Zweryfikowano
w Playwright: ikony renderują się poprawnie przy odznakach (🤝 SPRZYMIERZENIEC,
🕳️ PODZIEMIA, 🎖️ OFFICER), pasek reputacji zniknął z kart frakcji, a formularz
nowej lokacji pokazuje przełączalne tagi domyślne (✓ po zaznaczeniu).

---

### ✅ P11 — Oficjalne nazwy stanów/szkół magii + wymiana motywów kolorystycznych — UKOŃCZONE
Cztery powiązane polecenia użytkownika na podstawie załączonych materiałów
(PDF "Stany" z oficjalnymi PL nazwami warunków + obrazek "8 Schools of Magic"):
1. **Nazwy stanów (`CONDITIONS`)** — poprawiono 9 z 14 etykiet PL na zgodne z
   oficjalnym tłumaczeniem podręcznika (np. `Oczarowany→Zauroczony`,
   `Ogłuchy→Głuchy`, `Chwycony→Schwytany`, `Zatruty→Otruty`,
   `Leżący→Powalony`, `Ogłuszony→Oszołomiony`) oraz dodano brakujący stan
   `exhausted`/"Wyczerpany" (PL+EN) w `gameConstants.js` i `translations.js`.
2. **Nazwy szkół magii** — po doprecyzowaniu przez użytkownika oficjalnej listy
   z podręcznika gracza 5e PL skorygowano 4 etykiety: `Odrzucanie→Odpychanie`
   (Abjuration), `Surogacja→Uroki` (Enchantment), `→Wieszczenie` (Divination,
   wcześniejsza poprawka na "Poznanie" cofnięta jako błędna), `Przemiana→Przemiany`
   (Transmutation); pozostałe już zgadzały się z oficjalną terminologią
   (`Iluzja`, `Nekromancja`, `Przywoływanie`, `Wywoływanie`). EN bez zmian.
3. **Redukcja motywów** — usunięto 6 starych palet (`mrok`, `obsydian`,
   `karczma`, `puszcza`, `bone`, `ocean`), zachowując tylko `pergamin`/`wschod`;
   `pergamin` ustawiono jako nowy domyślny motyw (zastępując usunięty `mrok`)
   w `useTheme.js`, `LoginScreen.jsx`, `global.css` (`:root`), `HelpPanel.jsx`,
   `TutorialModal.jsx`, `ProfileScreen.jsx`.
4. **8 nowych motywów** wg opisów estetyki/kolorów użytkownika — w pełni
   zdefiniowane (3 jasne: `oath`, `astral`, `quill`; 3 średnie: `feywild`,
   `eldritch`, `dungeon`; 2 ciemne: `underdark`, `wrath`) w `themes.js`
   (`PALETTES` + `THEMES`, ~38 zmiennych CSS na motyw) wraz z etykietami
   PL/EN (z emoji) w `PALETTE_LABELS`.
Pliki: `gameConstants.js`, `translations.js`, `themes.js`, `useTheme.js`,
`LoginScreen.jsx`, `global.css`, `HelpPanel.jsx`, `TutorialModal.jsx`,
`ProfileScreen.jsx`. Zweryfikowano w Playwright: wszystkie 10 nazw motywów
renderuje się poprawnie w menu ustawień, a wszystkie 8 nowych motywów
wygląda zgodnie z opisaną estetyką (sprawdzono kontrast i czytelność).

---

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

### ✅ P14 — Pakiet 5 poprawek: ikony tagów, tłumaczenia frakcji, filtry, układ nagłówków — UKOŃCZONE
Pięć powiązanych poleceń użytkownika:
- [x] **P14.1** — Ikony odznak (relacja NPC / typ lokacji / ranga frakcji) owinięte
  w `<span className="badge-icon">` z dopasowanym `font-size: 0.5rem` i
  `vertical-align: -0.04em` (nowa współdzielona klasa w `global.css`) — teraz
  renderują się na wysokości linii tekstu odznaki, proporcjonalnie do reszty.
  Zastosowano w `loc-type` (`LocationsScreen.jsx`) i odznace rangi frakcji
  (`FactionsPanel.jsx`); `rel-badge` w `NPCsScreen.jsx` miał to już wcześniej.
- [x] **P14.2** — Dodano helpery `displayFactionType`/`displayFactionRank`
  (`T.LABELS.factionType`/`factionRank`) w `FactionsPanel.jsx` i użyto ich
  wszędzie: odznaka rangi, filtry typu, formularz dodawania, widok edycji.
  Pole `fac.type` zamieniono ze swobodnego `<input>` na `<select>` z
  `<option value={enum}>{tłumaczenie}</option>`, by nie nadpisywać surowej
  wartości enumu polskim tłumaczeniem (wzorem `displayDamageType` z P5.5).
- [x] **P14.3** — Dodano filtr typu lokacji (z licznikami, wzorem filtra
  frakcji) w `LocationsScreen.jsx` wraz ze stanem `filterType`; filtr relacji
  w `NPCsScreen.jsx` już istniał z wcześniejszego commitu `e93bdca`.
- [x] **P14.4** — Sprawdzono `InventoryScreen`/`SkillsScreen`/`SpellsScreen` —
  licznik i przycisk dodawania były już w rzędzie nagłówka (`screen-col-header`)
  z wcześniejszego commitu `e93bdca`, zmiany nie były potrzebne.
- [x] **P14.5** — Przeniesiono licznik + przycisk dodawania do rzędu nagłówka
  (`screen-col-header`/`col-title`/`col-actions`) w `LocationsScreen.jsx` i
  `FactionsPanel.jsx` (oba dotąd nie przyjmowały nawet propsa `title`);
  `NPCsScreen.jsx` miał to już zrobione. Przy okazji poprawiono licznik lokacji
  z zahardkodowanego angielskiego tekstu na `T.LOCATIONS.count(n)`.

Zweryfikowano wizualnie zrzutami ekranu (Playwright/chromium-cli) każdy
podpunkt osobno — ikony, tłumaczenia, filtry, układ nagłówków na obu
zakładkach (Świat i Wyposażenie), w tym porównanie zachowania `flex-wrap`
nagłówków na wąskich szerokościach (zgodne z istniejącym wzorcem, nie regresja).

---

### ✅ P4.1 — CSS Modules: pilot na SkillsScreen
Utworzono `SkillsScreen.module.css` z klasami `.legend`, `.legendItem`, `.legendDot`, `.legendLabel`, `.countBar`.
Zamieniono inline styles legendy i licznika na klasy z modułu CSS.

### ✅ P4.2 — i18next: warstwa kompatybilności i konfigur