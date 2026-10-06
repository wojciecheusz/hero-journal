/* Wyszukiwanie w listach (P29/A4): bez rozróżniania wielkości liter i polskich
   znaków diakrytycznych ("zbroja" znajdzie "Zbroję", "lodz" — "Łódź"). */
export const normalize = s => String(s ?? "")
  .toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/ł/g, "l");

export function matchesSearch(query, fields) {
  const q = normalize(query).trim();
  if (!q) return true;
  const hay = normalize(fields.filter(Boolean).join(" "));
  return q.split(/\s+/).every(word => hay.includes(word));
}
