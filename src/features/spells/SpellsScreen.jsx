import { useState, memo } from 'react';
import { SPELL_SCHOOLS, SPELL_LEVELS, STAT_KEYS, SPELL_SCHOOL_ICONS } from '../../constants/gameConstants';
import { SPELL_LEVEL, SPELL_SCHOOL } from '../../constants/enums.js';
import { TagsEditor, Toggle } from '../../shared/ui';
import { SpellSlotsWidget } from '../character/widgets/SpellSlotsWidget';
import { useT, useLang } from '../../i18n/translations';
import { displayTag, hasTag, sameTag } from '../../utils/tags';
import { useEntityList } from '../../hooks/useEntityList';
import ListToolbar from '../../shared/ListToolbar';
import EntityCard, { FieldGrid, TagList } from '../../shared/EntityCard';
import EntityEditModal, { ChoiceChips, RichTextArea } from '../../shared/EntityEditModal';
import RichText from '../../shared/RichText';
import Icon from '../../shared/icons';
import { matchesSearch } from '../../utils/search';
import { plainText } from '../../utils/markdown';
import { numMod } from '../../utils/math';
import { abilityMod } from '../../utils/character';

const EMPTY_SPELL = { name:"", level:SPELL_LEVEL.CANTRIP, school:SPELL_SCHOOL.EVOCATION, castingTime:"", zakres:"", duration:"", components:"", description:"", notes:"", tags:[] };

function SpellsScreen({ spells, setSpells, char, setChar }) {
  const T  = useT();
  const lang = useLang();
  const SP = T.SPELLS;

  const [activeLevel, setActiveLevel] = useState(null);
  const [activeSchool, setActiveSchool] = useState(null);
  const [sortMode, setSortMode] = useState("level"); // 'level' | 'school'
  const [showSlots, setShowSlots] = useState(false);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const { expanded, activeTag, setActiveTag, allTags, upd, toggle } = useEntityList(spells, setSpells);

  const pb    = char.profBonus || 2;
  const spMod = abilityMod((char.stats || {})[char.spellcastingAbility || "INT"]);
  const inUseCount = spells.filter(s => s.inUse).length;
  const displayLevel  = lv => T.LABELS.spellLevel[lv]  ?? lv;
  const displaySchool = sc => T.LABELS.spellSchool[sc] ?? sc;

  const visible = spells
    .filter(s => !activeLevel  || s.level === activeLevel)
    .filter(s => !activeSchool || s.school === activeSchool)
    .filter(s => !activeTag || hasTag(s.tags, activeTag))
    .filter(s => matchesSearch(search, [s.name, plainText(s.description), s.notes, displaySchool(s.school), displayLevel(s.level), ...(s.tags || []).map(t => displayTag(t, lang))]))
    .sort((a, b) => {
      const pinDiff = (b.pinned?1:0) - (a.pinned?1:0);
      if (pinDiff) return pinDiff;
      if (sortMode === "school") return (a.school||"").localeCompare(b.school||"") || SPELL_LEVELS.indexOf(a.level) - SPELL_LEVELS.indexOf(b.level);
      return SPELL_LEVELS.indexOf(a.level) - SPELL_LEVELS.indexOf(b.level) || (a.name||"").localeCompare(b.name||"");
    });

  const groups = [
    [SP.cantripsTitle,     visible.filter(sp => sp.level === SPELL_LEVEL.CANTRIP)],
    [SP.activeSpellsTitle, visible.filter(sp => sp.level !== SPELL_LEVEL.CANTRIP)],
  ];

  const toggleInUse = id => setSpells(l => l.map(x => x.id === id ? { ...x, inUse: !x.inUse } : x));
  const saveSpell   = sp => setSpells(l => sp.id
    ? l.map(x => x.id === sp.id ? sp : x)
    : [...l, { ...sp, id: Date.now(), pinned: false, inUse: false }]);
  const deleteSpell = id => setSpells(l => l.filter(x => x.id !== id));

  return (
    <>
      <ListToolbar
        search={search} onSearch={setSearch}
        onAdd={() => setEditing({ item: { ...EMPTY_SPELL }, isNew: true })} addLabel={SP.add}
        summary={[SP.count(spells.length, inUseCount), T.LIST.shown(visible.length, spells.length)].filter(Boolean).join(" · ")}
        extraActions={
          <button className={`hj-btn spell-slots-btn${showSlots ? " on" : ""}`} aria-expanded={showSlots} onClick={() => setShowSlots(s => !s)}>
            <Icon name={showSlots ? "close" : "settings"} size="1em"/> <span>{showSlots ? SP.hideSlots : SP.manageSlots}</span>
          </button>
        }
        filterGroups={[
          { key:"sort", label:T.LIST.sortBy, value:sortMode, onChange:setSortMode, isSort:true,
            options: [{ value:"level", label:SP.sortByLevel }, { value:"school", label:SP.sortBySchool }] },
          { key:"level", label:T.LIST.level, value:activeLevel, onChange:setActiveLevel,
            options: SPELL_LEVELS.map((lv, i) => ({ value:lv, label:T.SPELL_LEVELS[i] ?? lv, count:spells.filter(s => s.level === lv).length })).filter(o => o.count) },
          { key:"school", label:T.LIST.school, value:activeSchool, onChange:setActiveSchool,
            options: SPELL_SCHOOLS.map((sc, i) => ({ value:sc, label:T.SPELL_SCHOOLS[i] ?? sc, icon:SPELL_SCHOOL_ICONS[sc], count:spells.filter(s => s.school === sc).length })).filter(o => o.count) },
          { key:"tag", label:T.LIST.tags, value:activeTag, onChange:setActiveTag,
            options: allTags.map(tag => ({ value:tag, label:displayTag(tag, lang), count:spells.filter(x => hasTag(x.tags, tag)).length })) },
        ]}/>

      {showSlots && (
        <div className="card spell-slots-card">
          <div className="sect-divider">{SP.slotsSectionTitle}</div>
          <div className="spell-ability-row">
            <label className="form-field" style={{ margin: 0 }}>
              <span className="form-label">{SP.castingAbility}</span>
              <select className="g-select g-input" value={char.spellcastingAbility || "INT"}
                onChange={e => setChar(c => ({ ...c, spellcastingAbility: e.target.value }))}>
                {STAT_KEYS.map(s => <option key={s} value={s}>{T.CHAR.statAbbr?.[s] || s}</option>)}
              </select>
            </label>
            <span className="spell-stats">{SP.spellStats(8 + pb + spMod, numMod(pb + spMod))}</span>
          </div>
          <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
        </div>
      )}

      {spells.length === 0 && <div className="card empty-state">{SP.empty}</div>}
      {spells.length > 0 && visible.length === 0 && <div className="card empty-state">{T.LIST.noResults}</div>}

      <div className="entity-grid">
        {groups.map(([label, items]) => items.length > 0 && [
          <div key={label} className="sect-divider">{label}</div>,
          ...items.map(renderSpell),
        ])}
      </div>

      {editing && (
        <EntityEditModal kind="spells" initial={editing.item} isNew={editing.isNew} textFields={["description", "notes"]}
          onSave={saveSpell} onDelete={() => deleteSpell(editing.item.id)} onClose={() => setEditing(null)}>
          {(d, set) => <>
            <ChoiceChips label={SP.level} value={d.level} onChange={v => set("level", v)}
              options={SPELL_LEVELS.map((lv, i) => ({ value:lv, label:T.SPELL_LEVELS[i] ?? lv }))}/>
            <ChoiceChips label={SP.school} value={d.school} onChange={v => set("school", v)}
              options={SPELL_SCHOOLS.map((sc, i) => ({ value:sc, label:T.SPELL_SCHOOLS[i] ?? sc, icon:SPELL_SCHOOL_ICONS[sc] }))}/>
            <div className="form-grid">
              <label className="form-field"><span className="form-label">{SP.castingTimeLbl}</span>
                <input className="g-input" value={d.castingTime || ""} placeholder={SP.castingTimePh} onChange={e => set("castingTime", e.target.value)}/></label>
              <label className="form-field"><span className="form-label">{SP.rangeLbl}</span>
                <input className="g-input" value={d.zakres || ""} placeholder={SP.rangePh} onChange={e => set("zakres", e.target.value)}/></label>
              <label className="form-field"><span className="form-label">{SP.durationLbl}</span>
                <input className="g-input" value={d.duration || ""} placeholder={SP.durationPh} onChange={e => set("duration", e.target.value)}/></label>
              <label className="form-field"><span className="form-label">{SP.componentsLbl}</span>
                <input className="g-input" value={d.components || ""} placeholder={SP.componentsPh} onChange={e => set("components", e.target.value)}/></label>
            </div>
            <RichTextArea label={T.LIST.description} value={d.description} placeholder={SP.fullDescPh} onChange={v => set("description", v)} rows={7}/>
            <RichTextArea label={SP.higherLevels} value={d.notes} placeholder={SP.higherLevelsPh} onChange={v => set("notes", v)} rows={3}/>
            <div className="form-field">
              <span className="form-label">{T.LIST.tagsLabel}</span>
              <TagsEditor tags={d.tags || []} onChange={v => set("tags", v)}
                suggestions={(d.tags || []).some(t => (T.UI.SUGGESTED_ACTION_TAGS || []).some(s => sameTag(s, t))) ? [] : T.UI.SUGGESTED_ACTION_TAGS}/>
            </div>
          </>}
        </EntityEditModal>
      )}
    </>
  );

  function renderSpell(sp) {
    const open = !!expanded[sp.id];
    const brief = [sp.castingTime, sp.zakres].filter(Boolean).join(" · ");
    return (
      <EntityCard key={sp.id} id={sp.id}
        icon={SPELL_SCHOOL_ICONS[sp.school] || "diamond"} iconTone="spell" title={sp.name}
        open={open} onToggle={() => toggle(sp.id)}
        pinned={sp.pinned} onPin={() => upd(sp.id, "pinned", !sp.pinned)}
        onEdit={() => setEditing({ item: sp, isNew: false })}
        accent={sp.inUse ? "blue" : null}
        meta={<>
          <span className="meta-badge spell">{displayLevel(sp.level)}</span>
          {sp.school && <span className="meta-badge">{displaySchool(sp.school)}</span>}
          {!open && brief && <span className="meta-sub">{brief}</span>}
        </>}
        quick={<Toggle on={!!sp.inUse} onToggle={() => toggleInUse(sp.id)} label={sp.inUse ? SP.prepared : SP.known} color="blue"/>}
        preview={sp.description ? plainText(sp.description) : null}>
        <FieldGrid fields={[
          [SP.castingTimeLbl, sp.castingTime],
          [SP.rangeLbl, sp.zakres],
          [SP.durationLbl, sp.duration],
          [SP.componentsLbl, sp.components],
        ]}/>
        <RichText text={sp.description}/>
        {sp.notes && <div className="ecard-subsection"><div className="form-label">{SP.higherLevels}</div><RichText text={sp.notes}/></div>}
        <TagList tags={sp.tags}/>
      </EntityCard>
    );
  }
}
export default memo(SpellsScreen);
