/* Lekki parser markdownu dla opisów wpisów (P29/C3). Zwraca strukturę
   bloków, którą RichText zamienia na elementy React — bez innerHTML, więc
   treść użytkownika nie może wstrzyknąć kodu.

   Obsługa: nagłówki (#–######), akapity, listy (- * •, 1.), cytaty (>),
   linie poziome (---), **pogrubienie**, *kursywa*, ***oba***.

   Notatki importowane z innych narzędzi często mają zgubione znaki nowej
   linii (bloki sklejone podwójną spacją: "…tekst  ## Nagłówek  **Pole**…").
   Jeśli tekst nie ma żadnego \n, odtwarzamy podziały przed znacznikami bloków. */

export function restoreFlattened(text) {
  if (!text || text.includes("\n")) return text || "";
  return text
    .replace(/\s{2,}(?=#{1,6}\s)/g, "\n")
    .replace(/\s{2,}(?=-{3,})/g, "\n")
    .replace(/(-{3,})\s{2,}/g, "$1\n")
    .replace(/\s{2,}(?=>\s?)/g, "\n")
    .replace(/(\S)>\s(?=\S)/g, "$1\n> ")
    .replace(/\s{2,}(?=[-*•]\s)/g, "\n")
    .replace(/\s{2,}(?=\d+\.\s)/g, "\n")
    .replace(/\s{2,}(?=\*\*)/g, "\n")
    // Nagłówek kończy się na pierwszej podwójnej spacji („## Cena  Po godzinie…")
    .replace(/(^|\n)(#{1,6}\s[^\n]*?)\s{2,}(?=\S)/g, "$1$2\n");
}

/* Fragmenty w linii: [{ t: "tekst", b?: true, i?: true }] */
export function parseInline(line) {
  const out = [];
  const re = /(\*\*\*([^*]+?)\*\*\*|\*\*([^*]+?)\*\*|\*([^*\s][^*]*?)\*)/g;
  let last = 0, m;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push({ t: line.slice(last, m.index) });
    if (m[2] != null) out.push({ t: m[2], b: true, i: true });
    else if (m[3] != null) out.push({ t: m[3], b: true });
    else out.push({ t: m[4], i: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ t: line.slice(last) });
  // Osierocone gwiazdki (np. "**" bez pary) — usuwamy, żeby nie straszyły
  return out.map(p => ({ ...p, t: p.t.replace(/\*{2,}/g, "") })).filter(p => p.t !== "");
}

export function parseMarkdown(text) {
  const lines = restoreFlattened(String(text ?? "")).split(/\r?\n/);
  const blocks = [];
  let para = [], list = null, quote = [];

  const flushPara  = () => { if (para.length) { blocks.push({ type: "p", lines: para.map(parseInline) }); para = []; } };
  const flushList  = () => { if (list) { blocks.push(list); list = null; } };
  const flushQuote = () => { if (quote.length) { blocks.push({ type: "quote", lines: quote.map(parseInline) }); quote = []; } };
  const flushAll   = () => { flushPara(); flushList(); flushQuote(); };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushAll(); continue; }
    let m;
    if (/^-{3,}$|^\*{3,}$|^_{3,}$/.test(line)) { flushAll(); blocks.push({ type: "hr" }); continue; }
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) { flushAll(); blocks.push({ type: "h", level: m[1].length, content: parseInline(m[2]) }); continue; }
    if ((m = line.match(/^>\s?(.*)$/))) { flushPara(); flushList(); quote.push(m[1]); continue; }
    if ((m = line.match(/^[-*•]\s+(.*)$/))) {
      flushPara(); flushQuote();
      if (!list || list.ordered) { flushList(); list = { type: "list", ordered: false, items: [] }; }
      list.items.push(parseInline(m[1])); continue;
    }
    if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
      flushPara(); flushQuote();
      if (!list || !list.ordered) { flushList(); list = { type: "list", ordered: true, items: [] }; }
      list.items.push(parseInline(m[1])); continue;
    }
    flushList(); flushQuote();
    para.push(line);
  }
  flushAll();
  return blocks;
}

/* Zwykły tekst bez znaczników — do podglądu w zwiniętej karcie i wyszukiwania. */
export function plainText(text) {
  return parseMarkdown(text).map(b => {
    if (b.type === "hr") return "";
    if (b.type === "h") return b.content.map(p => p.t).join("");
    if (b.type === "list") return b.items.map(it => it.map(p => p.t).join("")).join(" · ");
    return b.lines.map(l => l.map(p => p.t).join("")).join(" ");
  }).filter(Boolean).join(" — ");
}
