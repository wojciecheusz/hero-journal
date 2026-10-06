import { XP_THRESHOLDS } from '../constants/gameConstants';
import { clamp } from './math';

/* Łączny poziom postaci = suma poziomów wszystkich klas (multiclassing), 1–20. */
export function totalLevelOf(char) {
  const sum = (char.classes || []).reduce((s, c) => s + (parseInt(c.level) || 1), 0);
  return clamp(sum || 1, 1, 20);
}

/* Etykieta klasy/poziomu bohatera — używana w trwałym nagłówku (Header/Sidebar). */
export function getClassLevelLabel(char, C) {
  const totalLevel = totalLevelOf(char);
  const className = (char.classes || []).map(c => c.name?.trim()).filter(Boolean).join(" / ") || C.title;
  return { className, totalLevel };
}

export const abilityMod = score => Math.floor(((parseInt(score) || 10) - 10) / 2);

/* Premia z biegłości D&D 5e: +2 (poz. 1–4), +3 (5–8), +4 (9–12), +5 (13–16), +6 (17–20). */
export const profBonusForLevel = level => 2 + Math.floor((clamp(level, 1, 20) - 1) / 4);

/* Średni wynik kości wytrzymałości przy awansie (zasada 5e: połowa kości + 1). */
export function hitDieAverage(type = "d8") {
  const faces = parseInt(String(type).replace(/\D/g, "")) || 8;
  return Math.floor(faces / 2) + 1;
}

/* Postęp XP w obrębie aktualnego poziomu.
   - level: aktualny poziom (z klas — źródło prawdy),
   - xpFloor/xpNext: próg bieżącego i następnego poziomu,
   - pct: postęp 0–100 w obrębie poziomu,
   - canLevelUp: XP wystarcza na awans (aplikacja pokazuje wtedy przycisk). */
export function xpProgress(char) {
  const level   = totalLevelOf(char);
  const xp      = Math.max(0, parseInt(char.xp) || 0);
  const xpFloor = XP_THRESHOLDS[level - 1] ?? 0;
  const xpNext  = level < 20 ? XP_THRESHOLDS[level] : null;
  const pct     = xpNext == null ? 100
    : clamp(((xp - xpFloor) / Math.max(1, xpNext - xpFloor)) * 100, 0, 100);
  return { level, xp, xpFloor, xpNext, pct, canLevelUp: xpNext != null && xp >= xpNext };
}

/* Obrażenia najpierw zdejmują tymczasowe PŻ, potem zwykłe (zasada 5e). */
export function applyDamage(hp, amount) {
  const dmg  = Math.max(0, parseInt(amount) || 0);
  const temp = Math.max(0, parseInt(hp.temp) || 0);
  const fromTemp = Math.min(temp, dmg);
  const current  = Math.max(0, (parseInt(hp.current) || 0) - (dmg - fromTemp));
  return { ...hp, temp: temp - fromTemp, current };
}

export function applyHeal(hp, amount) {
  const heal = Math.max(0, parseInt(amount) || 0);
  const max  = Math.max(1, parseInt(hp.max) || 1);
  return { ...hp, current: clamp((parseInt(hp.current) || 0) + heal, 0, max) };
}

/* Tymczasowe PŻ się nie kumulują — zostaje wyższa wartość (5e). */
export function applyTempHp(hp, amount) {
  const t = Math.max(0, parseInt(amount) || 0);
  return { ...hp, temp: Math.max(Math.max(0, parseInt(hp.temp) || 0), t) };
}

/* Awans o jeden poziom w wybranej klasie. Aktualizuje:
   poziom klasy, maks. i bieżące PŻ (+hpGain), liczbę kości wytrzymałości
   (= łączny poziom) i premię z biegłości (wg tabeli 5e). */
export function levelUp(char, { classIndex = 0, hpGain = 0 } = {}) {
  const classes = (char.classes?.length ? char.classes : [{ name: "", level: 1 }]).map(c => ({ ...c }));
  const i = clamp(classIndex, 0, classes.length - 1);
  if (totalLevelOf({ classes }) >= 20) return char;
  classes[i].level = clamp((parseInt(classes[i].level) || 1) + 1, 1, 20);
  const newLevel = totalLevelOf({ classes });
  const gain = Math.max(0, parseInt(hpGain) || 0);
  const hp = char.hp || { current: 0, max: 1, temp: 0 };
  const hd = char.hitDice || { type: "d8", max: 1, used: 0 };
  return {
    ...char,
    classes,
    hp: { ...hp, max: (parseInt(hp.max) || 0) + gain, current: (parseInt(hp.current) || 0) + gain },
    hitDice: { ...hd, max: newLevel, used: clamp(hd.used || 0, 0, newLevel) },
    profBonus: profBonusForLevel(newLevel),
  };
}
