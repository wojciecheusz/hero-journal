import { ITEM_TYPE } from '../constants/enums.js';

/* Użycia i ładunki przedmiotów (P29/C2).
   - Przedmiot jednorazowy (typ „consumable"): liczba pozostałych użyć = ilość
     sztuk; użycie zmniejsza ilość.
   - Przedmiot z ładunkami: item.uses = { max, used, recharge }, gdzie
     recharge ∈ "none" | "short" | "long" | "dawn". Krótki odpoczynek odnawia
     "short", długi — "short", "long" i "dawn" (świt mija w trakcie nocy). */

export const RECHARGE = ["none", "short", "long", "dawn"];

export const isConsumable = item => item?.type === ITEM_TYPE.CONSUMABLE;

export function hasCharges(item) {
  return (parseInt(item?.uses?.max) || 0) > 0;
}

export function chargesLeft(item) {
  const max = Math.max(0, parseInt(item?.uses?.max) || 0);
  const used = Math.min(max, Math.max(0, parseInt(item?.uses?.used) || 0));
  return max - used;
}

export const qtyOf = item => Math.max(0, parseInt(item?.qty) || 0);

/* Zużywa jedno użycie: ładunek, a gdy przedmiot ich nie ma — jedną sztukę
   przedmiotu jednorazowego. Zwraca niezmieniony obiekt, gdy nic nie zostało. */
export function consumeOnce(item) {
  if (hasCharges(item)) {
    if (chargesLeft(item) <= 0) return item;
    return { ...item, uses: { ...item.uses, used: (parseInt(item.uses.used) || 0) + 1 } };
  }
  if (isConsumable(item)) {
    const q = qtyOf(item);
    if (q <= 0) return item;
    return { ...item, qty: String(q - 1) };
  }
  return item;
}

/* Ustawia liczbę zużytych ładunków (dotknięcie kropki). */
export function setChargesUsed(item, used) {
  if (!hasCharges(item)) return item;
  const max = parseInt(item.uses.max) || 0;
  return { ...item, uses: { ...item.uses, used: Math.min(max, Math.max(0, used)) } };
}

/* Odnowienie ładunków po odpoczynku dla całego ekwipunku. */
export function restoreCharges(inventory, restType) {
  const kinds = restType === "short" ? ["short"] : ["short", "long", "dawn"];
  let changed = false;
  const next = (inventory || []).map(item => {
    if (!hasCharges(item) || !kinds.includes(item.uses.recharge) || !(parseInt(item.uses.used) > 0)) return item;
    changed = true;
    return { ...item, uses: { ...item.uses, used: 0 } };
  });
  return changed ? next : inventory;
}

/* Ile przedmiotów odnowi dany odpoczynek — do podsumowania w oknie odpoczynku. */
export function countRestorable(inventory, restType) {
  const kinds = restType === "short" ? ["short"] : ["short", "long", "dawn"];
  return (inventory || []).filter(i => hasCharges(i) && kinds.includes(i.uses.recharge) && parseInt(i.uses.used) > 0).length;
}

/* Najważniejsza informacja o przedmiocie w jednej linii — ta sama w liście
   i w karcie „Walka i wyposażenie" (P29/C1). T: tłumaczenia. */
export function itemKeyStat(item, T, damageTypes) {
  const isWeapon = item.type === ITEM_TYPE.WEAPON;
  const isArmor  = item.type === ITEM_TYPE.ARMOR || item.type === ITEM_TYPE.SHIELD;
  if (isWeapon && item.damage) {
    const dt  = item.damageType ? (T.DAMAGE_TYPES?.[damageTypes.indexOf(item.damageType)] ?? item.damageType) : "";
    const mod = item.modifier !== undefined && item.modifier !== "" ? parseInt(item.modifier) || 0 : null;
    return [item.damage, dt, mod != null && `${T.INVENTORY.hitBonus} ${mod >= 0 ? "+" : ""}${mod}`].filter(Boolean).join(" · ");
  }
  if (item.effect) return item.effect;
  if (isArmor && item.note && item.note.length <= 30) return item.note;
  return null;
}
