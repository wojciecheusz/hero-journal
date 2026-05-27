import { useState, useEffect, useRef, useCallback } from 'react'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100vh; background: #0f0d0b; }

  .hj-root { position: relative; min-height: 100vh; background: #0f0d0b; color: #ddd5bb; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; line-height: 1.55; padding-bottom: 90px; }
  .hj-root::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999; opacity: 0.045; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); background-repeat: repeat; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #0a0806; }
  ::-webkit-scrollbar-thumb { background: #3a3020; border-radius: 4px; }

  .hj-header { position: sticky; top: 0; z-index: 50; background: linear-gradient(180deg,#1c1810 0%,#141008 100%); border-bottom: 1px solid #352e1e; box-shadow: 0 4px 32px rgba(0,0,0,0.8); padding: 1rem 1.25rem; }
  .hj-logo { font-family: 'Cinzel Decorative', serif; font-size: 1.3rem; font-weight: 700; color: #e2b94e; letter-spacing: 0.12em; text-shadow: 0 0 22px rgba(226,185,78,0.4); display: flex; align-items: center; gap: 0.5rem; }

  /* ── Mobile Optimized Bottom Nav ── */
  .hj-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: linear-gradient(0deg,#0d0b08 0%,#161210 100%); border-top: 1px solid #302818; box-shadow: 0 -4px 32px rgba(0,0,0,0.8); display: flex; align-items: stretch; height: 76px; padding-bottom: env(safe-area-inset-bottom,0px); overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .hj-bottom-nav::-webkit-scrollbar { display: none; }
  .hj-nav-btn { flex: 0 0 22%; min-width: 75px; scroll-snap-align: start; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.3rem; background: transparent; border: none; cursor: pointer; transition: all 0.18s; padding: 0.5rem; position: relative; }
  .hj-nav-btn::before { content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 3px; background: #e2b94e; transform: scaleX(0); transition: transform 0.2s; border-radius: 0 0 3px 3px; }
  .hj-nav-btn.active::before { transform: scaleX(1); }
  .hj-nav-icon { font-size: 1.4rem; line-height: 1; filter: grayscale(1) brightness(0.45); transition: filter 0.18s; }
  .hj-nav-btn.active .hj-nav-icon { filter: grayscale(0) brightness(1); }
  .hj-nav-label { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.08em; text-transform: uppercase; color: #6a5830; transition: color 0.18s; font-weight: 600; }
  .hj-nav-btn.active .hj-nav-label { color: #e2b94e; }

  .hj-content { max-width: 780px; margin: 0 auto; padding: 1.4rem 1rem 2rem; display: flex; flex-direction: column; gap: 1.2rem; }

  /* ── Cards ── */
  .card { background: #1c1810; border: 1px solid #352e1e; border-radius: 4px; box-shadow: 0 3px 0 #0a0806, inset 0 1px 0 rgba(226,185,78,0.05); padding: 1.25rem; position: relative; }
  .card.pinned { border-color: #7a6030; }
  .card.pinned::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,#e2b94e,transparent); }
  .card.inuse-active { border-color: #5a3a8a; }
  .card.spell-active { border-color: #1a3a6a; }

  .inner-divider { border: none; border-top: 1px solid #2a2418; margin: 1.4rem 0; position: relative; }
  .inner-divider::before { content: attr(data-label); position: absolute; top: 50%; left: 0; transform: translateY(-50%); background: #1c1810; padding-right: 0.8rem; font-family: 'Cinzel', serif; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #b09050; }

  .sect-label { font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #b09050; display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.2rem; }
  .sect-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg,#352e1e,transparent); }

  /* ── Inputs & Touch Targets ── */
  .iedit { background: transparent; border: none; border-bottom: 1px dashed #5a4e34; color: inherit; font-family: inherit; font-size: inherit; font-weight: inherit; outline: none; width: 100%; transition: border-color 0.15s; padding: 0.3rem 0; }
  .iedit:focus { border-bottom-color: #e2b94e; }

  .g-input, .g-select, .g-textarea { background: #130f0c; border: 1px solid #3a3220; color: #ddd5bb; font-family: 'Crimson Text', Georgia, serif; font-size: 1.1rem; padding: 0.75rem 0.85rem; outline: none; width: 100%; border-radius: 4px; appearance: none; }
  .g-input:focus, .g-select:focus, .g-textarea:focus { border-color: #8a6830; }

  /* ── Buttons ── */
  .btn-gold, .btn-ghost, .btn-danger, .btn-sm { padding: 0.6rem 1.2rem; cursor: pointer; border-radius: 3px; font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; }
  .btn-gold { background: transparent; color: #e2b94e; border: 1px solid #8a6830; }
  .btn-ghost { border: 1px solid #3a3220; color: #9a8050; }
  .btn-danger { border: 1px solid #6a2a2a; color: #c04040; }
  .btn-sm { font-size: 0.65rem; padding: 0.4rem 0.8rem; }
  
  .btn-pm { width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; background: #130f0c; border: 1px solid #3a3220; color: #9a8050; font-size: 1.5rem; border-radius: 4px; }

  /* ── Tags & Badges ── */
  .tags-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem; }
  .tag { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.1em; padding: 0.3rem 0.6rem; display: inline-flex; align-items: center; gap: 0.4rem; border-radius: 2px; }
  .tag-default { background: rgba(226,185,78,0.08); border: 1px solid #4a3e20; color: #b09050; }
  .tag-remove { background: transparent; border: none; color: #7a6040; font-size: 0.8rem; padding: 0.2rem; margin: -0.2rem; }
  .tag-add-btn { background: transparent; border: 1px dashed #3a3018; color: #7a6840; font-family: 'Cinzel', serif; font-size: 0.6rem; padding: 0.3rem 0.8rem; }
  
  .filter-bar { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; margin-bottom: 1rem; }
  .filter-tag { font-family: 'Cinzel', serif; font-size: 0.65rem; padding: 0.4rem 0.8rem; border: 1px solid #352e1e; border-radius: 3px; color: #8a7040; background: transparent; }
  .filter-tag.active-filter { background: rgba(226,185,78,0.1); border-color: #8a6830; color: #e2b94e; }

  /* ── Stat box ── */
  .stat-grid-6 { display: grid; grid-template-columns: repeat(6,1fr); gap: 0.5rem; }
  @media (max-width:600px) { .stat-grid-6 { grid-template-columns: repeat(3,1fr); gap: 0.8rem; } }
  .stat-box { background: #130f0c; border: 1px solid #3a3220; border-radius: 4px; text-align: center; padding: 0.85rem 0.4rem; cursor: pointer; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); }
  .stat-name { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.15em; color: #b09050; margin-bottom: 0.4rem; display: block; }
  .stat-val  { font-family: 'Cinzel', serif; font-size: 1.7rem; font-weight: 700; color: #e2b94e; line-height: 1.1; }
  .stat-mod  { font-family: 'Cinzel', serif; font-size: 0.7rem; color: #9a8050; margin-top: 0.2rem; display: block; }

  /* ── Combat & HP ── */
  .hp-bar-bg { height: 14px; background: #0a0806; border: 1px solid #231e12; border-radius: 7px; overflow: hidden; margin-top: 1rem; }
  .hp-bar-fill { height: 100%; transition: width 0.35s ease, background 0.5s ease; }
  
  .combat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.8rem; margin-top: 1rem; }
  .combat-box { background: #130f0c; border: 1px solid #3a3220; border-radius: 4px; text-align: center; padding: 0.8rem 0.4rem; }
  .combat-box-label { font-family: 'Cinzel', serif; font-size: 0.65rem; color: #b09050; display: block; margin-bottom: 0.4rem; }
  .combat-box-input { font-size: 1.4rem; color: #e2b94e; text-align: center; width: 100%; background: transparent; border: none; outline: none; }

  /* ── Toggles & Checkboxes (Enlarged Targets) ── */
  .check-row { display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem 0.4rem; border-bottom: 1px solid #231e12; }
  .prof-dot-btn { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #5a4a28; background: transparent; flex-shrink: 0; appearance: none; }
  .prof-dot-btn.prof { background: #e2b94e; border-color: #c9a84c; }
  .check-label { font-size: 1.1rem; flex: 1; }
  .check-attr { font-size: 0.65rem; color: #8a7040; width: 30px; }
  .check-bonus { font-size: 1rem; font-weight: 700; width: 40px; text-align: right; }

  .skill-pips { display: flex; gap: 6px; align-items: center; }
  .pip { width: 16px; height: 16px; border: 2px solid #3a3018; border-radius: 2px; }
  .pip.filled { background: #e2b94e; border-color: #c9a84c; }

  .toggle-wrap { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; padding: 0.4rem; }
  .toggle-track { width: 44px; height: 24px; border-radius: 12px; background: #2a2418; border: 1px solid #3a3220; position: relative; }
  .toggle-thumb { width: 16px; height: 16px; border-radius: 50%; background: #5a4a28; position: absolute; top: 3px; left: 3px; transition: left 0.2s; }
  .toggle-track.on .toggle-thumb, .toggle-track.on-purple .toggle-thumb, .toggle-track.on-blue .toggle-thumb { left: 23px; }

  /* ── Entities & Logs ── */
  .entity-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 0.8rem; }
  .pin-btn, .entity-toggle { padding: 0.6rem; font-size: 1.2rem; background: transparent; border: none; color: #9a8050; }
  
  .sess-header { padding: 1rem 1.2rem; gap: 1rem; }
  .sess-body { padding: 1rem 1.2rem 1.4rem; }
  .sess-rendered { font-size: 1.1rem; line-height: 1.8; padding: 1rem; border-radius: 4px; }
  
  .checklist-item { padding: 0.6rem 0; gap: 0.8rem; }
  .check-box { width: 22px; height: 22px; border: 2px solid #5a4a28; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
  .check-box.checked::after { content: '✓'; font-size: 0.9rem; }

  .modal-box { max-width: 90%; border-radius: 6px; padding: 2rem; }

  .row { display: flex; align-items: center; gap: 0.8rem; }
  .col { display: flex; flex-direction: column; gap: 0.8rem; }
  .flex1 { flex: 1; min-width: 0; }
  .mt05 { margin-top: 0.8rem; }
`;

/* ═══ CONSTANTS ═════════════════════════════════ */
const today   = () => new Date().toISOString().slice(0,10);
const statMod = v  => { const m=Math.floor((v-10)/2); return m>=0?`+${m}`:String(m); };
const numMod  = v  => v>=0?`+${v}`:String(v);
const clamp   = (n,lo,hi) => Math.max(lo,Math.min(hi,n));

const STAT_KEYS    = ["STR","DEX","CON","INT","WIS","CHA"];
const STATUS_CYCLE = { Active:"Completed", Completed:"Failed", Failed:"Active" };
const REL_CYCLE    = { unknown:"ally", ally:"neutral", neutral:"hostile", hostile:"unknown" };
const REL_LABELS   = { ally:"Ally", neutral:"Neutral", hostile:"Hostile", unknown:"Unknown" };
const LOC_TYPES    = ["Settlement","Dungeon","Wilderness","Building","Ruin","Landmark","Other"];
const ALIGNMENTS   = ["Lawful Good","Neutral Good","Chaotic Good","Lawful Neutral","True Neutral","Chaotic Neutral","Lawful Evil","Neutral Evil","Chaotic Evil"];
const ITEM_TYPES   = ["General","Weapon","Armor","Spell Scroll","Wondrous Item","Consumable","Tool","Other"];
const ITEM_ICONS   = { General:"📦", Weapon:"⚔️", Armor:"🛡️", "Spell Scroll":"📜", "Wondrous Item":"✨", Consumable:"🧪", Tool:"🔧", Other:"◈" };

/* Skills tab: only Skill, Trait, Feat */
const SKILL_CATS = ["Skill","Trait","Feat"];

const SPELL_SCHOOLS = ["Abjuration","Conjuration","Divination","Enchantment","Evocation","Illusion","Necromancy","Transmutation","Other"];
const SPELL_LEVELS  = ["Cantrip","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];
const SPELL_SLOT_LABELS = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];

const SAVING_THROWS = [
  {key:"str",label:"Strength",    attr:"STR"},
  {key:"dex",label:"Dexterity",   attr:"DEX"},
  {key:"con",label:"Constitution",attr:"CON"},
  {key:"int",label:"Intelligence",attr:"INT"},
  {key:"wis",label:"Wisdom",      attr:"WIS"},
  {key:"cha",label:"Charisma",    attr:"CHA"},
];
const GENERIC_SKILLS = [
  {key:"acrobatics",    label:"Acrobatics",     attr:"DEX"},
  {key:"athletics",     label:"Athletics",      attr:"STR"},
  {key:"arcana",        label:"Arcana",         attr:"INT"},
  {key:"deception",     label:"Deception",      attr:"CHA"},
  {key:"history",       label:"History",        attr:"INT"},
  {key:"insight",       label:"Insight",        attr:"WIS"},
  {key:"intimidation",  label:"Intimidation",   attr:"CHA"},
  {key:"investigation", label:"Investigation",  attr:"INT"},
  {key:"medicine",      label:"Medicine",       attr:"WIS"},
  {key:"nature",        label:"Nature",         attr:"INT"},
  {key:"perception",    label:"Perception",     attr:"WIS"},
  {key:"performance",   label:"Performance",    attr:"CHA"},
  {key:"persuasion",    label:"Persuasion",     attr:"CHA"},
  {key:"religion",      label:"Religion",       attr:"INT"},
  {key:"sleightofhand", label:"Sleight of Hand",attr:"DEX"},
  {key:"stealth",       label:"Stealth",        attr:"DEX"},
  {key:"survival",      label:"Survival",       attr:"WIS"},
  {key:"animalhandling",label:"Animal Handling",attr:"WIS"},
];

const DEFAULT_CHAR = {
  name:"", classes:[{name:"Adventurer",level:1}],
  stats:{STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10},
  profBonus:2, hp:{current:10,max:10,temp:0}, ac:10,
  savingThrows:{}, skills:{},
  alignment:"True Neutral", background:"",
  traits:{personality:"",ideals:"",bonds:"",flaws:""},
  personalNotes:"", backstory:"",
  spellSlots:{}, // { "1st": {max:2,used:0}, ... }
  spellcastingAbility:"INT",
};

const load = (key,fb) => { try { return JSON.parse(localStorage.getItem(key))??fb; } catch { return fb; } };
const save = (key,val) => { try { localStorage.setItem(key,JSON.stringify(val)); } catch {} };
const ALL_KEYS = ["hj_char","hj_inventory","hj_npcs","hj_locations","hj_skills","hj_spells","hj_sessions","hj_quests"];

const hpBarColor = pct => pct>70?"linear-gradient(90deg,#1a5a1a,#2a8a2a,#33aa33)":pct>35?"linear-gradient(90deg,#7a4a10,#cc7020,#e08030)":"linear-gradient(90deg,#3a0a0a,#6b0f0f,#961a1a)";
const hpNumColor = pct => pct>70?"#5acc5a":pct>35?"#e08030":"#cc3a3a";

const LEGEND_ITEMS = [
  {type:"npc",      color:"rgba(226,185,78,0.35)", border:"rgba(226,185,78,0.7)",  label:"People"},
  {type:"location", color:"rgba(122,172,204,0.35)",border:"rgba(122,172,204,0.7)", label:"Places"},
  {type:"quest",    color:"rgba(204,102,102,0.35)",border:"rgba(204,102,102,0.7)", label:"Quests"},
  {type:"inventory",color:"rgba(122,204,154,0.35)",border:"rgba(122,204,154,0.7)", label:"Pack"},
  {type:"skill",    color:"rgba(168,122,204,0.35)",border:"rgba(168,122,204,0.7)", label:"Skills"},
];

function parseEntityLinks(text,npcs,locations,quests,inventory,skills,onNavigate) {
  if (!text) return null;
  const entities=[
    ...npcs.map(n=>({name:n.name,tab:"npcs",type:"npc"})),
    ...locations.map(l=>({name:l.name,tab:"locations",type:"location"})),
    ...quests.map(q=>({name:q.name,tab:"quests",type:"quest"})),
    ...inventory.map(i=>({name:i.name,tab:"inventory",type:"inventory"})),
    ...skills.map(s=>({name:s.name,tab:"skills",type:"skill"})),
  ].filter(e=>e.name&&e.name.trim().length>1).sort((a,b)=>b.name.length-a.name.length);
  if (!entities.length) return text;
  const pattern=new RegExp(`(${entities.map(e=>e.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'gi');
  const TAB_LABELS={npc:"People",location:"Places",quest:"Quests",inventory:"Pack",skill:"Skills"};
  return text.split(pattern).map((part,i)=>{
    const match=entities.find(e=>e.name.toLowerCase()===part.toLowerCase());
    if (match) return <span key={i} className={`entity-link entity-link-${match.type}`} onClick={()=>onNavigate(match.tab)} title={`→ ${TAB_LABELS[match.type]}: ${match.name}`}>{part}</span>;
    return part;
  });
}

/* ═══ SHARED ════════════════════════════════════ */
function TagsEditor({tags,onChange}) {
  const [adding,setAdding]=useState(false); const [draft,setDraft]=useState("");
  const commit=()=>{const t=draft.trim().toLowerCase();if(t&&!tags.includes(t))onChange([...tags,t]);setDraft("");setAdding(false);};
  return <div className="tags-row">
    {tags.map(tag=><span key={tag} className="tag tag-default">{tag}<button className="tag-remove" onClick={()=>onChange(tags.filter(x=>x!==tag))}>✕</button></span>)}
    {adding?<input className="tag-input" autoFocus value={draft} placeholder="tag…" onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape"){setAdding(false);setDraft("");}}}/>
           :<button className="tag-add-btn" onClick={()=>setAdding(true)}>+ tag</button>}
  </div>;
}

function FilterBar({allTags,activeTag,onSelect}) {
  if (!allTags.length) return null;
  return <div className="filter-bar">
    <span style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.12em",color:"#6a5a38",textTransform:"uppercase"}}>Filter:</span>
    <button className={`filter-tag${!activeTag?" active-filter":""}`} onClick={()=>onSelect(null)}>All</button>
    {allTags.map(tag=><button key={tag} className={`filter-tag${activeTag===tag?" active-filter":""}`} onClick={()=>onSelect(activeTag===tag?null:tag)}>{tag}</button>)}
  </div>;
}

function PinBtn({pinned,onToggle}) {
  return <button className={`pin-btn${pinned?" pinned":""}`} onClick={onToggle} title={pinned?"Unpin":"Pin"}>{pinned?"📌":"📍"}</button>;
}

function Toggle({on,onToggle,label,color}) {
  const cls = on ? (color==="purple"?"on-purple":color==="blue"?"on-blue":"on") : "";
  return <div className="toggle-wrap" onClick={onToggle}>
    <div className={`toggle-track${cls?" "+cls:""}`}><div className="toggle-thumb"/></div>
    <span className="toggle-label">{label}</span>
  </div>;
}

function StatBox({label,value,onChange}) {
  const [editing,setEditing]=useState(false); const [draft,setDraft]=useState(String(value));
  const commit=()=>{const n=parseInt(draft,10);if(!isNaN(n))onChange(clamp(n,1,30));setEditing(false);};
  return <div className={`stat-box${editing?" editing":""}`} onClick={()=>{if(!editing){setDraft(String(value));setEditing(true);}}}>
    <span className="stat-name">{label}</span>
    {editing?<input className="stat-input" value={draft} autoFocus onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} onClick={e=>e.stopPropagation()}/>
            :<span className="stat-val">{value}</span>}
    <span className="stat-mod">{statMod(value)}</span>
  </div>;
}

function SkillPips({value,onChange}) {
  return <div className="skill-pips">{[1,2,3,4,5].map(i=><div key={i} className={`pip${i<=value?" filled":""}`} onClick={()=>onChange(i===value?0:i)}/>)}</div>;
}

function ResetModal({onConfirm,onCancel}) {
  return <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-box" onClick={e=>e.stopPropagation()}>
      <div className="modal-title">⚠ Full Reset</div>
      <p className="modal-text">This will permanently erase all character data, inventory, NPCs, locations, sessions, quests, skills and spells. This cannot be undone.</p>
      <div className="row" style={{justifyContent:"flex-end",gap:"0.6rem"}}>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm}>Erase Everything</button>
      </div>
    </div>
  </div>;
}

/* ═══ CHARACTER SHEET (merged card) ════════════ */
function CharacterSheet({char,setChar,inventory,skills,spells}) {
  const upd  = (f,v) => setChar(c=>({...c,[f]:v}));
  const updSt= (s,v) => setChar(c=>({...c,stats:{...c.stats,[s]:v}}));
  const hpPct= Math.round(clamp((char.hp.current/char.hp.max)*100,0,100));
  const pb   = char.profBonus||2;

  const toggleSave = useCallback(key=>setChar(c=>({...c,savingThrows:{...(c.savingThrows||{}),[key]:!(c.savingThrows||{})[key]}})),[setChar]);
  const toggleSkill= useCallback(key=>setChar(c=>({...c,skills:{...(c.skills||{}),[key]:!(c.skills||{})[key]}})),[setChar]);

  const equippedItems  = (inventory||[]).filter(i=>i.equipped);
  const activeSkills   = (skills||[]).filter(s=>s.inUse);
  const activeSpells   = (spells||[]).filter(s=>s.inUse);
  const hasActive      = equippedItems.length||activeSkills.length||activeSpells.length;

  return <>
    {/* ══ Single merged CHARACTER card ══ */}
    <div className="card">
      <div className="sect-label">Character</div>

      {/* Name */}
      <div style={{marginBottom:"1rem"}}>
        <input className="iedit" style={{fontFamily:"Cinzel,serif",fontSize:"1.4rem",color:"#ede5c5",fontWeight:700,letterSpacing:"0.04em"}} value={char.name||""} onChange={e=>upd("name",e.target.value)} placeholder="Enter your hero's name…"/>
      </div>

      {/* Classes */}
      <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",marginBottom:"0.8rem"}}>
        {(char.classes||[]).map((cls,i)=>(
          <div key={i} className="class-row">
            <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.95rem",color:i===0?"#e2b94e":"#c8bfa0",fontWeight:600}} value={cls.name} onChange={e=>setChar(c=>{const cl=[...c.classes];cl[i]={...cl[i],name:e.target.value};return{...c,classes:cl};})} placeholder={`Class ${i+1}…`}/>
            <span style={{fontFamily:"Cinzel,serif",fontSize:"0.56rem",color:"#8a7040",letterSpacing:"0.1em",flexShrink:0}}>LVL</span>
            <input type="number" className="iedit" style={{width:38,textAlign:"center",fontFamily:"Cinzel,serif",fontSize:"0.95rem",color:"#e2b94e"}} value={cls.level} min={1} max={20} onChange={e=>setChar(c=>{const cl=[...c.classes];cl[i]={...cl[i],level:clamp(parseInt(e.target.value)||1,1,20)};return{...c,classes:cl};})}/>
            {i>0&&<button className="btn-ghost" style={{padding:"0.1rem 0.35rem",fontSize:"0.65rem"}} onClick={()=>setChar(c=>({...c,classes:c.classes.filter((_,j)=>j!==i)}))}>✕</button>}
          </div>
        ))}
        {(char.classes||[]).length<4&&<button className="btn-sm" style={{alignSelf:"flex-start",marginTop:"0.2rem"}} onClick={()=>setChar(c=>({...c,classes:[...(c.classes||[]),{name:"",level:1}]}))}>+ Multiclass</button>}
      </div>

      {/* Background / ProfBonus / Alignment */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 90px 1fr",gap:"0.6rem",alignItems:"end",marginBottom:"0"}}>
        <div>
          <div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"#8a7040",marginBottom:"0.25rem"}}>Background</div>
          <input className="iedit" style={{fontSize:"0.9rem",color:"#c8bfa0"}} value={char.background||""} onChange={e=>upd("background",e.target.value)} placeholder="Background…"/>
        </div>
        <div>
          <div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"#8a7040",marginBottom:"0.25rem"}}>Prof. Bonus</div>
          <input type="number" className="iedit" style={{textAlign:"center",fontFamily:"Cinzel,serif",fontSize:"0.95rem",color:"#e2b94e"}} value={pb} onChange={e=>upd("profBonus",parseInt(e.target.value)||2)}/>
        </div>
        <div>
          <div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"#8a7040",marginBottom:"0.25rem"}}>Alignment</div>
          <select className="g-select" value={char.alignment||"True Neutral"} onChange={e=>upd("alignment",e.target.value)} style={{fontSize:"0.78rem",padding:"0.3rem 0.5rem"}}>{ALIGNMENTS.map(a=><option key={a} value={a}>{a}</option>)}</select>
        </div>
      </div>

      {/* ─ Attributes ─ */}
      <hr className="inner-divider" data-label="Attributes — tap to edit" style={{marginTop:"1.1rem"}}/>
      <div className="stat-grid-6" style={{marginTop:"0.8rem"}}>{STAT_KEYS.map(k=><StatBox key={k} label={k} value={char.stats[k]} onChange={v=>updSt(k,v)}/>)}</div>

      {/* ─ Vitality ─ */}
      <hr className="inner-divider" data-label="Vitality" style={{marginTop:"1.1rem"}}/>
      <div style={{marginTop:"0.8rem",display:"grid",gridTemplateColumns:"auto 1fr",gap:"0.6rem",alignItems:"center"}}>

        {/* Left: − num/max + HP label */}
        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",whiteSpace:"nowrap"}}>
          <button className="btn-pm minus" onClick={()=>setChar(c=>({...c,hp:{...c.hp,current:clamp(c.hp.current-1,0,c.hp.max)}}))}>−</button>
          <div className="hp-display">
            <input type="number" value={char.hp.current} style={{background:"transparent",border:"none",outline:"none",fontFamily:"Cinzel,serif",textAlign:"center",fontSize:"1.5rem",width:52,color:hpNumColor(hpPct),transition:"color 0.5s"}} onChange={e=>setChar(c=>({...c,hp:{...c.hp,current:clamp(parseInt(e.target.value)||0,0,c.hp.max)}}))}/>
            <span className="hp-sep">/</span>
            <input type="number" value={char.hp.max} style={{background:"transparent",border:"none",outline:"none",fontFamily:"Cinzel,serif",textAlign:"center",fontSize:"1rem",width:44,color:"#8a5a5a"}} onChange={e=>setChar(c=>({...c,hp:{...c.hp,max:Math.max(1,parseInt(e.target.value)||1)}}))}/>
          </div>
          <button className="btn-pm plus" onClick={()=>setChar(c=>({...c,hp:{...c.hp,current:clamp(c.hp.current+1,0,c.hp.max)}}))}>+</button>
          <span className="hp-label">HP</span>
        </div>

        {/* Right: three combat boxes */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.4rem"}}>
          <div className="combat-box">
            <span className="combat-box-label">Temp HP</span>
            <input className="combat-box-input" type="number" value={char.hp.temp||0} onChange={e=>setChar(c=>({...c,hp:{...c.hp,temp:parseInt(e.target.value)||0}}))}/>
          </div>
          <div className="combat-box">
            <span className="combat-box-label">Armor Class</span>
            <input className="combat-box-input" type="number" value={char.ac||10} onChange={e=>setChar(c=>({...c,ac:parseInt(e.target.value)||10}))}/>
          </div>
          <div className="combat-box">
            <span className="combat-box-label">Initiative</span>
            <span className="combat-box-val">{numMod(Math.floor((char.stats.DEX-10)/2))}</span>
          </div>
        </div>

      </div>

      {/* HP bar + pct below the whole row */}
      <div className="hp-bar-bg" style={{marginTop:"0.5rem"}}>
        <div className="hp-bar-fill" style={{width:`${hpPct}%`,background:hpBarColor(hpPct)}}/>
      </div>
      <div className="hp-pct" style={{color:hpNumColor(hpPct)}}>{hpPct}% vitality remaining</div>

      {/* ─ Saving Throws ─ */}
      <hr className="inner-divider" data-label="Saving Throws" style={{marginTop:"1.1rem"}}/>
      <div className="save-grid" style={{marginTop:"0.8rem"}}>
        {SAVING_THROWS.map(st=>{
          const prof=!!(char.savingThrows||{})[st.key];
          const base=Math.floor((char.stats[st.attr]-10)/2);
          const bonus=prof?base+pb:base;
          return <div key={st.key} className="check-row">
            <button type="button" className={`prof-dot-btn${prof?" prof":""}`} onClick={()=>toggleSave(st.key)} title="Toggle proficiency"/>
            <span className="check-attr">{st.attr}</span>
            <span className="check-label">{st.label}</span>
            <span className="check-bonus">{numMod(bonus)}</span>
          </div>;
        })}
      </div>

      {/* ─ Skills ─ */}
      <hr className="inner-divider" data-label="Skills" style={{marginTop:"1.1rem"}}/>
      <div className="save-grid" style={{marginTop:"0.8rem"}}>
        {GENERIC_SKILLS.map(sk=>{
          const prof=!!(char.skills||{})[sk.key];
          const base=Math.floor((char.stats[sk.attr]-10)/2);
          const bonus=prof?base+pb:base;
          return <div key={sk.key} className="check-row">
            <button type="button" className={`prof-dot-btn${prof?" prof":""}`} onClick={()=>toggleSkill(sk.key)} title="Toggle proficiency"/>
            <span className="check-attr">{sk.attr}</span>
            <span className="check-label">{sk.label}</span>
            <span className="check-bonus">{numMod(bonus)}</span>
          </div>;
        })}
      </div>
    </div>

    {/* ══ Active / Equipped (from all tabs) ══ */}
    {hasActive>0&&<div className="card">
      <div className="sect-label">Active & Equipped</div>
      {equippedItems.map(item=>(
        <div key={item.id} className="equipped-item">
          <span className="equipped-icon">{ITEM_ICONS[item.type]||"◈"}</span>
          <div className="flex1">
            <div className="row" style={{gap:"0.4rem",marginBottom:"0.15rem"}}><span className="equipped-name">{item.name}</span><span className="equipped-type-badge">{item.type}</span></div>
            {item.damage&&<div className="equipped-stat">Damage: {item.damage}{item.damageType?` ${item.damageType}`:""}</div>}
            {item.modifier!==undefined&&item.modifier!==""&&<div className="equipped-stat">To Hit: {numMod(parseInt(item.modifier)||0)}</div>}
            {item.charges&&<div className="equipped-stat">Charges: {item.charges}</div>}
            {item.effect&&<div className="equipped-stat" style={{color:"#a87acc"}}>{item.effect}</div>}
          </div>
        </div>
      ))}
      {activeSkills.map(sk=>(
        <div key={sk.id} className="equipped-item">
          <span className="equipped-icon">✨</span>
          <div className="flex1">
            <div className="row" style={{gap:"0.4rem",marginBottom:"0.15rem"}}><span className="equipped-name">{sk.name}</span><span className="equipped-skill-badge">{sk.category}</span></div>
            {sk.description&&<div className="equipped-stat">{sk.description}</div>}
          </div>
        </div>
      ))}
      {activeSpells.map(sp=>(
        <div key={sp.id} className="equipped-item">
          <span className="equipped-icon">🔮</span>
          <div className="flex1">
            <div className="row" style={{gap:"0.4rem",marginBottom:"0.15rem",flexWrap:"wrap"}}>
              <span className="equipped-name">{sp.name}</span>
              <span className="equipped-spell-badge">{sp.level}</span>
              {sp.school&&<span className="equipped-spell-badge">{sp.school}</span>}
            </div>
            {sp.castingTime&&<div className="equipped-stat">Cast: {sp.castingTime} · Range: {sp.range||"—"}</div>}
            {sp.description&&<div className="equipped-stat">{sp.description}</div>}
          </div>
        </div>
      ))}
    </div>}

    {/* ══ Traits ══ */}
    <div className="card">
      <div className="sect-label">Character Traits</div>
      <div className="trait-grid">
        {[["personality","Personality Traits","How your character acts and speaks…"],
          ["ideals","Ideals","What your character believes in…"],
          ["bonds","Bonds","What ties your character to the world…"],
          ["flaws","Flaws","Your character's weaknesses…"]].map(([key,label,ph])=>(
          <div key={key} className="trait-block">
            <span className="trait-label">{label}</span>
            <textarea className="trait-ta" rows={3} placeholder={ph} value={char.traits?.[key]||""} onChange={e=>setChar(c=>({...c,traits:{...(c.traits||{}),[key]:e.target.value}}))}/>
          </div>
        ))}
      </div>
    </div>

    <div className="card">
      <div className="sect-label">Personal Notes</div>
      <textarea className="g-textarea" rows={4} placeholder="Session reminders, GM hints, party notes…" value={char.personalNotes||""} onChange={e=>upd("personalNotes",e.target.value)}/>
    </div>

    <div className="card">
      <div className="sect-label">Backstory</div>
      <textarea className="g-textarea" rows={6} placeholder="Where did your hero come from? What shaped them? What do they seek?…" value={char.backstory||""} onChange={e=>upd("backstory",e.target.value)}/>
    </div>
  </>;
}

/* ═══ PACK ══════════════════════════════════════ */
function Pack({inventory,setInventory}) {
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:"",type:"General",qty:"1",damage:"",damageType:"",modifier:"",charges:"",effect:"",note:""});
  const [expanded,setExpanded]=useState({});
  const [filterType,setFilterType]=useState(null);
  const addItem=()=>{const n=form.name.trim();if(!n)return;setInventory(inv=>[...inv,{id:Date.now(),equipped:false,...form,name:n}]);setForm({name:"",type:"General",qty:"1",damage:"",damageType:"",modifier:"",charges:"",effect:"",note:""});setShowForm(false);};
  const upd=(id,f,v)=>setInventory(inv=>inv.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setInventory(inv=>inv.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const toggleEquip=id=>setInventory(inv=>inv.map(x=>x.id===id?{...x,equipped:!x.equipped}:x));
  const visible=filterType?inventory.filter(i=>i.type===filterType):inventory;
  const equippedCount=inventory.filter(i=>i.equipped).length;
  const needsExtras=t=>["Weapon","Spell Scroll","Wondrous Item","Consumable"].includes(t);
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#8a7040"}}>{inventory.length} items{equippedCount>0?` · ${equippedCount} equipped`:""}</span>
      <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Item"}</button>
    </div>
    {showForm&&<div className="add-form">
      <div className="col">
        <div className="row"><input className="g-input flex1" placeholder="Item name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addItem()}/><input className="g-input" style={{width:60}} placeholder="Qty" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></div>
        <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>{ITEM_TYPES.map(t=><button key={t} className="filter-tag" style={{opacity:form.type===t?1:0.5,borderColor:form.type===t?"#8a6830":"",color:form.type===t?"#e2b94e":""}} onClick={()=>setForm(f=>({...f,type:t}))}>{ITEM_ICONS[t]} {t}</button>)}</div>
        {needsExtras(form.type)&&<>
          {form.type==="Weapon"&&<div className="pack-item-row">
            <div className="pack-field"><span className="pack-field-label">Damage Dice</span><input className="pack-field-input" placeholder="e.g. 1d8" value={form.damage} onChange={e=>setForm(f=>({...f,damage:e.target.value}))}/></div>
            <div className="pack-field"><span className="pack-field-label">Damage Type</span><input className="pack-field-input" placeholder="e.g. Slashing" value={form.damageType} onChange={e=>setForm(f=>({...f,damageType:e.target.value}))}/></div>
            <div className="pack-field"><span className="pack-field-label">To Hit Bonus</span><input className="pack-field-input" type="number" placeholder="+0" value={form.modifier} onChange={e=>setForm(f=>({...f,modifier:e.target.value}))}/></div>
          </div>}
          {["Spell Scroll","Wondrous Item","Consumable"].includes(form.type)&&<div className="pack-item-row">
            <div className="pack-field"><span className="pack-field-label">Charges / Uses</span><input className="pack-field-input" placeholder="e.g. 3" value={form.charges} onChange={e=>setForm(f=>({...f,charges:e.target.value}))}/></div>
            <div className="pack-field" style={{flex:2}}><span className="pack-field-label">Effect / Spell</span><input className="pack-field-input" placeholder="e.g. Fireball (3rd lvl)" value={form.effect} onChange={e=>setForm(f=>({...f,effect:e.target.value}))}/></div>
          </div>}
        </>}
        <input className="g-input" placeholder="Notes…" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
        <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addItem}>⊕ Add Item</button></div>
      </div>
    </div>}
    <div className="filter-bar">
      <button className={`filter-tag${!filterType?" active-filter":""}`} onClick={()=>setFilterType(null)}>All</button>
      {ITEM_TYPES.map(t=>{const c=inventory.filter(i=>i.type===t).length;if(!c)return null;return<button key={t} className={`filter-tag${filterType===t?" active-filter":""}`} onClick={()=>setFilterType(filterType===t?null:t)}>{ITEM_ICONS[t]} {t} ({c})</button>;})}
    </div>
    {inventory.length===0&&<div className="card empty-state">Your pack lies empty…</div>}
    {visible.map(item=>{const open=!!expanded[item.id];return(
      <div key={item.id} className={`pack-item${item.equipped?" equipped-active":""}`}>
        <div className="pack-item-header">
          <span style={{fontSize:"1.1rem",flexShrink:0}}>{ITEM_ICONS[item.type]||"◈"}</span>
          <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.9rem",fontWeight:700,color:"#e0d6b4"}} value={item.name} onChange={e=>upd(item.id,"name",e.target.value)}/>
          <span style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",letterSpacing:"0.08em",color:"#7a6040",border:"1px solid #2e2618",padding:"0.1rem 0.35rem",flexShrink:0}}>{item.type}</span>
          <Toggle on={!!item.equipped} onToggle={()=>toggleEquip(item.id)} label={item.equipped?"Equipped":"Stowed"} color="gold"/>
          <button className="entity-toggle" onClick={()=>toggle(item.id)}>{open?"▲":"▼"}</button>
        </div>
        {open&&<div className="pack-item-body">
          <div className="pack-item-row">
            <div className="pack-field"><span className="pack-field-label">Qty</span><input className="pack-field-input" value={item.qty||"1"} onChange={e=>upd(item.id,"qty",e.target.value)}/></div>
            {item.type==="Weapon"&&<>
              <div className="pack-field"><span className="pack-field-label">Damage</span><input className="pack-field-input" placeholder="1d8" value={item.damage||""} onChange={e=>upd(item.id,"damage",e.target.value)}/></div>
              <div className="pack-field"><span className="pack-field-label">Type</span><input className="pack-field-input" placeholder="Slashing" value={item.damageType||""} onChange={e=>upd(item.id,"damageType",e.target.value)}/></div>
              <div className="pack-field"><span className="pack-field-label">To Hit</span><input className="pack-field-input" type="number" value={item.modifier||""} onChange={e=>upd(item.id,"modifier",e.target.value)}/></div>
            </>}
            {["Spell Scroll","Wondrous Item","Consumable"].includes(item.type)&&<>
              <div className="pack-field"><span className="pack-field-label">Charges</span><input className="pack-field-input" value={item.charges||""} onChange={e=>upd(item.id,"charges",e.target.value)}/></div>
              <div className="pack-field" style={{flex:2}}><span className="pack-field-label">Effect</span><input className="pack-field-input" value={item.effect||""} onChange={e=>upd(item.id,"effect",e.target.value)}/></div>
            </>}
          </div>
          <div className="pack-field"><span className="pack-field-label">Notes</span><input className="pack-field-input" value={item.note||""} placeholder="Notes…" onChange={e=>upd(item.id,"note",e.target.value)}/></div>
          <div className="row" style={{justifyContent:"flex-end",marginTop:"0.3rem"}}><button className="btn-ghost" onClick={()=>del(item.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ SKILLS TAB (Skill / Trait / Feat only, + in-use) ═ */
function SkillsTab({skills,setSkills}) {
  const [form,setForm]=useState({name:"",category:"Skill",description:"",level:0});
  const [showForm,setShowForm]=useState(false);
  const [expanded,setExpanded]=useState({});
  const [activeTag,setActiveTag]=useState(null);
  const [activeCat,setActiveCat]=useState(null);
  const allTags=[...new Set(skills.flatMap(s=>s.tags||[]))].sort();
  const addSkill=()=>{const n=form.name.trim();if(!n)return;setSkills(l=>[...l,{id:Date.now(),name:n,category:form.category,description:form.description.trim(),level:form.level,tags:[],pinned:false,inUse:false}]);setForm({name:"",category:"Skill",description:"",level:0});setShowForm(false);};
  const upd=(id,f,v)=>setSkills(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setSkills(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const toggleInUse=id=>setSkills(l=>l.map(x=>x.id===id?{...x,inUse:!x.inUse}:x));
  const visible=skills.filter(s=>(!activeTag||(s.tags||[]).includes(activeTag))&&(!activeCat||s.category===activeCat)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  const catColor=cat=>({Skill:"#e2b94e",Trait:"#7aaccc",Feat:"#cc8844"})[cat]||"#8a7848";
  const inUseCount=skills.filter(s=>s.inUse).length;
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#8a7040"}}>{skills.length} entries{inUseCount>0?` · ${inUseCount} active`:""}</span>
      <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Entry"}</button>
    </div>
    {showForm&&<div className="add-form">
      <div className="col">
        <input className="g-input" placeholder="Name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addSkill()}/>
        <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>{SKILL_CATS.map(c=><button key={c} className="filter-tag" style={{opacity:form.category===c?1:0.45,borderColor:form.category===c?catColor(c)+"88":"",color:form.category===c?catColor(c):""}} onClick={()=>setForm(f=>({...f,category:c}))}>{c}</button>)}</div>
        <div className="row" style={{gap:"0.6rem"}}><span style={{fontFamily:"Cinzel,serif",fontSize:"0.58rem",color:"#8a7040",textTransform:"uppercase",letterSpacing:"0.12em"}}>Mastery</span><SkillPips value={form.level} onChange={v=>setForm(f=>({...f,level:v}))}/></div>
        <textarea className="g-textarea" rows={3} placeholder="Description, effect, source, prerequisites…" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
        <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addSkill}>⊕ Add</button></div>
      </div>
    </div>}
    <div className="filter-bar">
      <button className={`filter-tag${!activeCat?" active-filter":""}`} onClick={()=>setActiveCat(null)}>All</button>
      {SKILL_CATS.map(c=>{const count=skills.filter(s=>s.category===c).length;if(!count)return null;return<button key={c} className={`filter-tag${activeCat===c?" active-filter":""}`} style={{borderColor:activeCat===c?catColor(c)+"88":"",color:activeCat===c?catColor(c):""}} onClick={()=>setActiveCat(activeCat===c?null:c)}>{c} ({count})</button>;})}
    </div>
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
    {skills.length===0&&<div className="card empty-state">No skills, traits or feats recorded.<br/><span style={{fontSize:"0.62rem"}}>Add your first entry above.</span></div>}
    {visible.map(sk=>{const open=!!expanded[sk.id];const cc=catColor(sk.category);return(
      <div key={sk.id} className={`card${sk.pinned?" pinned":""}${sk.inUse?" inuse-active":""}`} style={{padding:"1rem 1.1rem",borderLeftColor:cc+"55",borderLeftWidth:2}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap:"0.5rem",marginBottom:"0.25rem",flexWrap:"wrap"}}>
              <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.98rem",color:"#e0d6b4",fontWeight:700}} value={sk.name} onChange={e=>upd(sk.id,"name",e.target.value)} placeholder="Name…"/>
              <span style={{fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.1em",textTransform:"uppercase",color:cc,border:`1px solid ${cc}55`,padding:"0.15rem 0.5rem",background:`${cc}0d`,flexShrink:0}}>{sk.category}</span>
            </div>
            {sk.level>0&&<SkillPips value={sk.level} onChange={v=>upd(sk.id,"level",v)}/>}
          </div>
          <Toggle on={!!sk.inUse} onToggle={()=>toggleInUse(sk.id)} label={sk.inUse?"Active":"Inactive"} color="purple"/>
          <PinBtn pinned={sk.pinned} onToggle={()=>upd(sk.id,"pinned",!sk.pinned)}/>
          <button className="entity-toggle" onClick={()=>toggle(sk.id)}>{open?"▲":"▼"}</button>
        </div>
        {!open&&sk.description&&<p style={{fontSize:"0.92rem",color:"#9a8a68",fontStyle:"italic",marginTop:"0.3rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sk.description}</p>}
        <TagsEditor tags={sk.tags||[]} onChange={v=>upd(sk.id,"tags",v)}/>
        {open&&<div style={{marginTop:"0.8rem"}}>
          <div className="row" style={{gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>{SKILL_CATS.map(c=><button key={c} className="filter-tag" style={{opacity:sk.category===c?1:0.4,borderColor:sk.category===c?catColor(c)+"88":"",color:sk.category===c?catColor(c):""}} onClick={()=>upd(sk.id,"category",c)}>{c}</button>)}</div>
          <div className="row" style={{gap:"0.6rem",marginBottom:"0.7rem"}}><span style={{fontFamily:"Cinzel,serif",fontSize:"0.58rem",color:"#8a7040",textTransform:"uppercase",letterSpacing:"0.12em"}}>Mastery</span><SkillPips value={sk.level} onChange={v=>upd(sk.id,"level",v)}/></div>
          <textarea className="g-textarea" rows={4} placeholder="Description, effect, source, requirements…" value={sk.description||""} onChange={e=>upd(sk.id,"description",e.target.value)}/>
          <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(sk.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ SPELLS TAB ════════════════════════════════ */
function SpellsTab({spells,setSpells,char,setChar}) {
  const [form,setForm]=useState({name:"",level:"Cantrip",school:"Evocation",castingTime:"1 action",range:"",duration:"",components:"",description:"",notes:""});
  const [showForm,setShowForm]=useState(false);
  const [expanded,setExpanded]=useState({});
  const [activeLevel,setActiveLevel]=useState(null);
  const [showSlots,setShowSlots]=useState(false);

  const addSpell=()=>{const n=form.name.trim();if(!n)return;setSpells(l=>[...l,{id:Date.now(),...form,name:n,tags:[],pinned:false,inUse:false}]);setForm({name:"",level:"Cantrip",school:"Evocation",castingTime:"1 action",range:"",duration:"",components:"",description:"",notes:""});setShowForm(false);};
  const upd=(id,f,v)=>setSpells(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setSpells(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const toggleInUse=id=>setSpells(l=>l.map(x=>x.id===id?{...x,inUse:!x.inUse}:x));

  // Spell slots management
  const updSlot=(lvl,field,val)=>setChar(c=>({...c,spellSlots:{...(c.spellSlots||{}),[lvl]:{...((c.spellSlots||{})[lvl]||{max:0,used:0}),[field]:parseInt(val)||0}}}));
  const slots=char.spellSlots||{};

  const visible=activeLevel?spells.filter(s=>s.level===activeLevel):spells;
  const levelColor=lv=>lv==="Cantrip"?"#8aaccc":"#9a6acc";
  const inUseCount=spells.filter(s=>s.inUse).length;

  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#5a8ab0"}}>{spells.length} spells known{inUseCount>0?` · ${inUseCount} prepared`:""}</span>
      <div className="row" style={{gap:"0.5rem"}}>
        <button className="btn-sm" style={{borderColor:"#1a4a8a",color:"#64a0e6"}} onClick={()=>setShowSlots(s=>!s)}>{showSlots?"✕ Slots":"⚙ Slots"}</button>
        <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Spell"}</button>
      </div>
    </div>

    {/* Spell slots tracker */}
    {showSlots&&<div className="card" style={{borderColor:"#1a3a6a"}}>
      <div className="sect-label" style={{color:"#64a0e6"}}>Spell Slots</div>
      <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.7rem",flexWrap:"wrap"}}>
        <span style={{fontFamily:"Cinzel,serif",fontSize:"0.54rem",letterSpacing:"0.14em",color:"#4a7aaa",textTransform:"uppercase"}}>Spellcasting Ability</span>
        <select className="g-select" style={{width:"auto",fontSize:"0.82rem",padding:"0.25rem 0.5rem",borderColor:"#1a3a6a"}} value={char.spellcastingAbility||"INT"} onChange={e=>setChar(c=>({...c,spellcastingAbility:e.target.value}))}>
          {STAT_KEYS.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{fontFamily:"Cinzel,serif",fontSize:"0.72rem",color:"#64a0e6"}}>
          DC {8+(char.profBonus||2)+Math.floor(((char.stats||{})[char.spellcastingAbility||"INT"]||10)-10)/2} · Attack {numMod((char.profBonus||2)+Math.floor(((char.stats||{})[char.spellcastingAbility||"INT"]||10)-10)/2)}
        </span>
      </div>
      <div className="spell-slot-grid">
        {SPELL_SLOT_LABELS.map(lv=>{
          const sl=slots[lv]||{max:0,used:0};
          return <div key={lv} className="spell-slot-box">
            <span className="spell-slot-label">{lv}</span>
            <div className="row" style={{justifyContent:"center",gap:"0.2rem"}}>
              <input className="spell-slot-input" type="number" min={0} max={sl.max||0} value={sl.used||0} onChange={e=>updSlot(lv,"used",e.target.value)} style={{width:28,fontSize:"0.9rem"}}/>
              <span style={{color:"#2a5a8a",fontSize:"0.7rem"}}>/</span>
              <input className="spell-slot-input" type="number" min={0} value={sl.max||0} onChange={e=>updSlot(lv,"max",e.target.value)} style={{width:28,fontSize:"0.9rem",color:"#4a7aaa"}}/>
            </div>
          </div>;
        })}
      </div>
    </div>}

    {/* Add spell form */}
    {showForm&&<div className="add-form" style={{borderColor:"#1a3a6a"}}>
      <div className="col">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
          <input className="g-input" placeholder="Spell name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addSpell()}/>
          <select className="g-select" value={form.school} onChange={e=>setForm(f=>({...f,school:e.target.value}))}>{SPELL_SCHOOLS.map(s=><option key={s} value={s}>{s}</option>)}</select>
        </div>
        <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>
          {SPELL_LEVELS.map(lv=><button key={lv} className="filter-tag" style={{opacity:form.level===lv?1:0.45,borderColor:form.level===lv?"#1a5a9a":"",color:form.level===lv?"#64a0e6":""}} onClick={()=>setForm(f=>({...f,level:lv}))}>{lv}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.5rem"}}>
          <div className="pack-field"><span className="pack-field-label">Casting Time</span><input className="pack-field-input" placeholder="1 action" value={form.castingTime} onChange={e=>setForm(f=>({...f,castingTime:e.target.value}))}/></div>
          <div className="pack-field"><span className="pack-field-label">Range</span><input className="pack-field-input" placeholder="60 ft" value={form.range} onChange={e=>setForm(f=>({...f,range:e.target.value}))}/></div>
          <div className="pack-field"><span className="pack-field-label">Duration</span><input className="pack-field-input" placeholder="Instantaneous" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))}/></div>
        </div>
        <input className="g-input" placeholder="Components (V, S, M — material…)" value={form.components} onChange={e=>setForm(f=>({...f,components:e.target.value}))}/>
        <textarea className="g-textarea" rows={3} placeholder="Spell description and effects…" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
        <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addSpell}>⊕ Add Spell</button></div>
      </div>
    </div>}

    {/* Level filter */}
    <div className="filter-bar">
      <button className={`filter-tag${!activeLevel?" active-filter":""}`} onClick={()=>setActiveLevel(null)}>All</button>
      {SPELL_LEVELS.map(lv=>{const count=spells.filter(s=>s.level===lv).length;if(!count)return null;return<button key={lv} className={`filter-tag${activeLevel===lv?" active-filter":""}`} style={{borderColor:activeLevel===lv?"#1a5a9a":"",color:activeLevel===lv?"#64a0e6":""}} onClick={()=>setActiveLevel(activeLevel===lv?null:lv)}>{lv} ({count})</button>;})}
    </div>

    {spells.length===0&&<div className="card empty-state">No spells recorded.<br/><span style={{fontSize:"0.62rem"}}>Add your first spell above.</span></div>}

    {visible.map(sp=>{const open=!!expanded[sp.id];return(
      <div key={sp.id} className={`card${sp.pinned?" pinned":""}${sp.inUse?" spell-active":""}`} style={{padding:"1rem 1.1rem",borderLeftColor:"#1a4a8a",borderLeftWidth:2}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap:"0.5rem",marginBottom:"0.3rem",flexWrap:"wrap"}}>
              <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.98rem",color:"#c8d8f0",fontWeight:700}} value={sp.name} onChange={e=>upd(sp.id,"name",e.target.value)} placeholder="Spell name…"/>
              <span className="spell-level-badge">{sp.level}</span>
              {sp.school&&<span className="spell-school-badge">{sp.school}</span>}
            </div>
            {!open&&<div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.08em",color:"#4a7aaa"}}>
              {[sp.castingTime,sp.range&&`Range: ${sp.range}`,sp.duration&&`Duration: ${sp.duration}`].filter(Boolean).join(" · ")}
            </div>}
          </div>
          <Toggle on={!!sp.inUse} onToggle={()=>toggleInUse(sp.id)} label={sp.inUse?"Prepared":"Known"} color="blue"/>
          <PinBtn pinned={sp.pinned} onToggle={()=>upd(sp.id,"pinned",!sp.pinned)}/>
          <button className="entity-toggle" onClick={()=>toggle(sp.id)}>{open?"▲":"▼"}</button>
        </div>
        {!open&&sp.description&&<p style={{fontSize:"0.9rem",color:"#7a9abb",fontStyle:"italic",marginTop:"0.3rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sp.description}</p>}
        <TagsEditor tags={sp.tags||[]} onChange={v=>upd(sp.id,"tags",v)}/>
        {open&&<div style={{marginTop:"0.8rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.7rem"}}>
            <div><span style={{fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.12em",color:"#4a7aaa",textTransform:"uppercase",display:"block",marginBottom:"0.2rem"}}>Level</span>
              <select className="g-select" style={{fontSize:"0.82rem",padding:"0.25rem 0.5rem",borderColor:"#1a3a6a"}} value={sp.level} onChange={e=>upd(sp.id,"level",e.target.value)}>{SPELL_LEVELS.map(lv=><option key={lv} value={lv}>{lv}</option>)}</select>
            </div>
            <div><span style={{fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.12em",color:"#4a7aaa",textTransform:"uppercase",display:"block",marginBottom:"0.2rem"}}>School</span>
              <select className="g-select" style={{fontSize:"0.82rem",padding:"0.25rem 0.5rem",borderColor:"#1a3a6a"}} value={sp.school} onChange={e=>upd(sp.id,"school",e.target.value)}>{SPELL_SCHOOLS.map(s=><option key={s} value={s}>{s}</option>)}</select>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.5rem",marginBottom:"0.7rem"}}>
            <div className="pack-field"><span className="pack-field-label">Casting Time</span><input className="pack-field-input" value={sp.castingTime||""} onChange={e=>upd(sp.id,"castingTime",e.target.value)}/></div>
            <div className="pack-field"><span className="pack-field-label">Range</span><input className="pack-field-input" value={sp.range||""} onChange={e=>upd(sp.id,"range",e.target.value)}/></div>
            <div className="pack-field"><span className="pack-field-label">Duration</span><input className="pack-field-input" value={sp.duration||""} onChange={e=>upd(sp.id,"duration",e.target.value)}/></div>
          </div>
          <div className="pack-field" style={{marginBottom:"0.6rem"}}><span className="pack-field-label">Components</span><input className="pack-field-input" value={sp.components||""} placeholder="V, S, M (material)" onChange={e=>upd(sp.id,"components",e.target.value)}/></div>
          <textarea className="g-textarea" rows={4} placeholder="Spell description and effects…" value={sp.description||""} onChange={e=>upd(sp.id,"description",e.target.value)}/>
          {/* Notes / upcast */}
          <div style={{marginTop:"0.5rem"}}>
            <span style={{fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.12em",color:"#4a7aaa",textTransform:"uppercase",display:"block",marginBottom:"0.25rem"}}>At Higher Levels / Notes</span>
            <textarea className="g-textarea" rows={2} placeholder="When cast using a higher level slot…" value={sp.notes||""} onChange={e=>upd(sp.id,"notes",e.target.value)}/>
          </div>
          <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(sp.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ NPC TRACKER ══════════════════════════════ */
function NPCTracker({npcs,setNPCs}) {
  const [formState,setForm]=useState({name:"",role:"",relation:"unknown",affiliation:"",metAt:"",connections:"",notes:""});
  const [showForm,setShowForm]=useState(false); const [expanded,setExpanded]=useState({}); const [activeTag,setActiveTag]=useState(null);
  const allTags=[...new Set(npcs.flatMap(n=>n.tags||[]))].sort();
  const addNPC=()=>{const n=formState.name.trim();if(!n)return;setNPCs(l=>[...l,{id:Date.now(),...formState,name:n,tags:[],pinned:false}]);setForm({name:"",role:"",relation:"unknown",affiliation:"",metAt:"",connections:"",notes:""});setShowForm(false);};
  const upd=(id,f,v)=>setNPCs(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setNPCs(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const cycleRel=id=>setNPCs(l=>l.map(x=>x.id===id?{...x,relation:REL_CYCLE[x.relation||"unknown"]}:x));
  const visible=npcs.filter(n=>!activeTag||(n.tags||[]).includes(activeTag)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#8a7040"}}>{npcs.length} {npcs.length===1?"character":"characters"} known</span>
      <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add NPC"}</button>
    </div>
    {showForm&&<div className="add-form"><div className="col">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
        <input className="g-input" placeholder="Name…" value={formState.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addNPC()}/>
        <input className="g-input" placeholder="Role / occupation…" value={formState.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}/>
        <input className="g-input" placeholder="Affiliation…" value={formState.affiliation} onChange={e=>setForm(f=>({...f,affiliation:e.target.value}))}/>
        <input className="g-input" placeholder="First met at…" value={formState.metAt} onChange={e=>setForm(f=>({...f,metAt:e.target.value}))}/>
      </div>
      <input className="g-input" placeholder="Connections…" value={formState.connections} onChange={e=>setForm(f=>({...f,connections:e.target.value}))}/>
      <div className="row" style={{gap:"0.5rem",flexWrap:"wrap"}}>{["unknown","ally","neutral","hostile"].map(r=><button key={r} className={`rel-badge rel-${r}`} style={{opacity:formState.relation===r?1:0.45}} onClick={()=>setForm(f=>({...f,relation:r}))}>{REL_LABELS[r]}</button>)}</div>
      <textarea className="g-textarea" rows={3} placeholder="Notes…" value={formState.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
      <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addNPC}>⊕ Add</button></div>
    </div></div>}
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
    {npcs.length===0&&<div className="card empty-state">No characters recorded.</div>}
    {visible.map(npc=>{const open=!!expanded[npc.id];const rel=npc.relation||"unknown";return(
      <div key={npc.id} className={`card${npc.pinned?" pinned":""}`} style={{padding:"1rem 1.1rem"}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap:"0.5rem",marginBottom:"0.25rem",flexWrap:"wrap"}}>
              <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"1rem",color:"#e0d6b4",fontWeight:700}} value={npc.name} onChange={e=>upd(npc.id,"name",e.target.value)} placeholder="Name…"/>
              <span className={`rel-badge rel-${rel}`} onClick={()=>cycleRel(npc.id)}>{REL_LABELS[rel]}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.25rem 0.6rem"}}>
              <input className="iedit" style={{fontSize:"0.88rem",color:"#9a8050",fontStyle:"italic"}} value={npc.role||""} onChange={e=>upd(npc.id,"role",e.target.value)} placeholder="Role…"/>
              <input className="iedit" style={{fontSize:"0.88rem",color:"#9a8050"}} value={npc.affiliation||""} onChange={e=>upd(npc.id,"affiliation",e.target.value)} placeholder="Affiliation…"/>
              <input className="iedit" style={{fontSize:"0.85rem",color:"#7a6840"}} value={npc.metAt||""} onChange={e=>upd(npc.id,"metAt",e.target.value)} placeholder="First met at…"/>
              <input className="iedit" style={{fontSize:"0.85rem",color:"#7a6840"}} value={npc.connections||""} onChange={e=>upd(npc.id,"connections",e.target.value)} placeholder="Connections…"/>
            </div>
          </div>
          <PinBtn pinned={npc.pinned} onToggle={()=>upd(npc.id,"pinned",!npc.pinned)}/>
          <button className="entity-toggle" onClick={()=>toggle(npc.id)}>{open?"▲":"▼"}</button>
        </div>
        <TagsEditor tags={npc.tags||[]} onChange={v=>upd(npc.id,"tags",v)}/>
        {open&&<div style={{marginTop:"0.8rem"}}>
          <textarea className="g-textarea" rows={4} placeholder="Known facts, personality, secrets…" value={npc.notes||""} onChange={e=>upd(npc.id,"notes",e.target.value)}/>
          <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(npc.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ LOCATIONS ════════════════════════════════ */
function Locations({locations,setLocations}) {
  const [form,setForm]=useState({name:"",type:"Settlement",notes:""});
  const [showForm,setShowForm]=useState(false); const [expanded,setExpanded]=useState({}); const [activeTag,setActiveTag]=useState(null);
  const allTags=[...new Set(locations.flatMap(l=>l.tags||[]))].sort();
  const addLoc=()=>{const n=form.name.trim();if(!n)return;setLocations(l=>[...l,{id:Date.now(),name:n,type:form.type,notes:form.notes.trim(),tags:[],pinned:false}]);setForm({name:"",type:"Settlement",notes:""});setShowForm(false);};
  const upd=(id,f,v)=>setLocations(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setLocations(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const visible=locations.filter(l=>!activeTag||(l.tags||[]).includes(activeTag)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#8a7040"}}>{locations.length} {locations.length===1?"location":"locations"} mapped</span>
      <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Location"}</button>
    </div>
    {showForm&&<div className="add-form"><div className="col">
      <input className="g-input" placeholder="Location name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addLoc()}/>
      <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>{LOC_TYPES.map(t=><button key={t} className="filter-tag" style={{opacity:form.type===t?1:0.45,borderColor:form.type===t?"#8a6830":"",color:form.type===t?"#e2b94e":""}} onClick={()=>setForm(f=>({...f,type:t}))}>{t}</button>)}</div>
      <textarea className="g-textarea" rows={3} placeholder="Description, atmosphere, notable features…" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
      <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addLoc}>⊕ Add</button></div>
    </div></div>}
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
    {locations.length===0&&<div className="card empty-state">No locations recorded.</div>}
    {visible.map(loc=>{const open=!!expanded[loc.id];return(
      <div key={loc.id} className={`card${loc.pinned?" pinned":""}`} style={{padding:"1rem 1.1rem"}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap:"0.5rem",marginBottom:"0.25rem"}}>
              <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"1rem",color:"#e0d6b4",fontWeight:700}} value={loc.name} onChange={e=>upd(loc.id,"name",e.target.value)} placeholder="Location name…"/>
              <span className="loc-type">{loc.type}</span>
            </div>
          </div>
          <PinBtn pinned={loc.pinned} onToggle={()=>upd(loc.id,"pinned",!loc.pinned)}/>
          <button className="entity-toggle" onClick={()=>toggle(loc.id)}>{open?"▲":"▼"}</button>
        </div>
        <TagsEditor tags={loc.tags||[]} onChange={v=>upd(loc.id,"tags",v)}/>
        {open&&<div style={{marginTop:"0.8rem"}}>
          <div className="row" style={{gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.7rem"}}>{LOC_TYPES.map(t=><button key={t} className="filter-tag" style={{opacity:loc.type===t?1:0.4,borderColor:loc.type===t?"#8a6830":"",color:loc.type===t?"#e2b94e":""}} onClick={()=>upd(loc.id,"type",t)}>{t}</button>)}</div>
          <textarea className="g-textarea" rows={4} placeholder="Geography, atmosphere, notable features, dangers…" value={loc.notes||""} onChange={e=>upd(loc.id,"notes",e.target.value)}/>
          <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(loc.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ SESSION LOG ═══════════════════════════════ */
function SessionLog({sessions,setSessions,npcs,locations,quests,inventory,skills,onNavigate}) {
  const [openIds,setOpenIds]=useState({}); const [editingId,setEditingId]=useState(null);
  const addSession=()=>{const e={id:Date.now(),number:sessions.length+1,date:today(),title:`Session ${sessions.length+1}`,notes:""};setSessions(s=>[e,...s]);setOpenIds(o=>({...o,[e.id]:true}));setEditingId(e.id);};
  const upd=(id,f,v)=>setSessions(s=>s.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>{setSessions(s=>s.filter(x=>x.id!==id));if(editingId===id)setEditingId(null);};
  const toggle=id=>{setOpenIds(o=>({...o,[id]:!o[id]}));if(!openIds[id])setEditingId(null);};
  const hasAny=npcs.length||locations.length||quests.length||inventory.length||skills.length;
  const hasNotes=sessions.some(s=>s.notes);
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#8a7040"}}>{sessions.length} {sessions.length===1?"session":"sessions"} recorded</span>
      <button className="btn-gold" onClick={addSession}>⊕ New Session</button>
    </div>
    {hasAny&&hasNotes&&<div className="sess-legend">
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",letterSpacing:"0.1em",color:"#6a5838",textTransform:"uppercase"}}>Tap to jump →</span>
      {LEGEND_ITEMS.map(li=>{const counts={npc:npcs.length,location:locations.length,quest:quests.length,inventory:inventory.length,skill:skills.length};if(!counts[li.type])return null;return<div key={li.type} className="sess-legend-item"><div className="legend-dot" style={{background:li.color,border:`1px solid ${li.border}`}}/><span style={{color:li.border}}>{li.label}</span></div>;})}
    </div>}
    {sessions.length===0&&<div className="card empty-state">No chronicles written yet.</div>}
    {sessions.map(sess=>{
      const open=!!openIds[sess.id]; const editing=editingId===sess.id;
      const parsed=parseEntityLinks(sess.notes,npcs,locations,quests,inventory,skills,onNavigate);
      return <div key={sess.id} className="sess-entry">
        <div className={`sess-header${open?" open":""}`} onClick={()=>toggle(sess.id)}>
          <span className="sess-num">#{String(sess.number).padStart(2,"0")}</span>
          <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.92rem",color:"#ddd5bb"}} value={sess.title} onChange={e=>{e.stopPropagation();upd(sess.id,"title",e.target.value);}} onClick={e=>e.stopPropagation()}/>
          <input type="date" style={{background:"transparent",border:"none",color:"#8a7040",fontFamily:"inherit",fontSize:"0.75rem",outline:"none",flexShrink:0}} value={sess.date} onChange={e=>{e.stopPropagation();upd(sess.id,"date",e.target.value);}} onClick={e=>e.stopPropagation()}/>
          <span style={{color:open?"#e2b94e":"#4a3a20",fontSize:"0.65rem",flexShrink:0}}>{open?"▲":"▼"}</span>
        </div>
        {open&&<div className="sess-body">
          {editing?<>
            <textarea className="g-textarea" rows={6} autoFocus placeholder="Write your session notes… named entities become coloured links." value={sess.notes} onChange={e=>upd(sess.id,"notes",e.target.value)}/>
            <div className="row mt05" style={{justifyContent:"space-between"}}>
              <button className="btn-ghost" onClick={()=>del(sess.id)}>Expunge Record</button>
              <button className="btn-gold" onClick={()=>setEditingId(null)}>✓ Done</button>
            </div>
          </>:<>
            <div className="sess-rendered" data-placeholder="No notes yet — tap to write…" onClick={()=>setEditingId(sess.id)}>{sess.notes?parsed:null}</div>
            <div className="row mt05" style={{justifyContent:"space-between"}}>
              <button className="btn-ghost" onClick={()=>del(sess.id)}>Expunge Record</button>
              <button className="btn-ghost" style={{borderColor:"#5a4a28",color:"#9a8050"}} onClick={()=>setEditingId(sess.id)}>✎ Edit</button>
            </div>
          </>}
        </div>}
      </div>;
    })}
  </>;
}

/* ═══ QUEST TRACKER ════════════════════════════ */
function QuestTracker({quests,setQuests}) {
  const [name,setName]=useState(""); const [desc,setDesc]=useState(""); const [reward,setReward]=useState("");
  const [expanded,setExpanded]=useState({});
  const addQuest=()=>{const n=name.trim();if(!n)return;setQuests(q=>[...q,{id:Date.now(),name:n,description:desc.trim(),reward:reward.trim(),status:"Active",steps:[]}]);setName("");setDesc("");setReward("");};
  const cycle=id=>setQuests(q=>q.map(x=>x.id===id?{...x,status:STATUS_CYCLE[x.status]}:x));
  const del=id=>setQuests(q=>q.filter(x=>x.id!==id));
  const upd=(id,f,v)=>setQuests(q=>q.map(x=>x.id===id?{...x,[f]:v}:x));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const addStep=id=>setQuests(q=>q.map(x=>x.id===id?{...x,steps:[...(x.steps||[]),{id:Date.now(),text:"",done:false}]}:x));
  const updStep=(id,sid,f,v)=>setQuests(q=>q.map(x=>x.id===id?{...x,steps:(x.steps||[]).map(s=>s.id===sid?{...s,[f]:v}:s)}:x));
  const delStep=(id,sid)=>setQuests(q=>q.map(x=>x.id===id?{...x,steps:(x.steps||[]).filter(s=>s.id!==sid)}:x));
  return <>
    <div className="card">
      <div className="sect-label">Issue New Mandate</div>
      <div className="col">
        <input className="g-input" placeholder="Quest name…" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addQuest()}/>
        <input className="g-input" placeholder="Brief description…" value={desc} onChange={e=>setDesc(e.target.value)}/>
        <input className="g-input" placeholder="Reward (gold, items, XP…)" value={reward} onChange={e=>setReward(e.target.value)}/>
        <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addQuest}>⊕ Add Quest</button></div>
      </div>
    </div>
    {quests.length===0&&<div className="card empty-state">No mandates issued.</div>}
    {["Active","Completed","Failed"].map(status=>{
      const filtered=quests.filter(q=>q.status===status); if(!filtered.length)return null;
      const lc=status==="Active"?"#e2b94e":status==="Completed"?"#6acc6a":"#cc4444";
      return <div key={status} style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
        <div className="sect-label" style={{color:lc}}>{status} <span style={{color:"#4a3a20"}}>({filtered.length})</span></div>
        {filtered.map(quest=>{const open=!!expanded[quest.id];const steps=quest.steps||[];const doneCount=steps.filter(s=>s.done).length;
          return <div key={quest.id} className={`quest-entry ${status.toLowerCase()}`}>
            <div className="row" style={{alignItems:"flex-start"}}>
              <div className="flex1">
                <div className="row" style={{marginBottom:"0.3rem",flexWrap:"wrap",gap:"0.4rem"}}>
                  <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.95rem",color:"#e0d6b4",fontWeight:700}} value={quest.name} onChange={e=>upd(quest.id,"name",e.target.value)} placeholder="Quest name…"/>
                  <span className={`badge ${status.toLowerCase()}`} onClick={()=>cycle(quest.id)}>{status}</span>
                </div>
                <input className="iedit" style={{fontSize:"0.92rem",color:"#9a8050",fontStyle:"italic"}} value={quest.description||""} onChange={e=>upd(quest.id,"description",e.target.value)} placeholder="Description…"/>
                {quest.reward&&<div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.1em",color:"#6acc6a",marginTop:"0.3rem"}}>⭐ {quest.reward}</div>}
                {steps.length>0&&<div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.08em",color:"#7a6840",marginTop:"0.2rem"}}>{doneCount}/{steps.length} steps</div>}
              </div>
              <button className="entity-toggle" onClick={()=>toggle(quest.id)} style={{marginTop:"0.1rem"}}>{open?"▲":"▼"}</button>
              <button onClick={()=>del(quest.id)} style={{background:"transparent",border:"none",color:"#4a3a2a",cursor:"pointer",fontSize:"0.85rem",padding:"0.1rem 0.2rem",transition:"color 0.15s",flexShrink:0}} onMouseEnter={e=>e.currentTarget.style.color="#c04040"} onMouseLeave={e=>e.currentTarget.style.color="#4a3a2a"}>✕</button>
            </div>
            {open&&<div style={{marginTop:"0.7rem"}}>
              {steps.map(step=><div key={step.id} className="checklist-item">
                <div className={`check-box${step.done?" checked":""}`} onClick={()=>updStep(quest.id,step.id,"done",!step.done)}/>
                <input className={`iedit flex1 checklist-text${step.done?" done":""}`} style={{fontSize:"0.92rem",color:step.done?"#5a4a28":"#ccc0a0"}} value={step.text} onChange={e=>updStep(quest.id,step.id,"text",e.target.value)} placeholder="Step description…"/>
                <button style={{background:"transparent",border:"none",color:"#3a2a1a",cursor:"pointer",fontSize:"0.75rem",transition:"color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.color="#c04040"} onMouseLeave={e=>e.currentTarget.style.color="#3a2a1a"} onClick={()=>delStep(quest.id,step.id)}>✕</button>
              </div>)}
              <div className="row mt05" style={{justifyContent:"space-between",alignItems:"flex-end"}}>
                <button className="btn-sm" onClick={()=>addStep(quest.id)}>+ Step</button>
                <div style={{display:"flex",flexDirection:"column",gap:"0.1rem"}}>
                  <span style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",letterSpacing:"0.1em",color:"#6a5830",textTransform:"uppercase"}}>Reward</span>
                  <input className="iedit" style={{fontSize:"0.88rem",color:"#6acc6a",minWidth:120}} value={quest.reward||""} onChange={e=>upd(quest.id,"reward",e.target.value)} placeholder="Gold, items, XP…"/>
                </div>
              </div>
            </div>}
          </div>;
        })}
      </div>;
    })}
  </>;
}

/* ═══ NAV ══════════════════════════════════════ */
const TABS=[
  {id:"character", label:"Hero",    icon:"⚔️"},
  {id:"inventory", label:"Pack",    icon:"🎒"},
  {id:"skills",    label:"Skills",  icon:"✨"},
  {id:"spells",    label:"Spells",  icon:"🔮"},
  {id:"npcs",      label:"People",  icon:"👥"},
  {id:"locations", label:"Places",  icon:"🗺️"},
  {id:"sessions",  label:"Log",     icon:"📜"},
  {id:"quests",    label:"Quests",  icon:"⚡"},
];

/* ═══ ROOT APP ═════════════════════════════════ */
export default function HeroJournal() {
  const [tab,      setTab]      = useState("character");
  const [char,     setChar]     = useState(()=>load("hj_char",      DEFAULT_CHAR));
  const [inventory,setInventory]= useState(()=>load("hj_inventory", []));
  const [npcs,     setNPCs]     = useState(()=>load("hj_npcs",      []));
  const [locations,setLocations]= useState(()=>load("hj_locations", []));
  const [skills,   setSkills]   = useState(()=>load("hj_skills",    []));
  const [spells,   setSpells]   = useState(()=>load("hj_spells",    []));
  const [sessions, setSessions] = useState(()=>load("hj_sessions",  []));
  const [quests,   setQuests]   = useState(()=>load("hj_quests",    []));
  const [showReset,setShowReset]= useState(false);

  useEffect(()=>{save("hj_char",      char);},[char]);
  useEffect(()=>{save("hj_inventory", inventory);},[inventory]);
  useEffect(()=>{save("hj_npcs",      npcs);},[npcs]);
  useEffect(()=>{save("hj_locations", locations);},[locations]);
  useEffect(()=>{save("hj_skills",    skills);},[skills]);
  useEffect(()=>{save("hj_spells",    spells);},[spells]);
  useEffect(()=>{save("hj_sessions",  sessions);},[sessions]);
  useEffect(()=>{save("hj_quests",    quests);},[quests]);

  const handleNavigate=useCallback(t=>setTab(t),[]);

  const handleReset=()=>{
    ALL_KEYS.forEach(k=>localStorage.removeItem(k));
    setChar(DEFAULT_CHAR); setInventory([]); setNPCs([]); setLocations([]);
    setSkills([]); setSpells([]); setSessions([]); setQuests([]);
    setTab("character"); setShowReset(false);
  };

  return <>
    <style>{CSS}</style>
    {showReset&&<ResetModal onConfirm={handleReset} onCancel={()=>setShowReset(false)}/>}
    <div className="hj-root">
      <header className="hj-header">
        <div style={{maxWidth:780,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div className="hj-logo"><span style={{fontSize:"1rem",opacity:0.85}}>⚔</span>Hero Journal</div>
          <button className="btn-danger" style={{fontSize:"0.55rem",padding:"0.2rem 0.55rem",letterSpacing:"0.1em"}} onClick={()=>setShowReset(true)} title="Reset all data">↺ Reset</button>
        </div>
      </header>
      <main className="hj-content">
        {tab==="character" &&<CharacterSheet char={char} setChar={setChar} inventory={inventory} skills={skills} spells={spells}/>}
        {tab==="inventory" &&<Pack inventory={inventory} setInventory={setInventory}/>}
        {tab==="skills"    &&<SkillsTab skills={skills} setSkills={setSkills}/>}
        {tab==="spells"    &&<SpellsTab spells={spells} setSpells={setSpells} char={char} setChar={setChar}/>}
        {tab==="npcs"      &&<NPCTracker npcs={npcs} setNPCs={setNPCs}/>}
        {tab==="locations" &&<Locations locations={locations} setLocations={setLocations}/>}
        {tab==="sessions"  &&<SessionLog sessions={sessions} setSessions={setSessions} npcs={npcs} locations={locations} quests={quests} inventory={inventory} skills={skills} onNavigate={handleNavigate}/>}
        {tab==="quests"    &&<QuestTracker quests={quests} setQuests={setQuests}/>}
      </main>
      <nav className="hj-bottom-nav">
        {TABS.map(t=><button key={t.id} className={`hj-nav-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
          <span className="hj-nav-icon">{t.icon}</span>
          <span className="hj-nav-label">{t.label}</span>
        </button>)}
      </nav>
    </div>
  </>;
}