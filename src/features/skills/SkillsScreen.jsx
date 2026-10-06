import { useState, memo } from 'react';
import { SKILL_CATS, SKILL_CAT_ICONS } from '../../constants/gameConstants';
import { SKILL_CAT } from '../../constants/enums.js';
import { TagsEditor, Toggle } from '../../shared/ui';
import { useT, useLang } from '../../i18n/translations';
import { displayTag, hasTag, sameTag } from '../../utils/tags';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';
import { useEntityList } from '../../hooks/useEntityList';
import ListToolbar from '../../shared/ListToolbar';
import EntityCard, { TagList } from '../../shared/EntityCard';
import EntityEditModal, { ChoiceChips, RichTextArea } from '../../shared/EntityEditModal';
import RichText from '../../shared/RichText';
import { matchesSearch } from '../../utils/search';
import { plainText } from '../../utils/markdown';

const RACIAL_VALUES = [SKILL_CAT.RACIAL, "Cecha rasowa", "Racial Feature"];
const FEAT_VALUES   = [SKILL_CAT.FEAT, "Atut", "Feat"];
/* Kategoria kanoniczna — obsługuje też stare wartości PL/EN sprzed migracji */
const catKey = c => RACIAL_VALUES.includes(c) ? SKILL_CAT.RACIAL : FEAT_VALUES.includes(c) ? SKILL_CAT.FEAT : SKILL_CAT.SKILL;
const EMPTY_SKILL = { name:"", category: SKILL_CAT.SKILL, description:"", level:0, tags:[] };

function SkillsScreen({ skills, setSkills, openEntity }) {
  const T    = useT();
  const lang = useLang();
  const SK   = T.SKILLS;
  const CATS = T.SKILL_CATS;
  const catLabel = c => CATS[SKILL_CATS.indexOf(catKey(c))] ?? c;

  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const { expanded, setExpanded, activeTag, setActiveTag, allTags, upd, toggle } = useEntityList(skills, setSkills);
  useScrollToEntity(openEntity, skills, setExpanded);

  const inUseCount  = skills.filter(s => s.inUse).length;
  const toggleInUse = id => setSkills(l => l.map(x => x.id === id ? { ...x, inUse: !x.inUse } : x));
  const saveSkill   = sk => setSkills(l => sk.id
    ? l.map(x => x.id === sk.id ? sk : x)
    : [...l, { ...sk, id: Date.now(), pinned: false, inUse: false }]);
  const deleteSkill = id => setSkills(l => l.filter(x => x.id !== id));

  const visible = skills.filter(s =>
    (!activeTag || hasTag(s.tags, activeTag)) &&
    (!activeCat || catKey(s.category) === activeCat) &&
    matchesSearch(search, [s.name, plainText(s.description), catLabel(s.category), ...(s.tags || []).map(t => displayTag(t, lang))])
  ).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0));

  const groups = [
    [SK.sectionRacial, visible.filter(sk => catKey(sk.category) === SKILL_CAT.RACIAL)],
    [SK.sectionClass,  visible.filter(sk => catKey(sk.category) === SKILL_CAT.SKILL)],
    [SK.sectionFeats,  visible.filter(sk => catKey(sk.category) === SKILL_CAT.FEAT)],
  ];

  return (
    <>
      <ListToolbar
        search={search} onSearch={setSearch}
        onAdd={() => setEditing({ item: { ...EMPTY_SKILL }, isNew: true })} addLabel={SK.add}
        summary={[SK.count(skills.length, inUseCount), T.LIST.shown(visible.length, skills.length)].filter(Boolean).join(" · ")}
        filterGroups={[
          { key:"cat", label:T.LIST.category, value:activeCat, onChange:setActiveCat,
            options: SKILL_CATS.map((c, i) => ({ value:c, label:CATS[i], icon:SKILL_CAT_ICONS[c], count:skills.filter(s => catKey(s.category) === c).length })).filter(o => o.count) },
          { key:"tag", label:T.LIST.tags, value:activeTag, onChange:setActiveTag,
            options: allTags.map(tag => ({ value:tag, label:displayTag(tag, lang), count:skills.filter(x => hasTag(x.tags, tag)).length })) },
        ]}/>

      {skills.length === 0 && <div className="card empty-state">{SK.empty}</div>}
      {skills.length > 0 && visible.length === 0 && <div className="card empty-state">{T.LIST.noResults}</div>}

      <div className="entity-grid">
        {groups.map(([label, items]) => items.length > 0 && [
          <div key={label} className="sect-divider">{label}</div>,
          ...items.map(renderSkill),
        ])}
      </div>

      {editing && (
        <EntityEditModal kind="skills" initial={editing.item} isNew={editing.isNew} textFields={["description"]}
          onSave={saveSkill} onDelete={() => deleteSkill(editing.item.id)} onClose={() => setEditing(null)}>
          {(d, set) => <>
            <ChoiceChips label={T.LIST.category} value={catKey(d.category)} onChange={v => set("category", v)}
              options={SKILL_CATS.map((c, i) => ({ value:c, label:CATS[i], icon:SKILL_CAT_ICONS[c] }))}/>
            <RichTextArea label={T.LIST.description} value={d.description} placeholder={SK.descPh} onChange={v => set("description", v)} rows={7}/>
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

  function renderSkill(sk) {
    const open = !!expanded[sk.id];
    return (
      <EntityCard key={sk.id} id={sk.id}
        icon={SKILL_CAT_ICONS[catKey(sk.category)] || "diamond"} iconTone="skill" title={sk.name}
        open={open} onToggle={() => toggle(sk.id)}
        pinned={sk.pinned} onPin={() => upd(sk.id, "pinned", !sk.pinned)}
        onEdit={() => setEditing({ item: sk, isNew: false })}
        accent={sk.inUse ? "purple" : null}
        meta={<>
          <span className="meta-badge">{catLabel(sk.category)}</span>
          {(sk.tags || []).slice(0, 2).map(t => <span key={t} className="meta-sub">{displayTag(t, lang)}</span>)}
        </>}
        quick={<Toggle on={!!sk.inUse} onToggle={() => toggleInUse(sk.id)} label={sk.inUse ? SK.active : SK.inactive} color="purple"/>}
        preview={sk.description ? plainText(sk.description) : null}>
        <RichText text={sk.description}/>
        <TagList tags={sk.tags}/>
      </EntityCard>
    );
  }
}
export default memo(SkillsScreen);
