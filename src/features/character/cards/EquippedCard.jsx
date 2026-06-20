import { useState, useCallback } from 'react';
import { ITEM_ICONS, SKILL_CAT_ICONS, SPELL_SCHOOL_ICONS } from '../../../constants/gameConstants';
import { SpellSlotsWidget } from '../widgets/SpellSlotsWidget';
import { useT } from '../../../i18n/translations';
import Icon from '../../../shared/icons';
import { numMod } from '../../../utils/math';

/* ── Nagłówek pod-sekcji ── */
function SubHeader({ iconName, label, color }) {
  return (
    <div style={{
      padding: "0.45rem 0.75rem 0.4rem",
      borderBottom: "1px solid var(--hj-border-input)",
      display: "flex", alignItems: "center", gap: "0.3rem",
      fontFamily: "Cinzel,serif", fontSize: "0.52rem",
      letterSpacing: "0.12em", textTransform: "uppercase",
      color: color || "var(--hj-text-label)",
    }}>
      <Icon name={iconName || "sparkle"} size="0.8em"/>
      {label}
    </div>
  );
}

/* ── Rozwijany wiersz pozycji ── */
function EquippedRow({ iconName, name, meta, badge, badgeColor, badgeBorder, nameColor, isLast, expandContent }) {
  const [open, setOpen] = useState(false);
  const canExpand = !!expandContent;

  return (
    <div>
      <div
        onClick={() => canExpand && setOpen(o => !o)}
        role={canExpand ? "button" : undefined}
        aria-expanded={canExpand ? open : undefined}
        style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.55rem 0.75rem",
          cursor: canExpand ? "pointer" : "default",
          borderBottom: (!isLast || open) ? "1px solid rgba(128,128,128,0.06)" : "none",
        }}>
        <span style={{ width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"var(--hj-text-label)" }}>
          <Icon name={iconName || "diamond"} size="1em"/>
        </span>
        <span style={{ flex:1, fontFamily:"Cinzel,serif", fontSize:"0.72rem", color:nameColor||"var(--hj-text)", minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {name}
        </span>
        {badge && (
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.44rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.18rem 0.5rem", border:`1px solid ${badgeBorder||"var(--hj-accent-border)"}`, color:badgeColor||"var(--hj-accent)", borderRadius:"var(--radius-pill)", flexShrink:0, whiteSpace:"nowrap" }}>
            {badge}
          </span>
        )}
        {!badge && meta && (
          <span style={{ fontFamily:"'Crimson Text',Georgia,serif", fontSize:"0.8rem", fontStyle:"italic", color:"var(--hj-text-muted)", flexShrink:0, textAlign:"right", maxWidth:"42%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {meta}
          </span>
        )}
        {canExpand && (
          <span style={{ color:"var(--hj-text-dim)", display:"flex", alignItems:"center", flexShrink:0 }}>
            <Icon name={open ? "chevron-up" : "chevron-down"} size="0.75em"/>
          </span>
        )}
      </div>
      {open && (
        <div style={{ padding:"0.45rem 0.75rem 0.5rem 3.85rem", borderBottom:!isLast?"1px solid rgba(128,128,128,0.06)":"none", background:"rgba(255,255,255,0.02)" }}>
          {expandContent}
        </div>
      )}
    </div>
  );
}

const ExpandText = ({ children, muted }) => (
  <p style={{ fontFamily:"'Crimson Text',Georgia,serif", fontSize:"0.88rem", lineHeight:1.5, color:muted?"var(--hj-text-dim)":"var(--hj-text-muted)", margin:"0 0 0.25rem" }}>
    {children}
  </p>
);

export default function EquippedCard({ char, setChar, C, inventory, setInventory, skills, setSkills, spells, setSpells }) {
  const T = useT();
  const LB = T.LABELS;
  const [activeTab, setActiveTab] = useState("items");

  const displaySpellLevel  = level    => LB.spellLevel?.[level]  ?? level;
  const displaySpellSchool = school   => LB.spellSchool?.[school] ?? school;
  const displaySkillCat   = category  => LB.skillCat?.[category]  ?? category;

  const equippedItems = (inventory || []).filter(i => i.equipped);
  const activeSkills  = (skills    || []).filter(s => s.inUse);
  const activeSpells  = (spells    || []).filter(s => s.inUse);

  const updCoins = useCallback((type, val) => setChar(c => ({
    ...c, coins: { ...(c.coins||{gold:0,silver:0,copper:0}), [type]: Math.max(0, parseInt(val)||0) }
  })), [setChar]);

  const itemMeta = item => {
    const parts = [];
    if (item.damage) {
      let s = item.damage;
      if (item.damageType) s += ' ' + item.damageType;
      if (item.modifier) s += ` · +${parseInt(item.modifier)||0} traf.`;
      parts.push(s);
    }
    if (item.effect) parts.push(item.effect);
    if (!parts.length && item.note) parts.push(item.note);
    return parts.join(' · ');
  };

  const itemExpand = item => item.note
    ? <ExpandText muted>{item.note}</ExpandText>
    : null;

  const spellMeta = sp =>
    sp.castingTime || [displaySpellLevel(sp.level), sp.school && displaySpellSchool(sp.school)].filter(Boolean).join(' · ');

  const spellExpand = sp => (sp.description || sp.notes)
    ? <>
        {sp.description && <ExpandText>{sp.description}</ExpandText>}
        {sp.notes && <ExpandText muted>{sp.notes}</ExpandText>}
      </>
    : null;

  const skillExpand = sk => sk.description
    ? <ExpandText muted>{sk.description}</ExpandText>
    : null;

  const initiative = char.initiativeBonus !== undefined
    ? char.initiativeBonus
    : Math.floor(((char.stats?.DEX ?? 10) - 10) / 2);

  return (
    <div className="card">
      <div className="sect-divider">{C.equippedTitle}</div>

      {/* ── Sekcja bojowa ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem", marginBottom:"0.5rem" }}>
        {/* Prędkość */}
        <div className="combat-box">
          <span className="combat-box-label">{C.speed}</span>
          <input className="combat-box-input" type="number" value={char.speed||30}
            onFocus={e => e.target.select()}
            onChange={e => setChar(c => ({...c, speed: parseInt(e.target.value)||30}))}/>
        </div>
        {/* KP */}
        <div className="combat-box">
          <span className="combat-box-label">{C.ac}</span>
          <input className="combat-box-input" type="number" value={char.ac||0}
            onFocus={e => e.target.select()}
            onChange={e => setChar(c => ({...c, ac: e.target.value===""?0:parseInt(e.target.value)||0}))}/>
        </div>
        {/* Inicjatywa */}
        <div className="combat-box">
          <span className="combat-box-label">{C.initiative}</span>
          <input className="combat-box-input" type="text" inputMode="numeric" value={numMod(initiative)}
            onFocus={e => e.target.select()}
            onChange={e => {
              const raw = e.target.value.replace(/[^-\d]/g, "");
              setChar(c => raw===""
                ? (({ initiativeBonus:_, ...rest }) => rest)(c)
                : {...c, initiativeBonus: parseInt(raw)});
            }}
            onBlur={e => {
              if (e.target.value==="" || isNaN(parseInt(e.target.value.replace(/[^-\d]/g,""))))
                setChar(c => { const o={...c}; delete o.initiativeBonus; return o; });
            }}/>
        </div>
      </div>

      <div className="subtab-bar">
        {[
          ["items",  C.tabItems,     equippedItems.length],
          ["skills", C.tabAbilities, activeSkills.length],
          ["spells", C.tabSpells,    activeSpells.length],
        ].map(([key, label, count]) => (
          <button key={key}
            className={`subtab-btn${activeTab===key?" active":""}`}
            onClick={() => setActiveTab(key)}>
            {label}{count > 0 ? ` (${count})` : ""}
          </button>
        ))}
      </div>

      {/* ── WYPOSAŻENIE ── */}
      {activeTab === "items" && (
        <>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"flex-end", marginBottom:"0.65rem", paddingBottom:"0.5rem", borderBottom:"1px solid rgba(128,128,128,0.1)" }}>
            {[["gold",C.gold,"#c8a820"],["silver",C.silver,"#8898a8"],["copper",C.copper,"#b07040"]].map(([type,label,color]) => {
              const val = (char.coins||{})[type] || 0;
              return (
                <div key={type} style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
                  <Icon name="coins" size="0.85em" color={color}/>
                  <input type="number" min={0} value={val}
                    onChange={e => updCoins(type, parseInt(e.target.value)||0)}
                    onFocus={e => e.target.select()}
                    style={{ width:40, fontFamily:"Cinzel,serif", fontSize:"0.82rem", fontWeight:700, textAlign:"center", background:"transparent", border:"none", borderBottom:`1px dashed ${color}`, outline:"none", color:"inherit" }}/>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.06em", textTransform:"uppercase", color, opacity:0.8 }}>{label}</span>
                </div>
              );
            })}
          </div>
          {equippedItems.length === 0
            ? <div className="empty-state">{C.emptyItems}</div>
            : (
              <div style={{ background:"var(--hj-inner-div-bg)", borderRadius:"var(--radius-md)", border:"1px solid var(--hj-border-input)", borderLeft:"2px solid var(--hj-accent-border)", overflow:"hidden" }}>
                <SubHeader iconName="sword" label={C.subItems||C.tabItems}/>
                {equippedItems.map((item, i) => (
                  <EquippedRow key={item.id}
                    iconName={ITEM_ICONS[item.type]||"diamond"}
                    name={item.name} meta={itemMeta(item)}
                    expandContent={itemExpand(item)}
                    isLast={i===equippedItems.length-1}/>
                ))}
              </div>
            )
          }
        </>
      )}

      {/* ── AKTYWNE ZDOLNOŚCI ── */}
      {activeTab === "skills" && (
        activeSkills.length === 0
          ? <div className="empty-state">{C.emptyAbilities}</div>
          : (
            <div style={{ background:"var(--hj-inner-div-bg)", borderRadius:"var(--radius-md)", border:"1px solid var(--hj-border-input)", borderLeft:"2px solid var(--hj-accent-border)", overflow:"hidden" }}>
              <SubHeader iconName="sparkle" label={C.subAbilities||C.tabAbilities}/>
              {activeSkills.map((sk, i) => (
                <EquippedRow key={sk.id}
                  iconName={SKILL_CAT_ICONS[sk.category]||"sparkles"}
                  name={sk.name}
                  badge={displaySkillCat(sk.category)}
                  expandContent={skillExpand(sk)}
                  isLast={i===activeSkills.length-1}/>
              ))}
            </div>
          )
      )}

      {/* ── PRZYGOTOWANE CZARY ── */}
      {activeTab === "spells" && (
        <>
          <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
          {activeSpells.length === 0
            ? <div className="empty-state">{C.emptySpells}</div>
            : (
              <div style={{ background:"var(--hj-inner-div-bg)", borderRadius:"var(--radius-md)", border:"1px solid var(--hj-border-input)", borderLeft:"2px solid var(--hj-spell-border)", overflow:"hidden", marginTop:"0.6rem" }}>
                <SubHeader iconName="wand" label={C.subSpells||C.tabSpells} color="var(--hj-spell-muted)"/>
                {activeSpells.map((sp, i) => (
                  <EquippedRow key={sp.id}
                    iconName={SPELL_SCHOOL_ICONS[sp.school]||"wand"}
                    name={sp.name} nameColor="var(--hj-spell-text)"
                    meta={spellMeta(sp)}
                    expandContent={spellExpand(sp)}
                    isLast={i===activeSpells.length-1}/>
                ))}
              </div>
            )
          }
        </>
      )}
    </div>
  );
}
