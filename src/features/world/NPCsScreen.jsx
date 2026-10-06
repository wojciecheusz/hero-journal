import { useState, memo } from 'react';
import { REL_ICONS } from '../../constants/gameConstants';
import { TagsEditor } from '../../shared/ui';
import { useT, useLang } from '../../i18n/translations';
import { displayTag, hasTag } from '../../utils/tags';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';
import { useEntityList } from '../../hooks/useEntityList';
import ListToolbar from '../../shared/ListToolbar';
import EntityCard, { FieldGrid, TagList } from '../../shared/EntityCard';
import EntityEditModal, { ChoiceChips, RichTextArea } from '../../shared/EntityEditModal';
import RichText from '../../shared/RichText';
import { matchesSearch } from '../../utils/search';
import { plainText } from '../../utils/markdown';

const RELATIONS = ["ally", "neutral", "hostile", "unknown", "dead"];
const REL_ACCENT = { ally: "green", hostile: "red" };
const EMPTY_NPC = { name:"", role:"", relation:"unknown", affiliation:"", metAt:"", connections:"", notes:"", tags:[] };

function NPCsScreen({ npcs, setNPCs, openEntity }) {
  const T  = useT();
  const lang = useLang();
  const N  = T.NPCS;
  const RL = T.REL_LABELS;

  const [filterRel, setFilterRel] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const { expanded, setExpanded, activeTag, setActiveTag, allTags, upd, toggle } = useEntityList(npcs, setNPCs);
  useScrollToEntity(openEntity, npcs, setExpanded);

  const saveNPC   = n => setNPCs(l => n.id ? l.map(x => x.id === n.id ? n : x) : [...l, { ...n, id: Date.now(), pinned: false }]);
  const deleteNPC = id => setNPCs(l => l.filter(x => x.id !== id));

  const visible = npcs
    .filter(n => !activeTag || hasTag(n.tags, activeTag))
    .filter(n => !filterRel || (n.relation || "unknown") === filterRel)
    .filter(n => matchesSearch(search, [n.name, n.role, n.affiliation, n.metAt, plainText(n.notes), n.connections, RL[n.relation || "unknown"], ...(n.tags || []).map(t => displayTag(t, lang))]))
    /* Przypięci na górze, martwi na końcu listy */
    .sort((a, b) => (b.pinned?1:0) - (a.pinned?1:0) || (a.relation === "dead") - (b.relation === "dead"));

  return (
    <>
      <ListToolbar
        search={search} onSearch={setSearch}
        onAdd={() => setEditing({ item: { ...EMPTY_NPC }, isNew: true })} addLabel={N.add}
        summary={[N.count(npcs.length), T.LIST.shown(visible.length, npcs.length)].filter(Boolean).join(" · ")}
        filterGroups={[
          { key:"rel", label:T.LIST.relation, value:filterRel, onChange:setFilterRel,
            options: RELATIONS.map(r => ({ value:r, label:RL[r], icon:REL_ICONS[r], count:npcs.filter(n => (n.relation||"unknown") === r).length })).filter(o => o.count) },
          { key:"tag", label:T.LIST.tags, value:activeTag, onChange:setActiveTag,
            options: allTags.map(tag => ({ value:tag, label:displayTag(tag, lang), count:npcs.filter(x => hasTag(x.tags, tag)).length })) },
        ]}/>

      {npcs.length === 0 && <div className="card empty-state">{N.empty}</div>}
      {npcs.length > 0 && visible.length === 0 && <div className="card empty-state">{T.LIST.noResults}</div>}

      <div className="entity-grid">
        {visible.map(npc => {
          const open = !!expanded[npc.id];
          const rel  = npc.relation || "unknown";
          return (
            <EntityCard key={npc.id} id={npc.id}
              icon={REL_ICONS[rel]} iconTone={rel} title={npc.name}
              open={open} onToggle={() => toggle(npc.id)}
              pinned={npc.pinned} onPin={() => upd(npc.id, "pinned", !npc.pinned)}
              onEdit={() => setEditing({ item: npc, isNew: false })}
              accent={REL_ACCENT[rel]}
              meta={<>
                <span className={`meta-badge ${rel}`}>{RL[rel]}</span>
                {npc.role && !open && <span className="meta-sub">{npc.role}</span>}
              </>}
              preview={!open && npc.notes ? plainText(npc.notes) : (npc.affiliation || null)}>
              <FieldGrid fields={[
                [N.role, npc.role], [N.affiliation, npc.affiliation],
                [N.metAt, npc.metAt], [N.connections, npc.connections],
              ]}/>
              <RichText text={npc.notes}/>
              <TagList tags={npc.tags}/>
            </EntityCard>
          );
        })}
      </div>

      {editing && (
        <EntityEditModal kind="npcs" initial={editing.item} isNew={editing.isNew} textFields={["notes"]}
          onSave={saveNPC} onDelete={() => deleteNPC(editing.item.id)} onClose={() => setEditing(null)}>
          {(d, set) => <>
            <ChoiceChips label={T.LIST.relation} value={d.relation || "unknown"} onChange={v => set("relation", v)}
              options={RELATIONS.map(r => ({ value:r, label:RL[r], icon:REL_ICONS[r] }))}/>
            <div className="form-grid">
              <label className="form-field"><span className="form-label">{N.role}</span>
                <input className="g-input" value={d.role || ""} placeholder={N.rolePh} onChange={e => set("role", e.target.value)}/></label>
              <label className="form-field"><span className="form-label">{N.affiliation}</span>
                <input className="g-input" value={d.affiliation || ""} placeholder={N.affiliationPh} onChange={e => set("affiliation", e.target.value)}/></label>
              <label className="form-field"><span className="form-label">{N.metAt}</span>
                <input className="g-input" value={d.metAt || ""} placeholder={N.metAtPh} onChange={e => set("metAt", e.target.value)}/></label>
              <label className="form-field"><span className="form-label">{N.connections}</span>
                <input className="g-input" value={d.connections || ""} placeholder={N.connectionsPh} onChange={e => set("connections", e.target.value)}/></label>
            </div>
            <RichTextArea label={T.LIST.notes} value={d.notes} placeholder={N.editNotesPh} onChange={v => set("notes", v)}/>
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
export default memo(NPCsScreen);
