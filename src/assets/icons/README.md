# Ikony aplikacji (P30)

`game-icons/` — ikony tematyczne z zestawu **Game Icons** (https://game-icons.net),
autorzy: Lorc, Delapouite i inni, licencja **CC BY 3.0**
(https://creativecommons.org/licenses/by/3.0/). Podpis autorów jest w menu Ustawień.

## Jak podmienić ikonę

Nazwa pliku = nazwa ikony w aplikacji (`<Icon name="backpack"/>` → `backpack.svg`).
Wystarczy zastąpić plik innym SVG o tej samej nazwie:

- kolor nie ma znaczenia — aplikacja koloruje ikony wg motywu (`currentColor`);
- obsługiwane kształty: `path`, `circle`, `rect`, `ellipse`, `polygon`, `polyline`, `line`;
- kształt z `fill="none"` jest rysowany obrysem (dla ikon liniowych).

Nowa nazwa pliku od razu staje się dostępna jako `<Icon name="…"/>`.
Ikony sterujące (zamknij, strzałki, plus/minus, edycja, pinezka, ostrzeżenie,
wyszukiwanie, filtry, ustawienia, pomoc) pochodzą z lucide-react — patrz
`src/shared/icons.jsx`. Plik SVG o tej samej nazwie ma pierwszeństwo.

Lista: zobacz `IKONY.md` w katalogu głównym.
