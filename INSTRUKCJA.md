# Hero Journal — Instrukcja obsługi

## Czym jest Hero Journal?

Hero Journal to mobilny dziennik kampanii RPG. Zastępuje papierową kartę postaci, zeszyt z notatkami i mapę świata — wszystko masz w jednym miejscu, zawsze pod ręką. Aplikacja działa offline i zapisuje dane bezpośrednio w przeglądarce (localStorage), bez konieczności zakładania konta.

---

## Pierwsze uruchomienie — Kreator postaci

Przy pierwszym otwarciu aplikacji pojawi się **kreator postaci** prowadzący przez cztery kroki:

1. **Imię** — wpisz imię swojego bohatera (pojawi się w nagłówku aplikacji).
2. **Klasa** — wybierz klasę postaci z siatki ikon (Barbarzyńca, Mag, Paladyn itd.) oraz ustaw poziom.
3. **Atrybuty** — wybierz gotowy zestaw statystyk (Standardowy, Heroiczny, Zrównoważony) lub wpisz własne wartości ręcznie.
4. **Przeszłość i charakter** — opcjonalnie wpisz przeszłość (background) i wybierz charakter moralny.

Po kliknięciu **Rozpocznij Przygodę** trafiasz do głównego widoku aplikacji.

> Wszystkie dane z kreatora można swobodnie edytować podczas gry — nic nie jest zablokowane.

---

## Nawigacja

Na dole ekranu znajdują się **3 przyciski nawigacyjne**:

| Przycisk | Zawartość |
|---|---|
| ⚔️ **Bohater** | Karta postaci, Plecak, Czary, Zdolności |
| 🌍 **Świat** | Postacie (NPC), Miejsca, Frakcje |
| 📜 **Dziennik** | Kronika sesji, Zadania |

Kliknięcie przycisku grupy otwiera **szufladę** z zakładkami wewnątrz tej grupy. Kliknij wybraną zakładkę, żeby przejść do widoku.

---

## Bohater

### Karta postaci

Główna zakładka grupy Bohater. Podzielona na kilka sekcji:

#### Klasa i poziom
- Kliknij w nazwę klasy lub poziom, żeby je edytować.
- Przycisk **+ Wieloklasowość** dodaje drugą (lub trzecią) klasę — przydatne przy multiclassingu.

#### Przeszłość i charakter
- **Przeszłość** — pole tekstowe na background postaci (np. Żołnierz, Szlachcic).
- **Charakter moralny** — lista rozwijana z dziewięcioma opcjami (od Praworządnego dobrego do Chaotycznego złego).

#### Cechy i Rzuty Obronne (ST)
Siatka 6 atrybutów (STR, DEX, CON, INT, WIS, CHA) z polami ST poniżej każdego:

- **Kliknij wartość atrybutu** → otwiera pole do edycji; wpisz nową wartość i naciśnij Enter lub kliknij gdzie indziej.
- **Pole ST** → wyświetla modyfikator cechy automatycznie. Możesz wpisać własną wartość ręcznie (np. jeśli masz biegłość). Dwuklik resetuje do wartości automatycznej.

#### Żywotność i Walka
- **PŻ (HP)** — aktualne / maksymalne punkty życia. Przyciski **−** i **+** szybko odejmują/dodają 1 PŻ. Możesz też kliknąć bezpośrednio w liczby i wpisać wartość.
- **Tym. PŻ** — tymczasowe punkty życia.
- **KP** — Klasa Pancerza.
- **INI** — inicjatywa. Domyślnie pokazuje modyfikator Zręczności; wpisz własną wartość, żeby nadpisać.
- **Pasek HP** — wizualny wskaźnik zdrowia (zielony → pomarańczowy → czerwony).

#### Kości Wytrzymałości, Odpoczynek i Biegłość
- **Kości Wytrzymałości** — wybierz typ kości z listy i wpisz ile zużyłeś / ile masz maksymalnie.
- **☽ Krótki odpoczynek** → otwiera okno dialogowe. Wybierz ile kości wydajesz; aplikacja wyliczy ile PŻ odzyskujesz (średnia wartość + mod. Budowy).
- **☀ Długi odpoczynek** → przywraca pełne PŻ, odnawia komórki czarów, odzyskuje połowę kości wytrzymałości, czyści rzuty obronne przeciw śmierci.
- **Biegłość** — Premia z Biegłości. Zmień wartość, jeśli awansujesz na wyższy poziom.

#### Umiejętności
Siatka 18 umiejętności (Akrobatyka, Atletyka, Arcana itd.):

- **Kliknij raz** → biegłość (złota kropka, bonus = mod. cechy + Biegłość).
- **Kliknij drugi raz** → ekspertyza (niebieska kropka w kształcie rombu, bonus = mod. cechy + 2× Biegłość).
- **Kliknij trzeci raz** → brak biegłości.

---

### Plecak (Ekwipunek)

Lista wszystkich przedmiotów postaci.

**Dodawanie przedmiotu:**
1. Kliknij **⊕ Dodaj przedmiot**.
2. Wpisz nazwę i ilość.
3. Wybierz typ (Broń, Pancerz, Zwój z czarem itd.) — dla broni pojawią się dodatkowe pola na obrażenia i premię do trafienia.
4. Kliknij **⊕ Zapisz przedmiot**.

**Zarządzanie przedmiotem:**
- Kliknij **▼** przy nazwie, żeby rozwinąć szczegóły i edytować pola.
- Przełącznik **W plecaku / Wyposażony** — wyposażone przedmioty pojawiają się w sekcji „Aktywne i wyposażone" na karcie postaci.
- Kliknij **Usuń**, żeby trwale usunąć przedmiot.

**Filtrowanie** — pasek filtrów nad listą pozwala pokazać tylko wybrany typ przedmiotów.

---

### Czary

Księga zaklęć postaci.

**Zarządzanie komórkami czarów:**
Kliknij **⚙ Zarządzaj komórkami** — pojawi się panel, w którym możesz:
- Wybrać cechę rzucania (INT, WIS, CHA itd.).
- Ustawić ile komórek każdego poziomu masz i ile zużyłeś.
- Odczytać Trudność czarów (DC) i Modyfikator ataku czarami.

Komórki resetują się przy Długim odpoczynku.

**Dodawanie czaru:**
1. Kliknij **⊕ Dodaj czar**.
2. Wypełnij: nazwę, szkołę magii, poziom, czas rzucania, zasięg, czas trwania, komponenty, opis.
3. Kliknij **⊕ Zapisz czar**.

**Przygotowanie czaru:**
- Przełącznik **Znany / Przygotowany** — przygotowane czary pojawiają się w sekcji „Aktywne i wyposażone" na karcie postaci.
- Przycisk **📌** przypina czar na górę listy.
- Filtr poziomów nad listą pozwala szybko znaleźć czar.

---

### Zdolności i Atuty

Lista własnych zdolności, cech rasowych i atutów postaci (mechanik spoza standardowej listy umiejętności).

**Dodawanie zdolności:**
1. Kliknij **⊕ Dodaj wpis**.
2. Wpisz nazwę, wybierz kategorię (Umiejętność / Cecha rasowa / Atut) i poziom mistrzostwa (1–5 kropek).
3. Opisz działanie zdolności.
4. Dodaj tagi, żeby łatwiej filtrować.

**Aktywowanie zdolności:**
- Przełącznik **Nieaktywna / Aktywna** — aktywne zdolności pojawiają się w sekcji „Aktywne i wyposażone" na karcie postaci.

---

## Świat

### Postacie (NPC)

Kartoteka wszystkich napotkanych postaci niezależnych.

**Dodawanie NPC:**
Kliknij **⊕ Dodaj postać** i wypełnij pola: imię, rolę/profesję, przynależność frakcyjną, miejsce poznania, powiązania z drużyną. Wybierz **relację**:
- Sprzymierzeniec / Neutralny / Wrogi / Nieznany

Relację możesz zmienić klikając badge przy nazwie NPC na liście.

**Notatki:** rozwiń kartę NPC przyciskiem **▼** i zapisz zebrane informacje, plotki, sekrety.

**Tagi i filtry** — dodaj tagi (np. `kupiec`, `gildia`, `wróg`) żeby grupować postacie tematycznie.

---

### Miejsca

Kartoteka lokacji odkrytych podczas kampanii.

**Dodawanie lokacji:**
Wpisz nazwę, wybierz typ (Osada, Podziemia, Dzicz, Budynek, Ruiny itd.) i opisz miejsce w polu notatek.

Typ lokacji jest widoczny jako badge obok nazwy — kliknij go w widoku rozwiniętym, żeby zmienić.

---

### Frakcje

Organizacje, gildie, zakony, rządy i inne ugrupowania ze świata gry.

**Dodawanie frakcji:**
Wypełnij: nazwę, typ ugrupowania, przywódcę, siedzibę, główny cel i notatki.

**Ranga postaci w frakcji** — kliknij badge rangi (Nieznany / Sojusznik / Neutralny / Wróg / Członek / Oficer / Przywódca) na liście, żeby ją zmienić.

**Reputacja** — suwak od −100 do +100 śledzi stosunek frakcji do twojej postaci.

---

## Dziennik

### Kronika sesji

Tekstowy dziennik przebiegu kampanii.

**Nowy wpis:**
1. Kliknij **⊕ Nowy wpis** — pojawi się wpis z datą dzisiejszą i automatycznym numerem sesji.
2. Kliknij **✎ Edytuj kronikę** lub w obszar tekstu.
3. Pisz swobodnie — notatki z sesji, ważne wydarzenia, dialogi.
4. Kliknij **✓ Gotowe**, żeby opuścić tryb edycji.

**Hiperłącza encyklopedyczne (automatyczne linki):**
Jeśli w tekście kroniki wpiszesz imię postaci z listy NPC, nazwę lokacji, zadanie lub przedmiot z plecaka — aplikacja **automatycznie zamieni ten tekst w klikalny link**. Najechanie na niego pokaże dymek z podstawowymi informacjami o danym wpisie. Kliknięcie przeniesie do odpowiedniej zakładki.

> Przykład: Wpisałeś NPC o imieniu „Thorin" i lokację „Zamek Daggerfall". Gdy w kronice napiszesz te słowa, staną się interaktywnymi linkami.

---

### Zadania

Tracker aktywnych, ukończonych i nieudanych questów.

**Dodawanie zadania:**
Wypełnij: nazwę zlecenia, krótki opis i opcjonalną nagrodę. Kliknij **⊕ Aktywuj zadanie**.

**Zmiana statusu:**
Kliknij badge **Aktywne / Ukończone / Nieudane** przy nazwie zadania, żeby przełączyć między statusami.

**Kroki (cele cząstkowe):**
Rozwiń zadanie i kliknij **+ Dodaj krok** — każdy krok ma pole tekstowe i checkbox. Zaznaczony krok jest przekreślony. Licznik postępu (np. „2/5 wykonanych celów") wyświetla się pod nazwą zadania.

---

## Ustawienia globalne

### Motywy kolorystyczne

W nagłówku aplikacji (prawy górny róg) kliknij przycisk z nazwą aktualnego motywu. Pojawi się lista 8 motywów:

| Motyw | Klimat |
|---|---|
| 🌑 Mrok | Czernie i czerwienie — mroczny loch |
| 🔮 Obsydian | Ciemne fiolety — komnata maga |
| 🪵 Drewno | Ciepłe brązy — gospoda przy kominku |
| 🌅 Wschód | Pomarańcze i czerwienie — wschód słońca |
| 🌿 Las | Głęboka zieleń — leśna gęstwina |
| 🌊 Łupek | Stalowe błękity — ocean i niebo |
| 📜 Pergamin | Złocisty krem — stary rękopis |
| 🤍 Kość Słoniowa | Jasna biel — klasyczna elegancja |

Motyw jest zapisywany i przywracany przy kolejnym uruchomieniu.

### Wiele postaci

W nagłówku kliknij imię bohatera lub strzałkę **▾ Zmień** — przeniesie Cię do ekranu wyboru profilu. Możesz tam:
- Przełączyć się na inną postać.
- Kliknąć **⊕ Stwórz Nowego Bohatera**, żeby ponownie uruchomić kreator.
- Usunąć postać przyciskiem **✕** (operacja nieodwracalna).

Każda postać ma **całkowicie oddzielne dane** — plecak, czary, notatki itd.

### Reset postaci

Przycisk **↺ Reset** w nagłówku usuwa wszystkie dane aktualnej postaci i przywraca wartości domyślne. Przed usunięciem pojawia się potwierdzenie.

> ⚠ Operacji nie można cofnąć.

---

## Wskazówki i triki

- **Zaznacz czary i zdolności jako aktywne/przygotowane** — pojawiają się w dedykowanej sekcji na karcie postaci, skąd masz do nich szybki dostęp podczas walki.
- **Przycinaj ważne karty** przyciskiem 📌 — przypięte wpisy zawsze pojawiają się na górze listy.
- **Tagi** pomagają filtrować duże listy NPC, przedmiotów i zdolności.
- **Podwójne kliknięcie** na polu ST resetuje ręcznie wpisaną wartość z powrotem do automatycznej.
- Aplikacja **automatycznie zapisuje** każdą zmianę — nie ma przycisku „Zapisz".
- Działa **offline** — możesz korzystać z niej bez internetu po pierwszym załadowaniu strony.

---

*Powodzenia w przygodach!*
