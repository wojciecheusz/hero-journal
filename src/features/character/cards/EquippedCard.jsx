import { useState, useCallback } from 'react';
import { ITEM_ICONS } from '../../../constants/gameConstants';
import { SpellSlotsWidget } from '../../../shared/ui';

export default function EquippedCard({ char, setChar, C, inventory, skills, spells }) {
  const [activeTab, setActiveTab] = useState("items");

  const equippedItems = (inventory || []).filter(i => i.equipped);
  const activeSkills  = (skills || []).filter(s => s.inUse);
  const activeSpells  = (spells || []).filter(s => s.inUse);

  const updCoins = useCallback((type, val) => setChar(c => ({
    ...c, coins: { ...(c.coins||{gold:0,silver:0,copper:0}), [type]: Math.max(0, parseInt(val)||0) }
  })), [setChar]);

  return (
    <div className="card">
      <div className="sect-label">{C.equippedTitle}</div>

      {/* Monety */}
      <div style={{ borderBottom:"1px solid rgba(128,128,128,0.15)", paddingBottom:"0.75rem", marginBottom:"0.75rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem" }}>
          {[["gold",C.gold,"#c8a820"],["silver",C.silver,"#8898a8"],["copper",C.copper,"#b07040"]].map(([type,label,color]) => {
            const val = (char.coins||{})[type] || 0;
            return (
              <div key={type} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.25rem" }}>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.08em", textTransform:"uppercase", color, lineHeight:1 }}>{label}</span>
                <div style={{ display:"flex", alignItems:"center", gap:"0.2rem" }}>
                  <button onClick={() => updCoins(type, val-1)} style={{ width:22, height:22, background:"transparent", border:"1px solid var(--pip-empty)", cursor:"pointer", fontFamily:"monospace", fontSize:"0.85rem", color:"inherit", lineHeight:1 }}>−</button>
                  <input type="number" min={0} value={val}
                    onChange={e => updCoins(type, parseInt(e.target.value)||0)}
                    onFocus={e => e.target.select()}
                    style={{ width:46, fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, textAlign:"center", background:"transparent", border:"none", borderBottom:`1px dashed ${color}`, outline:"none", color:"inherit" }}/>
                  <button onClick={() => updCoins(type, val+1)} style={{ width:22, height:22, background:"transparent", border:"1px solid var(--pip-empty)", cursor:"pointer", fontFamily:"monospace", fontSize:"0.85rem", color:"inherit", lineHeight:1 }}>+</button>
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
          <div key={item.id} className="equipped-item">
            <span className="equipped-icon">{ITEM_ICONS[item.type]||"◈"}</span>
            <div className="flex1">
              <div className="row" style={{ gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                <span className="equipped-name">{item.name}</span>
                <span className="equipped-type-badge">{item.type}</span>
                {item.qty && item.qty!=="1" && <span className="equipped-type-badge">×{item.qty}</span>}
              </div>
              {item.damage && <div className="equipped-stat">⚔ {item.damage}{item.damageType?` (${item.damageType})`:""}{item.modifier?` · +${parseInt(item.modifier)||0}`:""}</div>}
              {item.charges && <div className="equipped-stat">{C.charges} {item.charges}</div>}
              {item.effect && <div className="equipped-stat" style={{ color:"var(--spell-muted)" }}>{item.effect}</div>}
              {item.note && <div className="equipped-stat" style={{ fontStyle:"italic", opacity:0.7 }}>{item.note}</div>}
            </div>
          </div>
        ))
      )}

      {activeTab==="skills" && (activeSkills.length===0
        ? <div className="empty-state">{C.emptyAbilities}</div>
        : activeSkills.map(sk => (
          <div key={sk.id} className="equipped-item">
            <span className="equipped-icon">✨</span>
            <div className="flex1">
              <div className="row" style={{ gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                <span className="equipped-name">{sk.name}</span>
                <span className="equipped-skill-badge">{sk.category}</span>
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
                <div key={sp.id} className="equipped-item">
                  <span className="equipped-icon">🔮</span>
                  <div className="flex1">
                    <div className="row" style={{ gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                      <span className="equipped-name" style={{ color:"var(--spell-text)" }}>{sp.name}</span>
                      <span className="equipped-spell-badge">{sp.level}</span>
                      {sp.school && <span className="equipped-spell-badge">{sp.school}</span>}
                    </div>
                    {sp.description && <div className="equipped-stat">{sp.description}</div>}
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
