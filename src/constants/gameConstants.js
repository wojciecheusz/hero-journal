/* ═══ STAŁE PROJEKTOWE ══════════════════════════ */
const today   = () => new Date().toISOString().slice(0,10);
const statMod = v  => { const m=Math.floor((v-10)/2); return m>=0?`+${m}`:String(m); };
const numMod  = v  => v>=0?`+${v}`:String(v);
const clamp   = (n,lo,hi) => Math.max(lo,Math.min(hi,n));

const STAT_KEYS    = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
const STATUS_CYCLE = { "Aktywne": "Ukończone", "Ukończone": "Nieudane", "Nieudane": "Aktywne" };
const REL_CYCLE    = { unknown: "ally", ally: "neutral", neutral: "hostile", hostile: "unknown" };
const REL_LABELS   = { ally: "Sprzymierzeniec", neutral: "Neutralny", hostile: "Wrogi", unknown: "Nieznany" };
const LOC_TYPES    = ["Osada", "Podziemia", "Dzicz", "Budynek", "Ruiny", "Punkt Orientacyjny", "Inne"];
const FACTION_TYPES = ["Gildia", "Zakon", "Kult", "Rząd", "Armia", "Przestępcy", "Kupcy", "Religijna", "Polityczna", "Inna"];
const FACTION_RANKS = ["Nieznany", "Sojusznik", "Neutralny", "Wróg", "Członek", "Oficer", "Przywódca"];
const FACTION_RANK_COLORS = {
  "Nieznany": "#6a5a38", "Sojusznik": "#5a8a5a", "Neutralny": "#8a7840",
  "Wróg": "#8a3a3a", "Członek": "#4a7aaa", "Oficer": "#c9a84c", "Przywódca": "#e2b94e"
};
const ALIGNMENTS   = ["Praworządny dobry", "Neutralny dobry", "Chaotyczny dobry", "Praworządny neutralny", "Bezwzględnie neutralny", "Chaotyczny neutralny", "Praworządny zły", "Neutralny zły", "Chaotyczny zły"];
const ITEM_TYPES   = ["Ogólny", "Broń", "Pancerz", "Zwój z czarem", "Cudowny przedmiot", "Jednorazowy", "Narzędzie", "Inny"];
const ITEM_ICONS   = { "Ogólny": "📦", "Broń": "⚔️", "Pancerz": "🛡️", "Zwój z czarem": "📜", "Cudowny przedmiot": "✨", "Jednorazowy": "🧪", "Narzędzie": "🔧", "Inny": "◈" };
const SKILL_CATS   = ["Umiejętność", "Cecha rasowa", "Atut"];
const SPELL_SCHOOLS = ["Odrzucanie", "Przywoływanie", "Wieszczenie", "Surogacja", "Wywoływanie", "Iluzja", "Nekromancja", "Przemiana", "Inna"];
const SPELL_LEVELS = ["Sztuczka", "1. poziom", "2. poziom", "3. poziom", "4. poziom", "5. poziom", "6. poziom", "7. poziom", "8. poziom", "9. poziom"];
const SPELL_SLOT_LABELS = ["1. poziom", "2. poziom", "3. poziom", "4. poziom", "5. poziom", "6. poziom", "7. poziom", "8. poziom", "9. poziom"];

const SAVING_THROWS = [
  {key:"str", label:"Siła",         attr:"STR"},
  {key:"dex", label:"Zręczność",     attr:"DEX"},
  {key:"con", label:"Budowa",        attr:"CON"},
  {key:"int", label:"Intelekt",      attr:"INT"},
  {key:"wis", label:"Mądrość",       attr:"WIS"},
  {key:"cha", label:"Charyzma",      attr:"CHA"},
];
const GENERIC_SKILLS = [
  {key:"acrobatics",    label:"Akrobatyka",       attr:"DEX"},
  {key:"athletics",     label:"Atletyka",         attr:"STR"},
  {key:"arcana",        label:"Wiedza tajemna",   attr:"INT"},
  {key:"deception",     label:"Oszustwo",         attr:"CHA"},
  {key:"history",       label:"Historia",         attr:"INT"},
  {key:"insight",       label:"Intuicja",         attr:"WIS"},
  {key:"intimidation",  label:"Zastraszanie",     attr:"CHA"},
  {key:"investigation", label:"Śledztwo",         attr:"INT"},
  {key:"medicine",      label:"Medycyna",         attr:"WIS"},
  {key:"nature",        label:"Przyroda",         attr:"INT"},
  {key:"perception",    label:"Percepcja",        attr:"WIS"},
  {key:"performance",   label:"Występy",          attr:"CHA"},
  {key:"persuasion",    label:"Perswazja",        attr:"CHA"},
  {key:"religion",      label:"Religia",          attr:"INT"},
  {key:"sleightzhand",  label:"Zwinne dłonie",    attr:"DEX"},
  {key:"stealth",       label:"Skradanie",        attr:"DEX"},
  {key:"survival",      label:"Sztuka przetrwania", attr:"WIS"},
  {key:"animalhandling",label:"Opieka nad zwierzętami", attr:"WIS"},
];

const DEFAULT_CHAR = {
  name: "", classes: [{name: "Poszukiwacz przygód", level: 1}],
  stats: {STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10},
  profBonus: 2, hp: {current: 10, max: 10, temp: 0}, ac: 10,
  initiativeBonus: undefined,
  savingThrows: {}, savingThrowExp: {}, savingThrowOverride: {},
  skills: {}, skillExp: {},
  alignment: "Bezwzględnie neutralny", background: "",
  traits: {personality: "", ideals: "", bonds: "", flaws: ""},
  personalNotes: "", backstory: "",
  spellSlots: {}, spellcastingAbility: "INT",
  hitDice: { type: "d8", max: 1, used: 0 },
  deathSaves: { successes: 0, failures: 0 },
};

const load = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const CHAR_SLOTS = ["char", "inventory", "npcs", "locations", "skills", "spells", "sessions", "quests", "factions"];

const charKey = (slot, id) => `hj_${slot}_${id}`;
const loadChar = (slot, id, fb) => load(charKey(slot, id), fb);
const saveChar = (slot, id, val) => save(charKey(slot, id), val);
const deleteCharData = id => CHAR_SLOTS.forEach(s => localStorage.removeItem(charKey(s, id)));

const loadProfiles = () => load("hj_profiles", []);
const saveProfiles = p => save("hj_profiles", p);
const loadActiveId = () => load("hj_active_profile", null);
const saveActiveId = id => save("hj_active_profile", id);

const migrateLegacy = () => {
  if (loadProfiles().length > 0) return;
  const legacyChar = load("hj_char", null);
  if (!legacyChar) return;
  const id = "profile_" + Date.now();
  const name = legacyChar.name?.trim() || "Mój Bohater";
  CHAR_SLOTS.forEach(slot => {
    const val = load("hj_" + slot, null);
    if (val !== null) saveChar(slot, id, val);
  });
  saveProfiles([{ id, name, class: (legacyChar.classes || [{name: ""}])[0]?.name || "", level: (legacyChar.classes || [{level: 1}])[0]?.level || 1, created: Date.now() }]);
  saveActiveId(id);
};

const hpBarColor = pct => pct > 70 ? "linear-gradient(90deg,#1a5a1a,#2a8a2a,#33aa33)" : pct > 35 ? "linear-gradient(90deg,#7a4a10,#cc7020,#e08030)" : "linear-gradient(90deg,#3a0a0a,#6b0f0f,#961a1a)";
const hpNumColor = pct => pct > 70 ? "#3a9a3a" : pct > 35 ? "#c06010" : "#c03030";

const LEGEND_ITEMS = [
  {type: "npc",       color: "rgba(201,148,62,0.35)", border: "rgba(201,148,62,0.7)",  label: "Postacie"},
  {type: "location",  color: "rgba(74,138,170,0.35)", border: "rgba(74,138,170,0.7)",  label: "Miejsca"},
  {type: "quest",     color: "rgba(170,68,68,0.35)",  border: "rgba(170,68,68,0.7)",   label: "Zadania"},
  {type: "inventory", color: "rgba(58,138,90,0.35)",  border: "rgba(58,138,90,0.7)",   label: "Plecak"},
  {type: "skill",     color: "rgba(122,90,170,0.35)", border: "rgba(122,90,170,0.7)",  label: "Zdolności"},
];

/* ═══ INTERAKTYWNY PARSER LINKÓW W NOTATKACH ═════ */
function parseEntityLinksWithTooltips(text, npcs, locations, quests, inventory, skills, onNavigate) {
  if (!text) return null;
  const entityMap = new Map();
  const addEntities = (list, tab, type, getTooltip) =>
    list.forEach(e => e.name?.trim().length > 1 && entityMap.set(e.name.toLowerCase(), { name: e.name, tab, type, tooltip: getTooltip(e) }));
  
  addEntities(npcs,      "npcs",      "npc",       e => ({ sub: e.role || "", body: e.notes || "" }));
  addEntities(locations, "locations", "location",  e => ({ sub: e.type || "", body: e.notes || "" }));
  addEntities(quests,    "quests",    "quest",     e => ({ sub: e.status || "", body: e.description || "" }));
  addEntities(inventory, "inventory", "inventory", e => ({ sub: e.type || "", body: e.note || "" }));
  addEntities(skills,    "skills",    "skill",     e => ({ sub: e.category || "", body: e.description || "" }));

  const sorted = [...entityMap.values()].sort((a, b) => b.name.length - a.name.length);
  if (!sorted.length) return text;
  const pattern = new RegExp(`(${sorted.map(e => e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const TAB_LABELS = {npc: "Postacie", location: "Miejsca", quest: "Zadania", inventory: "Plecak", skill: "Zdolności"};

  return text.split(pattern).map((part, i) => {
    const key = part.toLowerCase();
    const match = entityMap.get(key);
    if (match) {
      return <EntityLink key={i} match={match} part={part} onNavigate={onNavigate} tabLabel={TAB_LABELS[match.type]}/>;
    }
    return part;
  });
}

function EntityLink({ match, part, onNavigate, tabLabel }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = () => { clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setVisible(true), 350); };
  const hide = () => { clearTimeout(timerRef.current); setVisible(false); };

  return (
    <span
      className={`entity-link entity-link-${match.type}`}
      onClick={() => onNavigate(match.tab)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={e => { e.preventDefault(); show(); }}
      onTouchEnd={hide}
      title={match.name}
      style={{position: "relative", display: "inline"}}
    >
      {part}
      {visible && (
        <span className="entity-tooltip" onClick={e => e.stopPropagation()}>
          <span className="entity-tooltip-name">{match.name}</span>
          {match.tooltip.sub && (
            <span className="entity-tooltip-sub">{match.tooltip.sub}</span>
          )}
          {match.tooltip.body && (
            <span className="entity-tooltip-body">
              {match.tooltip.body.slice(0, 140)}{match.tooltip.body.length > 140 ? "…" : ""}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/* ═══ WSPÓLNE KOMPONENTY INTERFEJSU ══════════════ */
function TagsEditor({tags, onChange}) {
  const [adding, setAdding] = useState(false); const [draft, setDraft] = useState("");
  const commit = () => { const t = draft.trim().toLowerCase(); if (t && !tags.includes(t)) onChange([...tags, t]); setDraft(""); setAdding(false); };
  return <div className="tags-row">
    {tags.map(tag => <span key={tag} className="tag tag-default">{tag}<button className="tag-remove" onClick={() => onChange(tags.filter(x => x !== tag))}>✕</button></span>)}
    {adding ? <input className="tag-input" autoFocus value={draft} placeholder="tag…" onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setAdding(false); setDraft(""); } }}/>
            : <button className="tag-add-btn" onClick={() => setAdding(true)}>+ tag</button>}
  </div>;
}

function FilterBar({allTags, activeTag, onSelect}) {
  if (!allTags.length) return null;
  return <div className="filter-bar">
    <span style={{fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase"}}>Filtr:</span>
    <button className={`filter-tag${!activeTag ? " active-filter" : ""}`} onClick={() => onSelect(null)}>Wszystkie</button>
    {allTags.map(tag => <button key={tag} className={`filter-tag${activeTag === tag ? " active-filter" : ""}`} onClick={() => onSelect(activeTag === tag ? null : tag)}>{tag}</button>)}
  </div>;
}

function PrzypnijBtn({pinned, onToggle}) {
  return <button className={`pin-btn${pinned ? " pinned" : ""}`} onClick={onToggle} title={pinned ? "Odepnij" : "Przypnij"}>{pinned ? "📌" : "📍"}</button>;
}

function Toggle({on, onToggle, label, color}) {
  const cls = on ? (color === "purple" ? "on-purple" : color === "blue" ? "on-blue" : "on") : "";
  return <div className="toggle-wrap" onClick={onToggle}>
    <div className={`toggle-track${cls ? " " + cls : ""}`}><div className="toggle-thumb"/></div>
    <span className="toggle-label">{label}</span>
  </div>;
}

function StatBox({label, value, onChange}) {
  const [editing, setEditing] = useState(false); const [draft, setDraft] = useState(String(value));
  const commit = () => { const n = parseInt(draft, 10); if (!isNaN(n)) onChange(clamp(n, 1, 30)); setEditing(false); };
  return <div className={`stat-box${editing ? " editing" : ""}`} onClick={() => { if (!editing) { setDraft(String(value)); setEditing(true); } }}>
    <span className="stat-name">{label}</span>
    {editing ? <input className="stat-input" value={draft} autoFocus o