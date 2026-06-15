/* Etykieta klasy/poziomu bohatera — używana w trwałym nagłówku (Header/Sidebar). */
export function getClassLevelLabel(char, C) {
  const totalLevel = Math.min(Math.max((char.classes || []).reduce((s, c) => s + (c.level || 1), 0), 1), 20);
  const className = (char.classes || []).map(c => c.name?.trim()).filter(Boolean).join(" / ") || C.title;
  return { className, totalLevel };
}
