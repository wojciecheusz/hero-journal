import { useState, useCallback } from 'react';
import { ITEM_ICONS, SKILL_CAT_ICONS, SPELL_SCHOOL_ICONS, DAMAGE_TYPES } from '../../../constants/gameConstants';
import { SpellSlotsWidget } from '../widgets/SpellSlotsWidget';
import { useT } from '../../../i18n/translations';
import Icon from '../../../shared/icons';
import RichText from '../../../shared/RichText';
import ItemUses from '../../../shared/ItemUses';
import { FieldGrid, TagList } from '../../../shared/EntityCard';
import { numMod } from '../../../utils/math';
import { itemKeyStat, hasCharges, isConsumable } from '../../../utils/items';

/* Wiersz pozycji (P29/C1) — JEDEN układ dla przedmiotów, zdolności i czarów:
   ikona · nazwa (zawijana) · najważniejsza informacja pod nazwą · strzałka.
   Licznik użyć (ładunki / sztuki) jest zawsze widoczny pod wierszem, a pełny
   opis rozwija się POD wierszem na całą szerokość karty, wyrównany do lewej. */
function EquippedRow({ icon, tone, name, stat, uses, children }) {
  const [open, setOpen] = useState(false);
  const canExpand = !!children;
  return (
    <div className={`eq-row${open ? " open" : ""}`}>
      <button className="eq-head" onClick={() => canExpand && setOpen(o => !o)}
        aria-expanded={canExpand ? open : undefined} disabled={!canExpand && !uses}>
        <span className={`icon-badge eq-icon${tone ? ` tone-${tone}` : ""}`}><Icon name={icon || "diamond"}/></span>
        <span className="eq-main">
          <span className="eq-name">{name}</span>
          {stat && <span className="eq-stat">{stat}</span>}
        </span>
        {canExpand && <span className="eq-chevron"><Icon name={open ? "chevron-up" : "chevron-down"}/></span>}
      </button>
      {uses && <div className="eq-uses">{uses}</div>}
      {open && <div className="eq-body">{children}</div>}
    </div>
  );
}

export default function EquippedCard({ char, setChar, C, inventory, setInventory, skills, spells }) {
  const T = useT();
  const LB = T.LABELS;
  const I  = T.INVENTORY;
  const SP = T.SPELLS;
  const [activeTab, setActiveTab] = useState("items");

  const displaySpellLevel  = level    => LB.spellLevel?.[level]  ?? level;
  const displaySpellSchool = school   => LB.spellSchool?.[school] ?? school;
  const displaySkillCat    = category => LB.skillCat?.[category]  ?? category;
  const displayDamageType  = dt => T.DAMAGE_TYPES[DAMAGE_TYPES.indexOf(dt)] ?? dt;

  const equippedItems = (inventory || []).filter(i => i.equipped);
  const activeSkills  = (skills    || []).filter(s => s.inUse);
  const activeSpells  = (spells    || []).filter(s => s.inUse);

  const updCoins = useCallback((type, val) => setChar(c => ({
    ...c, coins: { ...(c.coins||{gold:0,silver:0,copper:0}), [type]: val }
  })), [setChar]);
  const updItem = item => setInventory(inv => inv.map(x => x.id === item.id ? item : x));

  const initiative = char.initiativeBonus !== undefined
    ? char.initiativeBonus
    : Math.floor(((char.stats?.DEX ?? 10) - 10) / 2);

  const itemBody = item => {
    const stat = itemKeyStat(item, T, DAMAGE_TYPES);
    const fields = [
      [I.damage, item.type === "weapon" ? item.damage : null],
      [I.damageType, item.type === "weapon" && item.damageType ? displayDamageType(item.damageType) : null],
      [I.attackBonus, item.type === "weapon" && item.modifier ? numMod(parseInt(item.modifier) || 0) : null],
      [I.effect, item.effect && item.effect !== stat ? item.effect : null],
      [T.USES.chargesNote, item.charges],
    ];
    const note = item.note && item.note !== stat ? item.note : null;
    if (!note && !fields.some(([, v]) => v) && !(item.tags || []).length) return null;
    return <>
      <FieldGrid fields={fields}/>
      {note && <RichText text={note}/>}
      <TagList tags={item.tags}/>
    </>;
  };

  return (
    <div className="card">
      <div className="sect-divider">{C.equippedTitle}</div>

      {/* ── Sekcja bojowa ── */}
      <div className="combat-grid-3">
        <label className="combat-box">
          <span className="combat-box-label">{C.speed}</span>
          <input className="combat-box-input" type="text" inputMode="numeric" value={char.speed ?? 30}
            onFocus={e => e.target.select()}
            onChange={e => { const v = parseInt(e.target.value); setChar(c => ({...c, speed: isNaN(v) ? e.target.value : v})); }}
            onBlur={e => { const v = parseInt(e.target.value); setChar(c => ({...c, speed: isNaN(v) ? 30 : v})); }}/>
        </label>
        <label className="combat-box">
          <span className="combat-box-label">{C.ac}</span>
          <input className="combat-box-input" type="text" inputMode="numeric" value={char.ac ?? 0}
            onFocus={e => e.target.select()}
            onChange={e => { const v = parseInt(e.target.value); setChar(c => ({...c, ac: isNaN(v) ? e.target.value : v})); }}
            onBlur={e => { const v = parseInt(e.target.value); setChar(c => ({...c, ac: isNaN(v) ? 0 : v})); }}/>
        </label>
        <label className="combat-box">
          <span className="combat-box-label">{C.initiative}</span>
          <input className="combat-box-input" type="text" inputMode="numeric" value={numMod(initiative)}
            onFocus={e => e.target.select()}
            onChange={e => {
              const raw = e.target.value.replace(/[^-\d]/g, "");
              setChar(c => {
                if (raw === "" || raw === "-") { const o = { ...c }; delete o.initiativeBonus; return o; }
                return { ...c, initiativeBonus: parseInt(raw) };
              });
            }}/>
        </label>
      </div>

      <div className="eq-tabs" role="tablist">
        {[
          ["items",  C.tabItems,     equippedItems.length],
          ["skills", C.tabAbilities, activeSkills.length],
          ["spells", C.tabSpells,    activeSpells.length],
        ].map(([key, label, count]) => (
          <button key={key} role="tab" aria-selected={activeTab === key}
            className={`subtab${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}>
            <span className="subtab-label">{label}</span>
            <span className="subtab-count">{count}</span>
          </button>
        ))}
      </div>

      {/* ── WYPOSAŻENIE ── */}
      {activeTab === "items" && (
        <>
          <div className="coins-row">
            {[["gold",C.gold,"#c8a820"],["silver",C.silver,"#8898a8"],["copper",C.copper,"#b07040"]].map(([type,label,color]) => {
              const val = (char.coins||{})[type] ?? 0;
              return (
                <label key={type} className="coin" style={{ "--coin": color }}>
                  <Icon name="coins" size="1em" color={color}/>
                  <input type="text" inputMode="numeric" value={val} aria-label={label}
                    onChange={e => { const v = parseInt(e.target.value.replace(/\D/g, "")); updCoins(type, isNaN(v) ? "" : v); }}
                    onBlur={e => { const v = parseInt(e.target.value); updCoins(type, Math.max(0, isNaN(v) ? 0 : v)); }}
                    onFocus={e => e.target.select()}/>
                  <span className="coin-label">{label}</span>
                </label>
              );
            })}
          </div>
          {equippedItems.length === 0
            ? <div className="empty-state">{C.emptyItems}</div>
            : (
              <div className="eq-list">
                {equippedItems.map(item => (
                  <EquippedRow key={item.id}
                    icon={ITEM_ICONS[item.type] || "diamond"} name={item.name}
                    stat={itemKeyStat(item, T, DAMAGE_TYPES)}
                    uses={(hasCharges(item) || isConsumable(item)) ? <ItemUses item={item} onChange={updItem} compact/> : null}>
                    {itemBody(item)}
                  </EquippedRow>
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
            <div className="eq-list">
              {activeSkills.map(sk => (
                <EquippedRow key={sk.id} icon={SKILL_CAT_ICONS[sk.category] || "sparkles"} tone="skill"
                  name={sk.name} stat={[displaySkillCat(sk.category), ...(sk.tags || [])].filter(Boolean).join(" · ")}>
                  {sk.description ? <RichText text={sk.description}/> : null}
                </EquippedRow>
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
              <div className="eq-list" style={{ marginTop: "0.6rem" }}>
                {activeSpells.map(sp => (
                  <EquippedRow key={sp.id} icon={SPELL_SCHOOL_ICONS[sp.school] || "wand"} tone="spell"
                    name={sp.name}
                    stat={[displaySpellLevel(sp.level), sp.castingTime, sp.zakres].filter(Boolean).join(" · ")}>
                    {(sp.description || sp.notes || sp.duration || sp.components) ? <>
                      <FieldGrid fields={[
                        [SP.schoolLbl || SP.school, sp.school ? displaySpellSchool(sp.school) : null],
                        [SP.durationLbl, sp.duration],
                        [SP.componentsLbl, sp.components],
                      ]}/>
                      <RichText text={sp.description}/>
                      {sp.notes && <div className="ecard-subsection"><div className="form-label">{SP.higherLevels}</div><RichText text={sp.notes}/></div>}
                    </> : null}
                  </EquippedRow>
                ))}
              </div>
            )
          }
        </>
      )}
    </div>
  );
}
