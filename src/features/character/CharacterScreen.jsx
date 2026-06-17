import { useState, memo } from 'react';
import { useT } from '../../i18n/translations';

import HeroHeaderCard  from './cards/HeroHeaderCard';
import CharCard        from './cards/CharCard';
import SavingThrowsCard from './cards/SavingThrowsCard';
import SkillsCard      from './cards/SkillsCard';
import CombatCard      from './cards/CombatCard';
import EquippedCard    from './cards/EquippedCard';
import { CardHeader, LBL } from './cards/shared';

/* ── Pill input dla pól-tagów (np. języki) ── */
function PillInput({ value, onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const pills = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

  const add = text => {
    const t = text.trim();
    if (!t) return;
    onChange([...pills, t].join(', '));
    setDraft('');
  };
  const remove = i => onChange(pills.filter((_, idx) => idx !== i).join(', '));

  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem', alignItems:'center', minHeight:'1.8rem', marginTop:'0.2rem' }}>
      {pills.map((p, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:'0.2rem',
          fontFamily:'Cinzel,serif', fontSize:'0.5rem', letterSpacing:'0.08em',
          textTransform:'uppercase', padding:'0.2rem 0.5rem 0.2rem 0.65rem',
          border:'1px solid var(--hj-accent-border)', color:'var(--hj-accent)',
          borderRadius:'var(--radius-pill)' }}>
          {p}
          <button onClick={() => remove(i)}
            style={{ background:'none', border:'none', color:'inherit', cursor:'pointer',
                     padding:0, lineHeight:1, opacity:0.65, fontSize:'1em', display:'flex' }}>
            ×
          </button>
        </span>
      ))}
      <input value={draft} onChange={e => setDraft(e.target.value)}
        placeholder={pills.length === 0 ? placeholder : ''}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(draft); }
          if (e.key === 'Backspace' && !draft && pills.length) remove(pills.length - 1);
        }}
        onBlur={() => { if (draft.trim()) add(draft); }}
        style={{ fontFamily:'Cinzel,serif', fontSize:'0.5rem', letterSpacing:'0.06em',
                 background:'transparent', border:'none',
                 borderBottom:'1px dashed var(--hj-border-input)',
                 outline:'none', minWidth:'70px', color:'inherit', padding:'0.1rem 0.1rem' }}/>
    </div>
  );
}

function CharacterScreen({ char, setChar, inventory, setInventory, skills, setSkills, spells, setSpells }) {
  const T  = useT();
  const C  = T.CHAR;
  const GENERIC_SKILLS = T.GENERIC_SKILLS;

  const [charOpen,        setCharOpen]     = useState(true);
  const [personalityOpen, setPersonality]  = useState(true);
  const [historyOpen,     setHistoryOpen]  = useState(true);
  const [notesOpen,       setNotesOpen]    = useState(true);
  const [profOpen,        setProfOpen]     = useState(true);

  const pb       = char.profBonus || 2;
  const wisBonus = Math.floor((char.stats.WIS - 10) / 2);
  const percProf = !!(char.skills || {}).perception;
  const percExp  = !!(char.skillExp || {}).perception;
  const percBonus = percExp ? wisBonus + pb*2 : percProf ? wisBonus + pb : wisBonus;
  const spellAbi  = Math.floor(((char.stats||{})[char.spellcastingAbility||"INT"]||10)-10)/2;
  const spellDC   = 8 + pb + spellAbi;

  const upd = (f, v) => setChar(c => ({ ...c, [f]: v }));

  const taStyle = { fontSize:"0.9rem", background:"transparent", border:"none",
                    borderRadius:0, resize:"none", padding:"0.18rem 0",
                    minHeight:"auto", width:"100%", lineHeight:1.55 };

  return (
    <>
      <HeroHeaderCard char={char} C={C}/>

      <div className="char-sheet-grid">

        {/* ══ LEWA KOLUMNA: mechanika ══ */}
        <div className="char-col">
          <SavingThrowsCard char={char} setChar={setChar} C={C} pb={pb}/>

          <SkillsCard char={char} setChar={setChar} C={C}
            GENERIC_SKILLS={GENERIC_SKILLS} pb={pb}/>

          <CombatCard char={char} setChar={setChar} C={C} T={T} pb={pb}/>

          <EquippedCard char={char} setChar={setChar} C={C}
            inventory={inventory} setInventory={setInventory}
            skills={skills} setSkills={setSkills} spells={spells} setSpells={setSpells}/>
        </div>

        {/* ══ PRAWA KOLUMNA: szczegóły postaci ══ */}
        <div className="char-col">

          {/* Biegłości i Języki */}
          <div className="card">
            <CardHeader label={C.profTitle} open={profOpen} onToggle={() => setProfOpen(o => !o)}/>
            {profOpen && (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.55rem 1rem", marginBottom:"0.7rem" }}>
                  {[
                    ["weapons", C.weapons, C.weaponsPh],
                    ["armor",   C.armor,   C.armorPh],
                    ["tools",   C.tools,   C.toolsPh],
                  ].map(([key, label, ph]) => (
                    <div key={key}>
                      <div style={LBL}>{label}</div>
                      <textarea className="g-textarea" rows={2} placeholder={ph}
                        value={(char.proficiencies||{})[key]||""}
                        onChange={e => setChar(c => ({...c, proficiencies:{...(c.proficiencies||{}),[key]:e.target.value}}))}
                        style={taStyle}/>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={LBL}>{C.languages}</div>
                  <PillInput
                    value={(char.proficiencies||{}).languages||""}
                    onChange={v => setChar(c => ({...c, proficiencies:{...(c.proficiencies||{}), languages:v}}))}
                    placeholder={C.languagesPh}/>
                </div>
              </>
            )}
          </div>

          {/* Cechy osobowości */}
          <div className="card">
            <CardHeader label={C.personalityTitle} open={personalityOpen} onToggle={() => setPersonality(o => !o)}/>
            {personalityOpen && (
              <div>
                {[
                  ["personality", C.persTraits, C.persPh],
                  ["ideals",      C.ideals,     C.idealsPh],
                  ["bonds",       C.bonds,      C.bondsPh],
                  ["flaws",       C.flaws,      C.flawsPh],
                ].map(([key, label, ph], i, arr) => (
                  <div key={key} style={{
                    paddingTop: i === 0 ? 0 : "0.5rem",
                    paddingBottom: "0.5rem",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--hj-border-sub)" : "none",
                  }}>
                    <div style={LBL}>{label}</div>
                    <textarea className="g-textarea" rows={2} placeholder={ph}
                      value={char.traits?.[key]||""}
                      onChange={e => setChar(c => ({...c, traits:{...(c.traits||{}),[key]:e.target.value}}))}
                      style={{ ...taStyle, fontSize:"0.92rem" }}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          <CharCard char={char} setChar={setChar} C={C}
            open={charOpen} onToggle={() => setCharOpen(o => !o)}/>

          {/* Notatki osobiste */}
          <div className="card">
            <CardHeader label={C.personalNotes} open={notesOpen} onToggle={() => setNotesOpen(o => !o)}/>
            {notesOpen && (
              <textarea className="g-textarea" rows={3} placeholder={C.personalNotesPh}
                value={char.personalNotes||""} onChange={e => upd("personalNotes", e.target.value)}/>
            )}
          </div>

          {/* Historia postaci */}
          <div className="card">
            <CardHeader label={C.backstory} open={historyOpen} onToggle={() => setHistoryOpen(o => !o)}/>
            {historyOpen && (
              <textarea className="g-textarea" rows={5} placeholder={C.backstoryPh}
                value={char.backstory||""} onChange={e => upd("backstory", e.target.value)}/>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
export default memo(CharacterScreen);
