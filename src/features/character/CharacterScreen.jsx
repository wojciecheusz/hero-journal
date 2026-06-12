import { useState, memo } from 'react';
import { RestModal } from './widgets/RestModal';
import { useT } from '../../i18n/translations';

import HeroHeaderCard  from './cards/HeroHeaderCard';
import CharCard        from './cards/CharCard';
import SavingThrowsCard from './cards/SavingThrowsCard';
import SkillsCard      from './cards/SkillsCard';
import CombatCard      from './cards/CombatCard';
import EquippedCard    from './cards/EquippedCard';
import { CardHeader, LBL } from './cards/shared';

/**
 * Orkiestruje wszystkie karty postaci.
 * Logika każdej karty jest zamknięta w osobnym sub-komponencie w ./cards/.
 */
function CharacterScreen({ char, setChar, inventory, setInventory, skills, setSkills, spells, setSpells }) {
  const T  = useT();
  const C  = T.CHAR;
  const GENERIC_SKILLS = T.GENERIC_SKILLS;

  /* Stany zwijanych kart */
  const [charOpen,        setCharOpen]     = useState(true);
  const [personalityOpen, setPersonality]  = useState(true);
  const [historyOpen,     setHistoryOpen]  = useState(true);
  const [notesOpen,       setNotesOpen]    = useState(true);
  const [profOpen,        setProfOpen]     = useState(true);
  const [restModal,       setRestModal]    = useState(null);

  /* Wyliczenia współdzielone przez kilka kart */
  const pb       = char.profBonus || 2;
  const wisBonus = Math.floor((char.stats.WIS - 10) / 2);
  const percProf = !!(char.skills || {}).perception;
  const percExp  = !!(char.skillExp || {}).perception;
  const percBonus = percExp ? wisBonus + pb*2 : percProf ? wisBonus + pb : wisBonus;
  const spellAbi  = Math.floor(((char.stats||{})[char.spellcastingAbility||"INT"]||10)-10)/2;
  const spellDC   = 8 + pb + spellAbi;

  const upd = (f, v) => setChar(c => ({ ...c, [f]: v }));

  return (
    <>
      {restModal && <RestModal type={restModal} char={char} setChar={setChar} onClose={() => setRestModal(null)}/>}

      <HeroHeaderCard char={char} setChar={setChar} C={C} pb={pb}/>

      <div className="char-sheet-grid">

        {/* ══ LEWA KOLUMNA: mechanika ══ */}
        <div className="char-col">
          <CharCard char={char} setChar={setChar} C={C}
            open={charOpen} onToggle={() => setCharOpen(o => !o)}/>

          <SavingThrowsCard char={char} setChar={setChar} C={C} pb={pb}/>

          <SkillsCard char={char} setChar={setChar} C={C}
            GENERIC_SKILLS={GENERIC_SKILLS} pb={pb}/>

          <CombatCard char={char} setChar={setChar} C={C} T={T}
            pb={pb} percBonus={percBonus} spellAbi={spellAbi} spellDC={spellDC}
            onRestModal={setRestModal}/>
        </div>

        {/* ══ PRAWA KOLUMNA: wyposażenie i osobowość ══ */}
        <div className="char-col">
          <EquippedCard char={char} setChar={setChar} C={C}
            inventory={inventory} setInventory={setInventory}
            skills={skills} setSkills={setSkills} spells={spells} setSpells={setSpells}/>

          {/* Notatki osobiste */}
          <div className="card">
            <CardHeader label={C.personalNotes} open={notesOpen} onToggle={() => setNotesOpen(o => !o)}/>
            {notesOpen && (
              <textarea className="g-textarea" rows={3} placeholder={C.personalNotesPh}
                value={char.personalNotes||""} onChange={e => upd("personalNotes", e.target.value)}/>
            )}
          </div>

          {/* Biegłości i Języki */}
          <div className="card">
            <CardHeader label={C.profTitle} open={profOpen} onToggle={() => setProfOpen(o => !o)}/>
            {profOpen && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                {[
                  ["weapons", C.weapons, C.weaponsPh],
                  ["armor",   C.armor,   C.armorPh],
                  ["languages",C.languages,C.languagesPh],
                  ["tools",   C.tools,   C.toolsPh],
                ].map(([key,label,ph]) => (
                  <div key={key}>
                    <div style={LBL}>{label}</div>
                    <textarea className="g-textarea" rows={2} placeholder={ph}
                      value={(char.proficiencies||{})[key]||""}
                      onChange={e => setChar(c => ({...c, proficiencies:{...(c.proficiencies||{}),[key]:e.target.value}}))}
                      style={{ fontSize:"0.9rem", minHeight:"2.5rem" }}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cechy osobowości */}
          <div className="card">
            <CardHeader label={C.personalityTitle} open={personalityOpen} onToggle={() => setPersonality(o => !o)}/>
            {personalityOpen && (
              <div className="trait-grid">
                {[
                  ["personality",C.persTraits,C.persPh],
                  ["ideals",C.ideals,C.idealsPh],
                  ["bonds",C.bonds,C.bondsPh],
                  ["flaws",C.flaws,C.flawsPh],
                ].map(([key,label,ph]) => (
                  <div key={key} className="trait-block">
                    <span className="trait-label">{label}</span>
                    <textarea className="trait-ta" rows={3} placeholder={ph} value={char.traits?.[key]||""}
                      onChange={e => setChar(c => ({...c, traits:{...(c.traits||{}),[key]:e.target.value}}))}/>
                  </div>
                ))}
              </div>
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

        </div>{/* /prawa kolumna */}
      </div>{/* /char-sheet-grid */}
    </>
  );
}
export default memo(CharacterScreen);
