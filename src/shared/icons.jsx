/* Centralny rejestr ikon — wspólny komponent <Icon name="..."/>.
   P30: ikony tematyczne (nawigacja, typy przedmiotów, szkoły magii, relacje,
   lokacje, klasy, stany…) pochodzą z zestawu Game Icons (game-icons.net,
   CC BY 3.0) — pliki SVG w src/assets/icons/game-icons/ (nazwa pliku = nazwa
   ikony). Drobne ikony sterujące (zamknij, strzałki, plus/minus, edycja,
   pinezka, ostrzeżenie, wyszukiwanie) zostają liniowe z lucide-react, bo są
   czytelniejsze w małym rozmiarze. Plik SVG ma pierwszeństwo przed lucide.
   ICON_COLORS — domyślna kolorystyka ikon tematycznych. */
import { SVG_ICONS } from './svgIcons';
import {
  X, Check, Pencil, Pin, AlertTriangle, Settings,
  ChevronUp, ChevronDown, ChevronRight, ChevronsUpDown,
  Plus, Minus, GripVertical, ArrowRight, ArrowLeft,
  Globe, LogOut, RefreshCw, Cloud, Beer, Download, Upload,
  User, Users, Dices, Moon, MoonStar, Sun, Sunrise,
  Heart, Sparkles, Sparkle, Skull, Star, Lightbulb,
  CornerDownRight, Circle, Diamond, ToggleLeft,
  Target, Dna, Shield, Eye, Flame, Drama, RotateCw,
  Handshake, Scale, Swords, Sword, HelpCircle, Medal, Crown,
  Home, DoorOpen, Trees, Landmark, Castle, Gem,
  Package, Shirt, ScrollText, FlaskConical, Wrench, Coins,
  Backpack, Wand2, Map, Flag, BookOpen, Book, Zap,
  Axe, Music, Cross, Leaf, Hand, Crosshair, Footprints,
  CircleEllipsis, TreeDeciduous, Bone, Sprout, Orbit, KeyRound, Flower2,
  Search, SlidersHorizontal, Trash2,
} from 'lucide-react';

export const ICONS = {
  // ── Sterowanie UI ──
  close: X, check: Check, edit: Pencil, pin: Pin, warning: AlertTriangle,
  settings: Settings,
  "chevron-up": ChevronUp, "chevron-down": ChevronDown, "chevron-right": ChevronRight,
  "chevrons-updown": ChevronsUpDown,
  plus: Plus, minus: Minus, grip: GripVertical,
  "arrow-right": ArrowRight, "arrow-left": ArrowLeft,
  globe: Globe, logout: LogOut, sync: RefreshCw, cloud: Cloud, beer: Beer,
  download: Download, upload: Upload, user: User, users: Users, dice: Dices,
  search: Search, filters: SlidersHorizontal, trash: Trash2,

  // ── Odpoczynek / walka ──
  moon: Moon, "moon-star": MoonStar, sun: Sun, sunrise: Sunrise,
  heart: Heart, sparkles: Sparkles, sparkle: Sparkle, skull: Skull,
  star: Star, lightbulb: Lightbulb, "corner-down-right": CornerDownRight,
  circle: Circle, diamond: Diamond, toggle: ToggleLeft,

  // ── Statystyki / kategorie zdolności / szkoły magii ──
  target: Target, dna: Dna, shield: Shield, eye: Eye, flame: Flame,
  drama: Drama, "rotate-cw": RotateCw,

  // ── NPC / frakcje ──
  handshake: Handshake, scale: Scale, swords: Swords, sword: Sword,
  "help-circle": HelpCircle, medal: Medal, crown: Crown,

  // ── Lokacje ──
  home: Home, "door-open": DoorOpen, trees: Trees, landmark: Landmark,
  castle: Castle, gem: Gem,

  // ── Ekwipunek ──
  package: Package, shirt: Shirt, scroll: ScrollText, flask: FlaskConical,
  wrench: Wrench, coins: Coins,

  // ── Nawigacja ──
  backpack: Backpack, wand: Wand2, map: Map, flag: Flag,
  "book-open": BookOpen, book: Book, zap: Zap,

  // ── Klasy postaci ──
  axe: Axe, music: Music, cross: Cross, leaf: Leaf, hand: Hand,
  crosshair: Crosshair, footprints: Footprints, "circle-ellipsis": CircleEllipsis,

  // ── Motywy kolorystyczne ──
  "tree-deciduous": TreeDeciduous, bone: Bone, sprout: Sprout, orbit: Orbit,
  "key-round": KeyRound, flower: Flower2,
};

/* Mapa motyw → ikona (dla SettingsMenu) */
export const PALETTE_ICONS = {
  arcane: "sparkle", pergamin: "scroll", dawn: "sun", wschod: "sunrise",
  drewno: "tree-deciduous", bone: "bone",
  feywild: "sprout", eldritch: "orbit", dungeon: "key-round",
  shadowfell: "moon-star", wrath: "flame", meadow: "flower",
};

/* Domyślne kolory dla ikon tematycznych — reszta dziedziczy currentColor */
export const ICON_COLORS = {
  // Odpoczynek
  heart:        "#c0584f",
  "moon-star":  "#7a8ac9",
  sun:          "#e2b94e",
  skull:        "#9a9aa6",

  // Relacje NPC / rangi frakcji
  handshake:  "#74a874",
  scale:      "#a08a4e",
  "help-circle":"#8a7a6a",
  unknown:    "#8a7a6a",
  dead:       "#8a8a96",

  // Statystyki / kategorie zdolności
  target: "#c9a84c",
  dna:    "#6a9ad0",
  star:   "#e2b94e",

  // Szkoły magii
  flame:     "#c9603e",
  drama:     "#9a6ad0",
  "rotate-cw":"#4aaa8a",
  sparkles:  "#c96a9a",
  eye:       "#4aa0aa",
  shield:    "#6a9ad0",

  // Frakcje — ranga
  medal: "#c9a84c",
  crown: "#e2b94e",

  // Lokacje
  home:        "#c9943e",
  "door-open": "#9a9aa8",
  trees:       "#74a874",
  landmark:    "#6a9ad0",
  castle:      "#b8946a",
  gem:         "#9a7ad0",

  // Ekwipunek
  package: "#9a9aa6",
  sword:   "#c8645c",
  shirt:   "#7fa2c6",
  scroll:  "#c9a84c",
  flask:   "#6cb47c",
  wrench:  "#c49c62",

  // Monety
  coins: "#e2b94e",

  // Klasy postaci
  axe:        "#c9603e",
  music:      "#c96a9a",
  cross:      "#e2b94e",
  leaf:       "#74a874",
  hand:       "#4aa0aa",
  crosshair:  "#6cb47c",
  footprints: "#9a9aa8",
  "circle-ellipsis": "#9a9aa6",

  // Motywy
  sunrise:          "#e08a4e",
  "tree-deciduous": "#9a7a4e",
  bone:             "#c9c0a8",
  sprout:           "#9a6ad0",
  orbit:            "#9a7ad0",
  "key-round":      "#8a8a96",
  flower:           "#c9a84c",

  // Ranga "leader" (👑) i logo marki
  swords: "#c9943e",
  beer:   "#c9a84c",
};

/* Czy dana nazwa jest ikoną (plik SVG albo lucide) — np. w panelu pomocy */
export const hasIcon = name => !!(SVG_ICONS[name] || ICONS[name]);

/* Ikony z plików rysujemy z niewielkim marginesem, bo sylwetki Game Icons
   wypełniają całe pole 512×512 — bez tego wyglądałyby na większe i cięższe
   od liniowych ikon sterujących obok. */
const PAD = 0.08;
function paddedViewBox(vb) {
  const [x, y, w, h] = vb.split(/[\s,]+/).map(Number);
  const px = w * PAD, py = h * PAD;
  return `${x - px} ${y - py} ${w + 2 * px} ${h + 2 * py}`;
}

/* <Icon name="sword" size="1em" color="#fff" /> — domyślnie dziedziczy
   kolor tekstu (currentColor), o ile dana ikona nie ma wpisu w ICON_COLORS. */
export default function Icon({ name, size = "1em", color, strokeWidth = 1.75, fill = "none", className, style }) {
  const resolvedColor = color || ICON_COLORS[name] || "currentColor";
  const file = SVG_ICONS[name];
  if (file) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={paddedViewBox(file.viewBox)}
        width={size} height={size} className={className} aria-hidden="true"
        style={{ verticalAlign: "-0.15em", flexShrink: 0, color: resolvedColor, ...style }}>
        {file.shapes.map(({ tag: Tag, props, outline }, i) => (
          <Tag key={i} {...props}
            fill={outline ? "none" : "currentColor"}
            stroke={outline ? "currentColor" : undefined}/>
        ))}
      </svg>
    );
  }
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      color={resolvedColor}
      fill={fill}
      className={className}
      style={{ verticalAlign: "-0.15em", flexShrink: 0, ...style }}
      aria-hidden="true"
    />
  );
}
