import { useState, memo } from 'react';
import { LOC_TYPES, LOC_TYPE_ICONS } from '../../constants/gameConstants';
import { LOC_TYPE } from '../../constants/enums.js';
import { TagsEditor } from '../../shared/ui';
import { useT } from '../../i18n/translations';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';
import { useEntityList } from '../../hooks/useEntityList';
import ListToolbar from '../../shared/ListToolbar';
import EntityCard, { TagList } from '../../shared/EntityCard';
import EntityEditModal, { ChoiceChips, RichTextArea } from '../../shared/EntityEditModal';
import RichText from '../../shared/RichText';
import { matchesSearch } from '../../utils/search';
import { plainText } from '../../utils/markdown';

const EMPTY_LOC = { name:"", type:LOC_TYPE.SETTLEMENT, notes:"", tags:[] };

function LocationsScreen({ locations, setLocations, openEntity }) {
  const T = useT();
  const L = T.LOCATIONS;

  const [filterType, setFilterType] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const { expanded, setExpanded, activeTag, setActiveTag, allTags, upd, toggle } = useEntityList(locations, setLocations);
  useScrollToEntity(openEntity, locations, setExpanded);

  const displayLocType = type => T.LABELS.locType[type] || type;
  const saveLoc   = loc => setLocations(l => loc.id ? l.map(x => x.id === loc.id ? loc : x) : [...l, { ...loc, id: Date.now(), pinned: false }]);
  const deleteLoc = id => setLocations(l => l.filter(x => x.id !== id));

  const visible = locations
    .filter(l => !activeTag || (l.tags || []).includes(activeTag))
    .filter(l => !filterType || l.type === filterType)
    .filter(l => matchesSearch(search, [l.name, plainText(l.notes), displayLocType(l.type), ...(l.tags || [])]))
    .sort((a, b) => (b.pinned?1:0) - (a.pinned?1:0));

  return (
    <>
      <ListToolbar
        search={search} onSearch={setSearch}
        onAdd={() => setEditing({ item: { ...EMPTY_LOC }, isNew: true })} addLabel={L.add}
        summary={[L.count(locations.length), T.LIST.shown(visible.length, locations.length)].filter(Boolean).join(" · ")}
        filterGroups={[
          { key:"type", label:T.LIST.type, value:filterType, onChange:setFilterType,
            options: LOC_TYPES.map(type => ({ value:type, label:displayLocType(type), icon:LOC_TYPE_ICONS[type], count:locations.filter(l => l.type === type).length })).filter(o => o.count) },
          { key:"tag", label:T.LIST.tags, value:activeTag, onChange:setActiveTag,
            options: allTags.map(tag => ({ value:tag, label:tag, count:locations.filter(x => (x.tags||[]).includes(tag)).length })) },
        ]}/>

      {locations.length === 0 && <div className="card empty-state">{L.empty}</div>}
      {locations.length > 0 && visible.length === 0 && <div className="card empty-state">{T.LIST.noResults}</div>}

      <div className="entity-grid">
        {visible.map(loc => (
          <EntityCard key={loc.id} id={loc.id}
            icon={LOC_TYPE_ICONS[loc.type]} title={loc.name}
            open={!!expanded[loc.id]} onToggle={() => toggle(loc.id)}
            pinned={loc.pinned} onPin={() => upd(loc.id, "pinned", !loc.pinned)}
            onEdit={() => setEditing({ item: loc, isNew: false })}
            meta={<>
              <span className="meta-badge">{displayLocType(loc.type)}</span>
              {(loc.tags || []).slice(0, 3).map(t => <span key={t} className="meta-sub">{t}</span>)}
            </>}
            preview={loc.notes ? plainText(loc.notes) : null}>
            <RichText text={loc.notes}/>
            <TagList tags={loc.tags}/>
          </EntityCard>
        ))}
      </div>

      {editing && (
        <EntityEditModal kind="locations" initial={editing.item} isNew={editing.isNew} textFields={["notes"]}
          onSave={saveLoc} onDelete={() => deleteLoc(editing.item.id)} onClose={() => setEditing(null)}>
          {(d, set) => <>
            <ChoiceChips label={T.LIST.type} value={d.type} onChange={v => set("type", v)}
              options={LOC_TYPES.map(type => ({ value:type, label:displayLocType(type), icon:LOC_TYPE_ICONS[type] }))}/>
            <RichTextArea label={T.LIST.notes} value={d.notes} placeholder={L.editNotesPh} onChange={v => set("notes", v)}/>
            <div className="form-field">
              <span className="form-label">{T.LIST.tagsLabel}</span>
              <TagsEditor tags={d.tags || []} onChange={v => set("tags", v)} suggestions={T.UI.SUGGESTED_LOCATION_TAGS}/>
            </div>
          </>}
        </EntityEditModal>
      )}
    </>
  );
}
export default memo(LocationsScreen);
