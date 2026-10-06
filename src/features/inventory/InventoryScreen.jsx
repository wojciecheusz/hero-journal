import { useState, memo } from 'react';
import { ITEM_TYPES, ITEM_ICONS, DAMAGE_TYPES } from '../../constants/gameConstants';
import { ITEM_TYPE } from '../../constants/enums.js';
import { Toggle, TagsEditor } from '../../shared/ui';
import { useT, useLang } from '../../i18n/translations';
import { displayTag, hasTag, sameTag } from '../../utils/tags';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';
import { useEntityList } from '../../hooks/useEntityList';
import ListToolbar from '../../shared/ListToolbar';
import EntityCard, { FieldGrid, TagList } from '../../shared/EntityCard';
import EntityEditModal, { ChoiceChips, RichTextArea } from '../../shared/EntityEditModal';
import RichText from '../../shared/RichText';
import { matchesSearch } from '../../utils/search';
import { plainText } from '../../utils/markdown';
import { itemKeyStat, hasCharges, chargesLeft, RECHARGE } from '../../utils/items';
import ItemUses from '../../shared/ItemUses';

const EMPTY_ITEM = { name:"", type:ITEM_TYPE.GENERAL, qty:"1", damage:"", damageType:"", modifier:"", charges:"", effect:"", note:"", tags:[] };
const hasCombat  = t => t === ITEM_TYPE.WEAPON;
const typeHasCharges = t => [ITEM_TYPE.SCROLL, ITEM_TYPE.WONDROUS, ITEM_TYPE.CONSUMABLE].includes(t);
const isArmor    = t => t === ITEM_TYPE.ARMOR || t === ITEM_TYPE.SHIELD;

function InventoryScreen({ inventory, setInventory, openEntity }) {
  const T = useT();
  const lang = useLang();
  const I = T.INVENTORY;
  const displayItemType   = type => T.ITEM_TYPES[ITEM_TYPES.indexOf(type)] ?? type;
  const displayDamageType = dt => T.DAMAGE_TYPES[DAMAGE_TYPES.indexOf(dt)] ?? dt;

  const [filterType, setFilterType] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // { item, isNew }

  const { expanded, setExpanded, activeTag, setActiveTag, allTags, upd, toggle } = useEntityList(inventory, setInventory);
  useScrollToEntity(openEntity, inventory, setExpanded);

  const toggleEquip = id => setInventory(inv => inv.map(x => x.id === id ? { ...x, equipped: !x.equipped } : x));
  const saveItem = item => setInventory(inv => item.id
    ? inv.map(x => x.id === item.id ? item : x)
    : [...inv, { ...item, id: Date.now(), equipped: false, pinned: false }]);
  const deleteItem = id => setInventory(inv => inv.filter(x => x.id !== id));

  const keyStat = item => itemKeyStat(item, T, DAMAGE_TYPES);
  const updItem = item => setInventory(inv => inv.map(x => x.id === item.id ? item : x));

  const visible = inventory
    .filter(i => !filterType || i.type === filterType)
    .filter(i => !activeTag || hasTag(i.tags, activeTag))
    .filter(i => matchesSearch(search, [i.name, plainText(i.note), i.effect, i.charges, displayItemType(i.type), ...(i.tags || []).map(t => displayTag(t, lang))]))
    .sort((a, b) => (b.pinned?1:0) - (a.pinned?1:0));
  const equippedCount = inventory.filter(i => i.equipped).length;

  const groups = [
    [I.sectionWeapons, visible.filter(i => i.type === ITEM_TYPE.WEAPON)],
    [I.sectionArmor,   visible.filter(i => isArmor(i.type))],
    [I.sectionMisc,    visible.filter(i => i.type !== ITEM_TYPE.WEAPON && !isArmor(i.type))],
  ];

  return (
    <>
      <ListToolbar
        search={search} onSearch={setSearch}
        onAdd={() => setEditing({ item: { ...EMPTY_ITEM }, isNew: true })} addLabel={I.add}
        summary={[I.count(inventory.length, equippedCount), T.LIST.shown(visible.length, inventory.length)].filter(Boolean).join(" · ")}
        filterGroups={[
          { key:"type", label:T.LIST.type, value:filterType, onChange:setFilterType,
            options: ITEM_TYPES.map((t, i) => ({ value:t, label:T.ITEM_TYPES[i] ?? t, icon:ITEM_ICONS[t], count:inventory.filter(x => x.type === t).length })).filter(o => o.count) },
          { key:"tag", label:T.LIST.tags, value:activeTag, onChange:setActiveTag,
            options: allTags.map(tag => ({ value:tag, label:displayTag(tag, lang), count:inventory.filter(x => hasTag(x.tags, tag)).length })) },
        ]}/>

      {inventory.length === 0 && <div className="card empty-state">{I.empty}</div>}
      {inventory.length > 0 && visible.length === 0 && <div className="card empty-state">{T.LIST.noResults}</div>}

      <div className="entity-grid">
        {groups.map(([label, items]) => items.length > 0 && [
          <div key={label} className="sect-divider">{label}</div>,
          ...items.map(renderItem),
        ])}
      </div>

      {editing && (
        <EntityEditModal kind="inventory" initial={editing.item} isNew={editing.isNew} textFields={["note"]}
          onSave={saveItem} onDelete={() => deleteItem(editing.item.id)} onClose={() => setEditing(null)}>
          {(d, set) => <ItemForm d={d} set={set} T={T}/>}
        </EntityEditModal>
      )}
    </>
  );

  function renderItem(item) {
    const open = !!expanded[item.id];
    const stat = keyStat(item);
    const qty  = parseInt(item.qty) || 1;
    const noteIsStat = stat && stat === item.note;
    return (
      <EntityCard key={item.id} id={item.id}
        icon={ITEM_ICONS[item.type] || "diamond"} title={item.name}
        open={open} onToggle={() => toggle(item.id)}
        pinned={item.pinned} onPin={() => upd(item.id, "pinned", !item.pinned)}
        onEdit={() => setEditing({ item, isNew: false })}
        accent={item.equipped ? "gold" : null}
        meta={<>
          <span className="meta-badge">{displayItemType(item.type)}</span>
          {qty > 1 && <span className="meta-badge">×{qty}</span>}
          {stat && <span className="meta-stat">{stat}</span>}
          {hasCharges(item) && <span className="meta-badge uses">{T.USES.charges(chargesLeft(item), item.uses.max)}</span>}
        </>}
        quick={<Toggle on={!!item.equipped} onToggle={() => toggleEquip(item.id)} label={item.equipped ? I.equipped : I.inBag}/>}
        preview={!noteIsStat && item.note ? plainText(item.note) : null}>
        <FieldGrid fields={[
          [I.damage, hasCombat(item.type) ? item.damage : null],
          [I.damageType, hasCombat(item.type) && item.damageType ? displayDamageType(item.damageType) : null],
          [I.attackBonus, hasCombat(item.type) && item.modifier ? `+${parseInt(item.modifier) || 0}` : null],
          [I.effect, item.effect],
          [T.USES.chargesNote, item.charges],
          [T.LIST.qty, qty > 1 ? qty : null],
        ]}/>
        <ItemUses item={item} onChange={updItem}/>
        {item.note && !noteIsStat && <RichText text={item.note}/>}
        <TagList tags={item.tags}/>
      </EntityCard>
    );
  }
}

/* Formularz przedmiotu (dodawanie i edycja) */
function ItemForm({ d, set, T }) {
  const I = T.INVENTORY;
  return (
    <>
      <ChoiceChips label={I.type} value={d.type} onChange={v => set("type", v)}
        options={ITEM_TYPES.map((t, i) => ({ value:t, label:T.ITEM_TYPES[i] ?? t, icon:ITEM_ICONS[t] }))}/>
      <div className="form-grid">
        <label className="form-field">
          <span className="form-label">{T.LIST.qty}</span>
          <input className="g-input" inputMode="numeric" value={d.qty ?? "1"} onChange={e => set("qty", e.target.value)}/>
        </label>
        {hasCombat(d.type) && <>
          <label className="form-field">
            <span className="form-label">{I.damageDice}</span>
            <input className="g-input" placeholder="1d8+4" value={d.damage || ""} onChange={e => set("damage", e.target.value)}/>
          </label>
          <label className="form-field">
            <span className="form-label">{I.damageType}</span>
            <select className="g-select g-input" value={d.damageType || ""} onChange={e => set("damageType", e.target.value)}>
              <option value="">—</option>
              {DAMAGE_TYPES.map((dt, i) => <option key={dt} value={dt}>{T.DAMAGE_TYPES[i] ?? dt}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span className="form-label">{I.attackBonus}</span>
            <input className="g-input" inputMode="numeric" value={d.modifier || ""} onChange={e => set("modifier", e.target.value.replace(/[^-\d]/g, ""))}/>
          </label>
        </>}
        {(typeHasCharges(d.type) || d.charges) && (
          <label className="form-field">
            <span className="form-label">{T.USES.chargesNote}</span>
            <input className="g-input" value={d.charges || ""} onChange={e => set("charges", e.target.value)}/>
          </label>
        )}
        <label className="form-field form-span-2">
          <span className="form-label">{I.effect}</span>
          <input className="g-input" value={d.effect || ""} onChange={e => set("effect", e.target.value)}/>
        </label>
      </div>
      <UsesFields d={d} set={set} T={T}/>
      <RichTextArea label={I.notes} value={d.note} placeholder={I.note} onChange={v => set("note", v)}/>
      <div className="form-field">
        <span className="form-label">{T.LIST.tagsLabel}</span>
        <TagsEditor tags={d.tags || []} onChange={v => set("tags", v)}
          suggestions={(d.tags || []).some(t => (T.UI.SUGGESTED_ACTION_TAGS || []).some(s => sameTag(s, t))) ? [] : T.UI.SUGGESTED_ACTION_TAGS}/>
      </div>
    </>
  );
}

/* Ładunki / użycia (P29/C2): przedmiot jednorazowy liczy sztuki, inne mogą
   mieć ładunki odnawiane przy odpoczynku. */
function UsesFields({ d, set, T }) {
  const U = T.USES;
  if (d.type === ITEM_TYPE.CONSUMABLE && !(parseInt(d.uses?.max) > 0)) {
    return <p className="form-hint">{U.consumableHint}</p>;
  }
  const uses = d.uses || { max: 0, used: 0, recharge: "long" };
  const setUses = patch => set("uses", { ...uses, ...patch });
  return (
    <div className="form-section uses-fields">
      <div className="form-heading">{U.title}</div>
      <div className="form-grid">
        <label className="form-field">
          <span className="form-label">{U.max}</span>
          <input className="g-input" inputMode="numeric" value={uses.max || ""} placeholder="0"
            onChange={e => {
              const max = Math.max(0, parseInt(e.target.value.replace(/\D/g, "")) || 0);
              set("uses", max > 0 ? { ...uses, max, used: Math.min(uses.used || 0, max) } : undefined);
            }}/>
        </label>
      </div>
      {parseInt(uses.max) > 0 && (
        <ChoiceChips label={U.recharge} value={uses.recharge || "none"} onChange={v => setUses({ recharge: v })}
          options={RECHARGE.map(r => ({ value: r, label: U.rechargeOpt[r] }))}/>
      )}
      <p className="form-hint small">{U.chargesHint}</p>
    </div>
  );
}

export default memo(InventoryScreen);
