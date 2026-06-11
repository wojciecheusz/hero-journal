# Hero Journal — opis funkcjonalny aplikacji (do wklejenia w kreator UI)

## 1. Koncepcja

Hero Journal to aplikacja webowa (PWA, działa offline) będąca cyfrową kartą postaci RPG + dziennikiem kampanii. Domyślnie wspiera D&D 5e, docelowo również inne systemy (Warhammer Fantasy Roleplay 4e, system "uniwersalny" dla dowolnej gry). Aplikacja jest dwujęzyczna (polski/angielski, przełącznik w ustawieniach). Użytkownik może mieć wiele profili/postaci ("bohaterów") i przełączać się między nimi. Dane zapisywane lokalnie (localStorage) i opcjonalnie synchronizowane w chmurze po zalogowaniu kontem Google (Firebase/Firestore).

## 2. Styl wizualny / klimat

- Estetyka fantasy / pergamin / stary podręcznik RPG.
- Nagłówki, etykiety, przyciski: czcionka serif typu **Cinzel** — WIELKIE LITERY, szeroki letter-spacing, mały rozmiar (etykiety sekcji).
- Treść (notatki, opisy, długie teksty): czcionka serif typu **Crimson Text** / Georgia, większy rozmiar, lepsza czytelność.
- Karty (cards) z ramką, lekkim cieniem, tłem w odcieniu pergaminu/skóry/kamienia w zależności od motywu.
- Akcent kolorystyczny (złoto/bursztyn ~#e2b94e) używany do podświetleń, aktywnych elementów, ramek wyróżnionych.
- 10 gotowych motywów kolorystycznych do wyboru w ustawieniach, np.: Pergamin (jasny, klasyczny), Wschód, Drewno, Kość słoniowa, Feywild (zielono-fioletowy, baśniowy), Eldritch (mroczny, fioletowy), Dungeon (kamienny, ciemny), Shadowfell (mroczny, szaro-fioletowy), Wrath (czerwono-czarny), Meadow (zielona łąka). Każdy motyw definiuje pełną paletę: tło główne, tło kart, tło inputów, tło nawigacji, kolory tekstu (główny/wyciszony/etykiety), kolory ramek, kolor akcentu, gradienty nagłówków, kolory specyficzne dla szkół magii i typów przedmiotów.
- Drobne ikony emoji używane konsekwentnie jako ikonografia (⚔ miecz/marka, 📌 pin, ✎ edycja, ⚠ ostrzeżenie/usuń, ▲/▼ zwiń/rozwiń, 🌐 język, ⚙ ustawienia, 🍺 wsparcie autora, ❤️💫🎲☠️ odpoczynek, ☽☀ krótki/długi odpoczynek).

## 3. Struktura nawigacji

### Desktop
- Stały lewy sidebar z:
  - przyciskiem marki (ikona książki + imię aktywnego bohatera) → przejście do ekranu wyboru profilu,
  - listą grup nawigacji: pojedyncze pozycje (np. "Postać") oraz grupy z podpozycjami,
  - "wirtualne" zakładki łączące kilka ekranów w widok wielokolumnowy:
    - **Wyposażenie** = 3 kolumny obok siebie: Plecak (Ekwipunek) | Zdolności | Czary,
    - **Świat** = 3 kolumny obok siebie: Postacie (NPC) | Miejsca | Frakcje,
  - osobne pozycje: Postać, Kronika (sesje), Zadania,
  - panel kontekstowej pomocy (rozwijany przyciskiem "?") pokazujący opis sterowania dla aktywnej zakładki,
  - stopkę z: przyciskiem pomocy, linkiem wsparcia (Ko-fi), przyciskiem ustawień (rozwija dropdown).

### Mobile
- Dolny pasek nawigacji z grupami: **Bohater** (Postać/Ekwipunek/Zdolności/Czary), **Świat** (NPC/Miejsca/Frakcje), **Dziennik** (Sesje/Zadania).
- Kliknięcie grupy z wieloma podzakładkami otwiera wysuwaną szufladę (drawer) z listą podzakładek (ikona + etykieta); wybór zamyka szufladę i przełącza ekran.
- Każdy ekran w widoku mobile jest jednokolumnowy (brak widoków 3-kolumnowych).
- Górny header z marką/nazwą bohatera i dostępem do ustawień.

## 4. Logowanie

- Ekran startowy: duże logo "⚔ Hero Journal" z hasłem/tagline.
- Przycisk logowania przez Google (z ikoną G).
- Stopka z linkiem do polityki prywatności (krótki tekst informacyjny o przetwarzaniu danych).
- Aplikacja działa też bez logowania (tryb tylko-lokalny) — logowanie jest opcjonalne i służy do synchronizacji w chmurze.

## 5. Ekran wyboru profilu / bohatera

- Lista kart profili: ikona klasy postaci, imię, poziom, klasa; aktywny profil oznaczony odznaką.
- Każda karta: ikona ołówka do zmiany nazwy inline, ikona usuwania (z modalem potwierdzenia — dostępna tylko gdy jest więcej niż 1 profil).
- Przycisk "Stwórz nowego bohatera" → uruchamia kreator postaci.
- Przycisk (stylizowany na przerywaną ramkę) "Stwórz przykładowego bohatera" — generuje gotową przykładową postać do eksploracji aplikacji.
- Stopka z licznikiem liczby bohaterów.

## 6. Kreator postaci (wizard, 6 kroków, wskaźnik kropek postępu)

1. **Imię** — pole tekstowe na imię postaci.
2. **Klasa i poziom** — siatka ikon klas (13 klas D&D: wojownik, mag, łotrzyk, kapłan, barbarzyńca, bard, druid, mnich, paladyn, tropiciel, czarownik, zaklinacz, artificer — każda z ikoną i kolorem) + numeryczny input poziomu (1-20).
3. **Atrybuty** — 6 statystyk (SIŁ/ZRC/KON/INT/MDR/CHA): wybór jednego z 3 gotowych zestawów wartości (presety array statystyk) lub przełącznik "Własne" pozwalający ręcznie wpisać wartości; przy każdej statystyce widoczna wartość i wyliczony modyfikator.
4. **Tło fabularne** — pole tekstowe "Pochodzenie/Background" + pole "Charakter" (alignment, max 8 znaków, np. "PD"/"CN").
5. **Wygląd** — siatka 2 kolumny: wiek, wzrost, waga, oczy, skóra, włosy.
6. **Osobowość** — 4 pola tekstowe (textarea): cechy osobowości, ideały, więzi, wady.

Nawigacja: przyciski Wstecz/Dalej, na ostatnim kroku przycisk "Rozpocznij przygodę" tworzący pełną postać i przechodzący do karty postaci.

## 7. Ekran "Postać" (Character)

Układ: na desktopie 2 kolumny kart, na mobile pojedyncza kolumna kart ułożonych pionowo.

### Karta "Postać" (tożsamość)
- Zwijany nagłówek — po zwinięciu pokazuje imię + klasa/poziom.
- Pole imienia (duża, wyróżniona czcionka).
- Lista klas wieloklasowości: dla każdej klasy — input nazwy + numeryczny poziom (1-20); przycisk dodania kolejnej klasy (max 4); przycisk usunięcia (poza pierwszą klasą).
- Suma poziomów (Σ Level) + pole XP + podpowiedź ile XP do następnego poziomu.
- Siatka 2 kolumny: Rasa / Tło fabularne (Background).
- Pole Charakter (alignment, max 8 znaków).
- Separator "Wygląd".
- Siatka 3 kolumny: wiek / wzrost / waga / oczy / skóra / włosy (6 pól).

### Karta "Rzuty Obronne i Cechy"
- Lista 6 rzutów obronnych (na bazie SIŁ/ZRC/KON/INT/MDR/CHA): checkbox biegłości + wyliczona wartość bonusu (uwzględnia bonus biegłości).
- Lista ok. 18 ogólnych umiejętności (np. Akrobatyka, Percepcja, Perswazja itd.), każda przypisana do konkretnej statystyki: checkbox biegłości (+ ewentualnie poziom eksperta) + wyliczona wartość.

### Karta "Walka" (Combat)
Dwie kolumny:
- **Lewa**: siatka 4 kolumn — Pancerz (AC), Inicjatywa, Szybkość, Bonus Biegłości (każde pole edytowalne, część z możliwością ręcznego nadpisania wyliczonej wartości — wyczyszczenie pola wraca do auto-obliczenia). Rząd PŻ: przyciski −/+ , wartość bieżące/maksymalne PŻ, oddzielne pole Tymczasowe PŻ. Rząd Kości Wytrzymałości: wybór typu kości (k4-k12), licznik użytych/maksymalnych + przyciski "Krótki odpoczynek" (☽) i "Długi odpoczynek" (☀) otwierające modal odpoczynku.
- **Prawa**: siatka 3 kolumn — Percepcja Bierna / Klasa Trudności Zaklęć / Bonus do Trafienia Zaklęciem (każda wartość wyliczana automatycznie, z opcją ręcznego nadpisania). Lista przełączników stanów/kondycji (14 sztuk, np. Otruty, Sparaliżowany, Nieprzytomny itd. — przyciski toggle). Rzuty na śmierć: 3 kółka sukcesu (zielone) + 3 kółka porażki (czerwone), klikalne. Siatka wyczerpania (poziomy 0-6, przyciski w 4 kolumnach).

### Modal odpoczynku
- **Krótki odpoczynek**: wybór typu kości, max liczba kości, licznik wydawanych kości (−/+) z podglądem zakresu odzyskiwanego PŻ (z modyfikatorem KON), przyciski Odpocznij/Anuluj.
- **Długi odpoczynek**: lista efektów z ikonami — ❤️ przywrócenie PŻ do max, 💫 reset zużycia slotów czarów, 🎲 odzyskanie połowy (zaokr. w dół, min. 1) kości wytrzymałości, ☠️ wyczyszczenie rzutów na śmierć, oraz redukcja poziomu wyczerpania o 1.

### Karta "Aktywne i Wyposażone" (Equipped)
- Górny rząd: liczniki monet (złoto/srebro/miedź), każdy z przyciskami −/+ i polem numerycznym.
- Pasek podzakładek: Przedmioty / Zdolności / Czary (z licznikami przy każdej).
- **Przedmioty**: lista wyposażonych przedmiotów z plecaka — uchwyt do przeciągania (zmiana kolejności drag&drop, działa myszką i dotykiem), ikona typu, nazwa, odznaka typu, odznaka ilości, tagi, dodatkowe linie info (kości obrażeń, ładunki, efekt, notatka).
- **Zdolności**: lista aktywnych zdolności (analogiczny układ jak przedmioty).
- **Czary**: widget slotów czarów na górze (osobna kolumna na każdy poziom czaru, który jest faktycznie używany, posortowane 1-9; każda kolumna pokazuje etykietę poziomu, pola "wykorzystane/maksymalne" oraz liczbę znanych czarów na tym poziomie), poniżej lista aktywnych czarów z odznaką poziomu/szkoły i linią czasu rzucania/zasięgu/czasu trwania.

### Karta "Notatki Osobiste"
- Pojedyncze duże pole tekstowe na dowolne notatki gracza.

### Karta "Biegłości i Języki"
- Siatka 2x2: Bronie / Pancerze / Języki / Narzędzia — każda komórka to lista/pole tekstowe biegłości danego typu.

### Karta "Cechy Osobowości"
- 4 bloki tekstowe: Cechy osobowości, Ideały, Więzi, Wady.

### Karta "Historia Postaci" (Backstory)
- Duże pole tekstowe na rozbudowaną historię postaci.

## 8. Ekran "Wyposażenie" (Equipment) — 3 kolumny na desktopie / osobne zakładki na mobile

Wszystkie trzy listy (Plecak, Zdolności, Czary) używają wspólnego wzorca list encji (patrz sekcja 12).

### Plecak (Inventory)
- Formularz dodawania nowego przedmiotu — pola dopasowują się do typu przedmiotu (np. broń: kości obrażeń, typ obrażeń, bonus do trafienia; przedmiot z ładunkami: licznik ładunków).
- Każdy przedmiot na liście: ikona typu, nazwa, typ, ilość, tagi, status "wyposażony"/"w plecaku" (przełącznik), dodatkowe pola w zależności od typu (obrażenia, efekt, notatka).
- Filtrowanie po typie przedmiotu i po tagach.

### Zdolności (Skills/Abilities)
- Kategorie zdolności (np. umiejętność klasowa, cecha rasowa, atut) — każda z ikoną i kolorem.
- Przełącznik aktywna/nieaktywna (czy widoczna na karcie "Aktywne i Wyposażone").
- Poziom mistrzostwa / dodatkowe atrybuty.
- Filtrowanie po tagach.

### Czary (Spells)
- Każdy czar: poziom (0-9) + szkoła magii (z ikoną i kolorem szkoły), czas rzucania, zasięg, czas trwania, opis.
- Przełącznik znany/przygotowany/aktywny.
- Sortowanie wg poziomu i szkoły, filtrowanie po tagach.
- Powiązany widget slotów czarów (patrz wyżej).

## 9. Ekran "Świat" (World) — 3 kolumny na desktopie / osobne zakładki na mobile

### Postacie (NPC)
- Pole relacji z postacią — cyklowane kliknięciem (np. Sojusznik → Neutralny → Wrogi → Nieznany → ...), wizualnie oznaczone kolorem.
- Pola: rola/zawód, przynależność (frakcja), miejsce poznania, powiązania z innymi wpisami.

### Miejsca (Locations)
- Typ lokacji (miasto, loch, świątynia itd.) z ikonami.
- Opis, sugerowane tagi.

### Frakcje (Factions)
- Typ frakcji, ranga gracza we frakcji (cyklowana kliknięciem), przywódca, siedziba, cel/motywacja.

Wszystkie trzy listy: pin (przypinanie na górę), tagi z filtrowaniem, dwustopniowe usuwanie, tryb edycji, zwinięty widok pokazuje nazwę + tagi, rozwinięty pokazuje pełne dane.

## 10. Dziennik (Journal)

### Kronika sesji (Sessions)
- Nagłówek: licznik sesji + przycisk "Nowy wpis".
- Legenda kolorów — pokazuje, jakie typy encji (NPC/lokacje/zadania/przedmioty/zdolności) występują jako linki w tekstach, z podpowiedzią "Kliknij kolorowy link, by otworzyć wpis".
- Każdy wpis sesji: nagłówek z auto-numerem (#NN), edytowalny tytuł, wybór daty, przycisk zwiń/rozwiń.
- Treść wpisu: tryb edycji (textarea + przyciski Usuń/Gotowe) lub tryb podglądu (tekst z automatycznie podlinkowanymi nazwami NPC/lokacji/zadań/przedmiotów/zdolności — kliknięcie linku przenosi do odpowiedniego wpisu; kliknięcie tekstu wchodzi w tryb edycji).

### Zadania (Quests)
- Formularz dodawania: nazwa, opis, nagroda + przycisk "Aktywuj".
- Zadania pogrupowane wg statusu: Aktywne / Ukończone / Nieudane (kolorowe etykiety sekcji).
- Każdy wpis: nazwa, odznaka statusu (kliknięcie cyklicznie zmienia status), opis, nagroda, licznik postępu kroków, przycisk rozwijania, przycisk usuwania.
- Rozwinięty widok: lista kroków-checklisty (checkbox + pole tekstowe + usuwanie), przycisk "+ Dodaj krok", edytowalne pole nagrody.

## 11. Rzutnik kości (Dice Roller)

- Pływający przycisk (FAB) w prawym dolnym rogu ekranu.
- Po otwarciu: panel z nagłówkiem i przyciskiem zamknięcia.
- Rząd szybkich kości: k4, k6, k8, k10, k12, k20, k100.
- Pole wyrażenia (akceptuje notację polską "k" i angielską "d", np. "2k6+3" lub "2d6+3"; 1-20 kości, 2-1000 ścianek) + przycisk Rzuć (animacja "potrząśnięcia" przy błędnym wyrażeniu).
- Duży wynik liczbowy: złota poświata przy naturalnej 20 (krytyk) na k20, czerwona przy naturalnej 1 (fuszerka).
- Linia z rozbiciem rzutu (poszczególne kości + modyfikator).
- Historia ostatnich 6 rzutów jako klikalne "chipsy".

## 12. Wspólny wzorzec list encji (Plecak/Zdolności/Czary/NPC/Miejsca/Frakcje/Zadania)

- Każda pozycja to karta ze zwijanym nagłówkiem (▲/▼); zwinięty stan zapamiętywany.
- Tryb edycji włączany ikoną ołówka (✎) — pokazuje pola edycyjne zamiast statycznego widoku.
- Przypinanie (📌) — przypięte pozycje wypływają na górę listy.
- Tagi: edytor tagów z podpowiedziami (sugestie na bazie wcześniej użytych tagów); kliknięcie tagu na liście filtruje po nim (chip filtra), ponowne kliknięcie usuwa filtr.
- Usuwanie dwustopniowe: pierwsze kliknięcie zmienia przycisk na czerwony "⚠ Usuń?", drugie kliknięcie w ciągu ok. 2,5s usuwa pozycję; brak akcji — przycisk wraca do stanu początkowego.
- Licznik w nagłówku sekcji (np. "X przedmiotów · Y wyposażonych").
- Pusty stan — komunikat zachęcający do dodania pierwszej pozycji.

## 13. Ustawienia (dropdown z ikony ⚙)

- Siatka 2-kolumnowa wyboru motywu kolorystycznego (10 opcji, nazwy własne z emoji).
- Przełącznik języka PL/EN.
- "Zmień bohatera" → powrót do ekranu wyboru profilu.
- "Resetuj postać" (czerwony przycisk, wymaga potwierdzenia w modalu).
- "Synchronizuj dane" (widoczne po zalogowaniu).
- "Wyloguj" z wyświetleniem imienia/e-maila zalogowanego użytkownika.
- Sekcja "Kopia zapasowa": Eksport profilu (pobranie pliku JSON), Import profilu (wczytanie pliku JSON, walidacja z komunikatem błędu).

## 14. Pomoc i onboarding

- **Tutorial** — modal powitalny przy pierwszym uruchomieniu, 4 slajdy wprowadzające w funkcje aplikacji.
- **Panel pomocy kontekstowej** — otwierany przyciskiem "?", treść zależy od aktywnej zakładki (osobne opisy dla: Postać, Wyposażenie, Świat, Sesje, Zadania); każdy opis to wstęp + lista pozycji (ikona + etykieta + krótki opis działania).

## 15. Banery i komunikaty systemowe

- Baner ostrzeżenia o konflikcie synchronizacji (gdy dane lokalne i chmurowe się rozjechały).
- Baner błędu synchronizacji.
- Baner ostrzeżenia o przekroczeniu limitu (quota) przechowywania.
- Granica błędu (error boundary) z czytelnym ekranem "coś poszło nie tak" zamiast białego ekranu.

## 16. Responsywność — podsumowanie

- **Mobile**: pojedyncza kolumna, dolna nawigacja z grupami i wysuwanymi szufladami, header z marką i ustawieniami.
- **Desktop**: stały sidebar nawigacyjny, "wirtualne" widoki wielokolumnowe (Wyposażenie = 3 kolumny, Świat = 3 kolumny), karta postaci w układzie 2-kolumnowym.

## 17. Model danych (skrót, do zaprojektowania formularzy)

Postać zawiera m.in.: imię, listę klas z poziomami, 6 statystyk (SIŁ/ZRC/KON/INT/MDR/CHA), bonus biegłości, PŻ (bieżące/max/tymczasowe), AC, bonus inicjatywy + nadpisania, rzuty obronne i umiejętności (biegłość/ekspert), charakter, tło, rasa, cechy osobowości (4 pola), notatki osobiste, historia, sloty czarów, zdolność rzucania czarów, kości wytrzymałości (typ/max/użyte), XP, prędkość, monety (złoto/srebro/miedź), wygląd (wiek/wzrost/waga/oczy/skóra/włosy), kondycje, biegłości (bronie/pancerze/języki/narzędzia), rzuty na śmierć (sukcesy/porażki). Dodatkowo osobne kolekcje: ekwipunek, zdolności, czary, NPC, miejsca, frakcje, sesje (dziennik), zadania (z krokami).

---

*Powyższy opis pomija system "uniwersalny" (w budowie) — dotyczy w pełni zaimplementowanego systemu D&D 5e, który stanowi domyślne i główne doświadczenie aplikacji.*
