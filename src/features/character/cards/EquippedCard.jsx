import { useState, useCallback } from 'react';
import { ITEM_ICONS, SKILL_CAT_ICONS, SPELL_SCHOOL_ICONS } from '../../../constants/gameConstants';
import { SpellSlotsWidget } from '../widgets/SpellSlotsWidget';
import { useT } from '../../../i18n/translations';
import { useDragReorder } from '../../../hooks/useDragReorder';
import Icon from '../../../shared/icons';

export default function EquippedCard({ char, setChar, C, inventory, setInventory, skills, setSkills, spells, setSpells }) {
  const T = useT();
  const LB = T.LABELS;
  const [activeTab, setActiveTab] = useState("items");

  const displayItemType  = type     => LB.itemType?.[type]  ?? type;
  const displaySpellLevel= level    => LB.spellLevel?.[level] ?? level;
  const displaySpellSchool= school  => LB.spellSchool?.[school] ?? school;
  const displaySkillCat  = category => LB.skillCat?.[category] ?? category;

  const equippedItems = (inventory || []).filter(i => i.equipped);
  const activeSkills  = (skills || []).filter(s => s.inUse);
  const activeSpells  = (spells || []).filter(s => s.inUse);

  const updCoins = useCallback((type, val) => setChar(c => ({
    ...c, coins: { ...(c.coins||{gold:0,silver:0,copper:0}), [type]: Math.max(0, parseInt(val)||0) }
  })), [setChar]);

  const itemsDrag  = useDragReorder(setInventory);
  const skillsDrag = useDragReorder(setSkills);
  const spellsDrag = useDragReorder(setSpells);

  const dragRowStyle = (drag, id) => ({
    cursor: "grab",
    opacity: drag.dragId===id ? 0.4 : 1,
    borderLeftColor: (drag.overId===id && drag.dragId!==id) ? "var(--hj-accent)" : undefined,
  });

  return (
    <div className="card">
      <div className="sect-divider">{C.equippedTitle}</div>

      {/* Monety */}
      <div style={{ borderBottom:"1px solid rgba(128,128,128,0.15)", paddingBottom:"0.75rem", marginBottom:"0.75rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem" }}>
          {[["gold",C.gold,"#c8a820"],["silver",C.silver,"#8898a8"],["copper",C.copper,"#b07040"]].map(([type,label,color]) => {
            const val = (char.coins||{})[type] || 0;
            return (
              <div key={type} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.25rem" }}>
                <span style={{ display:"flex", alignItems:"center", gap:"0.25rem", fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.08em", textTransform:"uppercase", color, lineHeight:1 }}><Icon name="coins" size="0.9em" color={color}/> {label}</span>
                <div style={{ display:"flex", alignItems:"center", gap:"0.2rem" }}>
                  <button onClick={() => updCoins(type, val-1)} aria-label={`Decrease ${type}`} style={{ width:22, height:22, background:"transparent", border:"1px solid var(--hj-pip-empty)", cursor:"pointer", color:"inherit", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="minus" size="0.8em"/></button>
                  <input type="number" min={0} value={val}
                    onChange={e => updCoins(type, parseInt(e.target.value)||0)}
                    onFocus={e => e.target.select()}
                    style={{ width:46, fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, textAlign:"center", background:"transparent", border:"none", borderBottom:`1px dashed ${color}`, outline:"none", color:"inherit" }}/>
                  <button onClick={() => updCoins(type, val+1)} aria-label={`Increase ${type}`} style={{ width:22, height:22, background:"transparent", border:"1px solid var(--hj-pip-empty)", cursor:"pointer", color:"inherit", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="plus" size="0.8em"/></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="subtab-bar">
        <button className={`subtab-btn${activeTab==="items"?"  active":""}`} onClick={() => setActiveTab("items")}>
          {C.tabItems}{equippedItems.length>0?` (${equippedItems.length})`:""}
        </button>
        <button className={`subtab-btn${activeTab==="skills"?" active":""}`} onClick={() => setActiveTab("skills")}>
          {C.tabAbilities}{activeSkills.length>0?` (${activeSkills.length})`:""}
        </button>
        <button className={`subtab-btn${activeTab==="spells"?" active":""}`} onClick={() => setActiveTab("spells")}>
          {C.tabSpells}{activeSpells.length>0?` (${activeSpells.length})`:""}
        </button>
      </div>

      {activeTab==="items" && (equippedItems.length===0
        ? <div className="empty-state">{C.emptyItems}</div>
        : equippedItems.map(item => (
          <div key={item.id} className="equipped-item"
            {...itemsDrag.bindRow(item.id)}
            style={dragRowStyle(itemsDrag, item.id)}>
            <span className="equipped-drag-handle" title={C.dragToReorder} aria-label={C.dragToReorder} {...itemsDrag.bindHandle(item.id)}><Icon name="grip" size="0.9em"/></span>
            <span className="icon-badge"><Icon name={ITEM_ICONS[item.type]||"diamond"}/></span>
            <div className="flex1">
              <div className="row" style={{ gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                <span className="equipped-name">{item.name}</span>
                <span className="equipped-type-badge">{displayItemType(item.type)}</span>
                {item.qty && item.qty!=="1" && <span className="equipped-type-badge">×{item.qty}</span>}
                {(item.tags||[]).map(tag => <span key={tag} className="tag tag-default" style={{ fontSize:"0.46rem", padding:"0.1rem 0.4rem" }}>{tag}</span>)}
              </div>
              {item.damage && <div className="equipped-stat" style={{ display:"flex", alignItems:"center", gap:"0.25rem" }}><Icon name="sword" size="0.85em"/> {item.damage}{item.damageType?` (${item.damageType})`:""}{item.modifier?` · +${parseInt(item.modifier)||0}`:""}</div>}
              {item.charges && <div className="equipped-stat">{C.charges} {item.charges}</div>}
              {item.effect && <div className="equipped-stat" style={{ color:"var(--hj-spell-muted)" }}>{item.effect}</div>}
              {item.note && <div className="equipped-stat" style={{ fontStyle:"italic", opacity:0.7 }}>{item.note}</div>}
            </div>
          </div>
        ))
      )}

      {activeTab==="skills" && (activeSkills.length===0
        ? <div className="empty-state">{C.emptyAbilities}</div>
        : activeSkills.map(sk => (
          <div key={sk.id} className="equipped-item"
            {...skillsDrag.bindRow(sk.id)}
            style={dragRowStyle(skillsDrag, sk.id)}>
            <span className="equipped-drag-handle" title={C.dragToReorder} aria-label={C.dragToReorder} {...skillsDrag.bindHandle(sk.id)}><Icon name="grip" size="0.9em"/></span>
            <span className="icon-badge"><Icon name={SKILL_CAT_ICONS[sk.category] || "sparkles"}/></span>
            <div className="flex1">
              <div className="row" style={{ gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                <span className="equipped-name">{sk.name}</span>
                <span className="equipped-skill-badge">{displaySkillCat(sk.category)}</span>
                {(sk.tags||[]).map(tag => <span key={tag} className="tag tag-default" style={{ fontSize:"0.46rem", padding:"0.1rem 0.4rem" }}>{tag}</span>)}
              </div>
              {sk.description && <div className="equipped-stat">{sk.description}</div>}
            </div>
          </div>
        ))
      )}

      {activeTab==="spells" && (
        <>
          <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
          {activeSpells.length > 0 && (
            <div style={{ marginTop:"0.8rem" }}>
              {activeSpells.map(sp => (
                <div key={sp.id} className="equipped-item"
                  {...spellsDrag.bindRow(sp.id)}
                  style={dragRowStyle(spellsDrag, sp.id)}>
                  <span className="equipped-drag-handle" title={C.dragToReorder} aria-label={C.dragToReorder} {...spellsDrag.bindHandle(sp.id)}><Icon name="grip" size="0.9em"/></span>
                  <span className="icon-badge"><Icon name={SPELL_SCHOOL_ICONS[sp.school] || "wand"}/></span>
                  <div className="flex1">
                    <div className="row" style={{ gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                      <span className="equipped-name" style={{ color:"var(--hj-spell-text)" }}>{sp.name}</span>
                      <span className="equipped-spell-badge">{displaySpellLevel(sp.level)}</span>
                      {sp.school && <span className="equipped-spell-badge">{displaySpellSchool(sp.school)}</span>}
                      {(sp.tags||[]).map(tag => <span key={tag} className="tag tag-default" style={{ fontSize:"0.46rem", padding:"0.1rem 0.4rem" }}>{tag}</span>)}
                    </div>
                    {sp.description && <div className="equipped-stat">{sp.description}</div>}
                    {(sp.castingTime || sp.zakres || sp.duration) && (
                      <div className="equipped-stat" style={{ color:"var(--hj-spell-muted)" }}>
                        {[sp.castingTime, sp.zakres && `${T.SPELLS.rangeLbl}: ${sp.zakres}`, sp.duration && `${T.SPELLS.durationLbl}: ${sp.duration}`].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeSpells.length===0 && <div className="empty-state">{C.emptySpells}</div>}
        </>
      )}
    </div>
  );
}
