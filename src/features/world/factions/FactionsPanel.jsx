import { useState, memo } from 'react';
import { FACTION_TYPES, FACTION_RANKS, FACTION_RANK_ICONS, FACTION_TYPE_ICONS } from '../../../constants/gameConstants';
import { FACTION_TYPE, FACTION_RANK } from '../../../constants/enums.js';
import { TagsEditor } from '../../../shared/ui';
import { useT, useLang } from '../../../i18n/translations';
import { displayTag, hasTag } from '../../../utils/tags';
import { useScrollToEntity } from '../../../hooks/useScrollToEntity';
import { useEntityList } from '../../../hooks/useEntityList';
import ListToolbar from '../../../shared/ListToolbar';
import EntityCard, { FieldGrid, TagList } from '../../../shared/EntityCard';
import EntityEditModal, { ChoiceChips, RichTextArea } from '../../../shared/EntityEditModal';
import RichText from '../../../shared/RichText';
import { matchesSearch } from '../../../utils/search';
import { plainText } from '../../../utils/markdown';

const EMPTY_FACTION = { name:"", type:FACTION_TYPE.GUILD, rank:FACTION_RANK.UNKNOWN, leader:"", headquarters:"", goal:"", notes:"", tags:[] };
/* Stosunek do frakcji → ton karty (sojusz zielony, wrogość czerwony) */
const RANK_TONE = {
  [FACTION_RANK.ALLY]: "ally", [FACTION_RANK.MEMBER]: "ally", [FACTION_RANK.OFFICER]: "ally", [FACTION_RANK.LEADER]: "ally",
  [FACTION_RANK.ENEMY]: "hostile", [FACTION_RANK.NEUTRAL]: "neutral", [FACTION_RANK.UNKNOWN]: "unknown",
};
const TONE_ACCENT = { ally: "green", hostile: "red" };

function FactionsPanel({ factions, setFactions, openEntity }) {
  const T = useT();
  const lang = useLang();
  const F = T.FACTIONS;

  const [filterType, setFilterType] = useState(null);
  const [filterRank, setFilterRank] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const { expanded, setExpanded, activeTag, setActiveTag, allTags, upd, toggle } = useEntityList(factions, setFactions);
  useScrollToEntity(openEntity, factions, setExpanded);

  const displayFactionType = type => T.LABELS.factionType[type] || type;
  const displayFactionRank = rank => T.LABELS.factionRank[rank] || rank;
  const saveFaction   = f => setFactions(l => f.id ? l.map(x => x.id === f.id ? f : x) : [...l, { ...f, id: Date.now(), pinned: false }]);
  const deleteFaction = id => setFactions(l => l.filter(x => x.id !== id));

  const visible = factions
    .filter(f => (!activeTag || hasTag(f.tags, activeTag)) && (!filterType||f.type===filterType))
    .filter(f => !filterRank || (f.rank || FACTION_RANK.UNKNOWN) === filterRank)
    .filter(f => matchesSearch(search, [f.name, f.goal, plainText(f.notes), f.leader, f.headquarters, displayFactionType(f.type), displayFactionRank(f.rank || FACTION_RANK.UNKNOWN), ...(f.tags || []).map(t => displayTag(t, lang))]))
    .sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0));

  return (
    <>
      <ListToolbar
        search={search} onSearch={setSearch}
        onAdd={() => setEditing({ item: { ...EMPTY_FACTION }, isNew: true })} addLabel={F.add}
        summary={[F.count(factions.length), T.LIST.shown(visible.length, factions.length)].filter(Boolean).join(" · ")}
        filterGroups={[
          { key:"type", label:T.LIST.type, value:filterType, onChange:setFilterType,
            options: FACTION_TYPES.map(t => ({ value:t, label:displayFactionType(t), icon:FACTION_TYPE_ICONS[t], count:factions.filter(f => f.type === t).length })).filter(o => o.count) },
          { key:"rank", label:T.LIST.rank, value:filterRank, onChange:setFilterRank,
            options: FACTION_RANKS.map(r => ({ value:r, label:displayFactionRank(r), icon:FACTION_RANK_ICONS[r], count:factions.filter(f => (f.rank || FACTION_RANK.UNKNOWN) === r).length })).filter(o => o.count) },
          { key:"tag", label:T.LIST.tags, value:activeTag, onChange:setActiveTag,
            options: allTags.map(tag => ({ value:tag, label:displayTag(tag, lang), count:factions.filter(x => hasTag(x.tags, tag)).length })) },
        ]}/>

      {factions.length === 0 && <div className="card empty-state">{F.empty}<br/><span style={{ fontSize:"0.85rem" }}>{F.emptySub}</span></div>}
      {factions.length > 0 && visible.length === 0 && <div className="card empty-state">{T.LIST.noResults}</div>}

      <div className="entity-grid">
        {visible.map(fac => {
          const rank = fac.rank || FACTION_RANK.UNKNOWN;
          const tone = RANK_TONE[rank] || "unknown";
          return (
            <EntityCard key={fac.id} id={fac.id}
              icon={FACTION_TYPE_ICONS[fac.type] || FACTION_RANK_ICONS[rank]} iconTone={tone} title={fac.name}
              open={!!expanded[fac.id]} onToggle={() => toggle(fac.id)}
              pinned={fac.pinned} onPin={() => upd(fac.id, "pinned", !fac.pinned)}
              onEdit={() => setEditing({ item: fac, isNew: false })}
              accent={TONE_ACCENT[tone]}
              meta={<>
                <span className={`meta-badge ${tone}`}>{displayFactionRank(rank)}</span>
                {fac.type && <span className="meta-badge">{displayFactionType(fac.type)}</span>}
              </>}
              preview={fac.goal || (fac.notes ? plainText(fac.notes) : null)}>
              <FieldGrid fields={[
                [F.leader, fac.leader], [F.headquarters, fac.headquarters], [F.goal, fac.goal],
              ]}/>
              <RichText text={fac.notes}/>
              <TagList tags={fac.tags}/>
            </EntityCard>
          );
        })}
      </div>

      {editing && (
        <EntityEditModal kind="factions" initial={editing.item} isNew={editing.isNew} textFields={["notes"]}
          onSave={saveFaction} onDelete={() => deleteFaction(editing.item.id)} onClose={() => setEditing(null)}>
          {(d, set) => <>
            <ChoiceChips label={F.type} value={d.type} onChange={v => set("type", v)}
              options={FACTION_TYPES.map(t => ({ value:t, label:displayFactionType(t), icon:FACTION_TYPE_ICONS[t] }))}/>
            <ChoiceChips label={T.LIST.rank} value={d.rank || FACTION_RANK.UNKNOWN} onChange={v => set("rank", v)}
              options={FACTION_RANKS.map(r => ({ value:r, label:displayFactionRank(r), icon:FACTION_RANK_ICONS[r] }))}/>
            <div className="form-grid">
              <label className="form-field"><span className="form-label">{F.leader}</span>
                <input className="g-input" value={d.leader || ""} placeholder={F.leaderPh} onChange={e => set("leader", e.target.value)}/></label>
              <label className="form-field"><span className="form-label">{F.headquarters}</span>
                <input className="g-input" value={d.headquarters || ""} placeholder={F.hqPh} onChange={e => set("headquarters", e.target.value)}/></label>
              <label className="form-field form-span-2"><span className="form-label">{F.goal}</span>
                <input className="g-input" value={d.goal || ""} placeholder={F.goalPh} onChange={e => set("goal", e.target.value)}/></label>
            </div>
            <RichTextArea label={T.LIST.notes} value={d.notes} placeholder={F.editNotesPh} onChange={v => set("notes", v)}/>
            <div className="form-field">
              <span className="form-label">{T.LIST.tagsLabel}</span>
              <TagsEditor tags={d.tags || []} onChange={v => set("tags", v)}/>
            </div>
          </>}
        </EntityEditModal>
      )}
    </>
  );
}
export default memo(FactionsPanel);
