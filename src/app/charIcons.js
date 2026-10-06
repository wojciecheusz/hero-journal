import { DND_CLASSES } from '../constants/gameConstants';

/* Ikony do wyboru dla bohatera + domyślna ikona z klasy.
   Osobny plik (nie komponent), żeby Fast Refresh działał dla CharIconPicker. */
export const ICON_CHOICES = [...new Set(DND_CLASSES.map(c => c.icon))];

export function getCharIcon(char) {
  const classIcon = DND_CLASSES.find(c => c.name === char.classes?.[0]?.name)?.icon || "sword";
  return char.icon || classIcon;
}
