import { useState, memo } from 'react';
import { LEGEND_ITEMS } from '../../constants/gameConstants';
import { parseEntityLinksWithTooltips } from '../../shared/ui';
import { useT } from '../../i18n/translations';

const today = () => new Date().toISOString().slice(0, 10);

function SessionsScreen({ sessions, setSessions, npcs, locations, quests, inventory, skills, onNavigate }) {
  const T = useT();

  const [openIds, setOpenIds] = useState({});
  const [editingId, setEditingId] = useState(null);

  const addSesja = () => {
    const e = { id: Date.now(), number: sessions.length + 1, date: today(), title: `#${sessions.length + 1}`, notes: "" };
    setSessions(s => [e, ...s]);
    setOpenIds(o => ({ ...o, [e.id]: true }));
    setEditingId(e.id);
  };
  const upd = (id, f, v) => setSessions(s => s.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del = id => { setSessions(s => s.filter(x => x.id !== id)); if (editingId === id) setEditingId(null); };
  const toggle = id => { setOpenIds(o => ({ ...o, [id]: !o[id] })); if (!openIds[id]) setEditingId(null); };

  const hasAny = npcs.length > 0 || locations.length > 0 || quests.length > 0 || inventory.length > 0 || skills.length > 0;

  return (
    <>
      <div className="row" style={{ justifyContent:"space-between" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.12em" }}>{sessions.length} {sessions.length === 1 ? "session" : "sessions"}</span>
        <button className="btn-ghost" onClick={addSesja}>{T.SESSIONS.add}</button>
      </div>

      {hasAny && (
        <div className="sess-legend">
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.1em", textTransform:"uppercase" }}>{T.SESSIONS.legendHint}</span>
          {LEGEND_ITEMS.map(li => {
            const counts = { npc: npcs.length, location: locations.length, quest: quests.length, inventory: inventory.length, skill: skills.length };
            if (!counts[li.type]) return null;
            return <div key={li.type} className="sess-legend-item"><div className="legend-dot" style={{ background: li.color, border: `1px solid ${li.border}` }}/><span style={{ color: li.border }}>{li.label}</span></div>;
          })}
        </div>
      )}

      {sessions.length === 0 && <div className="card empty-state">{T.SESSIONS.empty}</div>}
      {sessions.map(sess => {
        const open = !!openIds[sess.id];
        const editing = editingId === sess.id;
        const parsed = parseEntityLinksWithTooltips(sess.notes, npcs, locations, quests, inventory, skills, onNavigate);
        return (
          <div key={sess.id} className="sess-entry">
            <div className={`sess-header${open ? " open" : ""}`} onClick={() => toggle(sess.id)}>
              <span className="sess-num">#{String(sess.number).padStart(2, "0")}</span>
              <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"0.92rem" }}
                value={sess.title} onChange={e => { e.stopPropagation(); upd(sess.id, "title", e.target.value); }} onClick={e => e.stopPropagation()}/>
              <input type="date" style={{ background:"transparent", border:"none", color:"inherit", fontFamily:"inherit", fontSize:"0.75rem", outline:"none", flexShrink:0, opacity:0.6 }}
                value={sess.date} onChange={e => { e.stopPropagation(); upd(sess.id, "date", e.target.value); }} onClick={e => e.stopPropagation()}/>
              <span style={{ fontSize:"0.65rem", flexShrink:0, opacity:0.5 }}>{open ? "▲" : "▼"}</span>
            </div>
            {open && (
              <div className="sess-body">
                {editing ? (
                  <>
                    <textarea className="g-textarea" rows={6} autoFocus
                      placeholder={T.SESSIONS.notesPh}
                      value={sess.notes} onChange={e => upd(sess.id, "notes", e.target.value)}/>
                    <div className="row mt05" style={{ justifyContent:"space-between" }}>
                      <button className="btn-ghost" onClick={() => del(sess.id)}>{T.SESSIONS.delete}</button>
                      <button className="btn-ghost" onClick={() => setEditingId(null)}>{T.SESSIONS.done}</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sess-rendered" data-placeholder={T.SESSIONS.emptyNote}
                      onClick={() => setEditingId(sess.id)}>{sess.notes ? parsed : null}</div>
                    <div className="row mt05" style={{ justifyContent:"space-between" }}>
                      <button className="btn-ghost" onClick={() => del(sess.id)}>{T.SESSIONS.delete}</button>
                      <button className="btn-ghost" style={{ opacity:0.7 }} onClick={() => setEditingId(sess.id)}>{T.SESSIONS.edit}</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
export default memo(SessionsScreen);
