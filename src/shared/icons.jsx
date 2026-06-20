/* Centralny rejestr ikon SVG (lucide-react) — zastępuje emoji w całej aplikacji.
   Wspólny komponent <Icon name="..."/> gwarantuje spójną grubość linii i rozmiar;
   ICON_COLORS dostarcza domyślną kolorystykę dla ikon tematycznych (żeby nie
   wszystko było jednolicie czarne/monochromatyczne). */
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
  handshake:  "#5a8a5a",
  scale:      "#a08a4e",
  "help-circle":"#8a7a6a",

  // Statystyki / kategorie zdolności
  target: "#c9a84c",
  dna:    "#4a7aaa",
  star:   "#e2b94e",

  // Szkoły magii
  flame:     "#c9603e",
  drama:     "#9a6ad0",
  "rotate-cw":"#4aaa8a",
  sparkles:  "#c96a9a",
  eye:       "#4aa0aa",
  shield:    "#4a7aaa",

  // Frakcje — ranga
  medal: "#c9a84c",
  crown: "#e2b94e",

  // Lokacje
  home:        "#c9943e",
  "door-open": "#7a7a86",
  trees:       "#5a8a5a",
  landmark:    "#4a7aaa",
  castle:      "#9a7a5a",
  gem:         "#7a5aaa",

  // Ekwipunek
  package: "#9a9aa6",
  sword:   "#9a4a4a",
  shirt:   "#5a7a9a",
  scroll:  "#c9a84c",
  flask:   "#5a9a6a",
  wrench:  "#a08050",

  // Monety
  coins: "#e2b94e",

  // Klasy postaci
  axe:        "#c9603e",
  music:      "#c96a9a",
  cross:      "#e2b94e",
  leaf:       "#5a8a5a",
  hand:       "#4aa0aa",
  crosshair:  "#5a9a6a",
  footprints: "#7a7a86",
  "circle-ellipsis": "#9a9aa6",

  // Motywy
  sunrise:          "#e08a4e",
  "tree-deciduous": "#9a7a4e",
  bone:             "#c9c0a8",
  sprout:           "#9a6ad0",
  orbit:            "#7a5aaa",
  "key-round":      "#8a8a96",
  flower:           "#c9a84c",

  // Ranga "leader" (👑) i logo marki
  swords: "#c9943e",
  beer:   "#c9a84c",
};

/* <Icon name="sword" size="1em" color="#fff" /> — domyślnie dziedziczy
   kolor tekstu (currentColor) o ile dana ikona nie ma wpisu w ICON_COLORS. */
export default function Icon({ name, size = "1em", color, strokeWidth = 1.75, fill = "none", className, style }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  const resolvedColor = color || ICON_COLORS[name] || "currentColor";
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
