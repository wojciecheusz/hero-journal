import { useState, useEffect, useMemo } from 'react';
import { fetchList, fetchDetail } from '../../utils/dnd5eApi';

const LBL = { fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-muted)" };

function Skel({ h="1rem", w="100%", mb="0.3rem" }) {
  return <div style={{ height:h, width:w, background:"rgba(128,128,128,0.14)", borderRadius:3, marginBottom:mb, animation:"skel 1.4s ease-in-out infinite" }}/>;
}

function ClassDetail({ d }) {
  if (!d) return null;
  const savingThrows = (d.saving_throws||[]).map(s=>s.name).join(", ");
  const armorProf = (d.proficiencies||[]).filter(p=>p.type==="Armor"||p.name.toLowerCase().includes("armor")||p.name.toLowerCase().includes("armors")).map(p=>p.name).join(", ");
  const weaponProf = (d.proficiencies||[]).filter(p=>p.type==="Weapon"||p.name.toLowerCase().includes("weapon")||p.name.toLowerCase().includes("weapons")).map(p=>p.name).join(", ");
  const toolProf = (d.proficiencies||[]).filter(p=>p.type==="Artisan's Tools"||p.name.toLowerCase().includes("tool")||p.name.toLowerCase().includes("instrument")).map(p=>p.name).join(", ");
  const skills = (d.proficiency_choices||[]).filter(c=>c.type==="Skills"||c.desc?.toLowerCase().includes("skill")).map(c=>c.desc||"").join(" ");
  return (
    <div style={{ marginTop:"0.6rem", paddingTop:"0.6rem", borderTop:"1px solid rgba(128,128,128,0.15)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginBottom:"0.6rem" }}>
        {[
          ["Kość Wytrzymałości", `d${d.hit_die}`],
          ["Rzuty Obronne", savingThrows],
          ["Biegłości — zbroje", armorProf||"—"],
          ["Biegłości — broń", weaponProf||"—"],
          ...(toolProf ? [["Narzędzia", toolProf]] : []),
        ].map(([k,v]) => v ? (
          <div key={k}><div style={LBL}>{k}</div>
            <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.85rem", color:"var(--text-label)", lineHeight:1.5 }}>{v}</div>
          </div>
        ) : null)}
      </div>
      {skills && <div style={{ marginBottom:"0.4rem" }}>
        <div style={LBL}>Umiejętności</div>
        <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.85rem", color:"var(--text-muted)", lineHeight:1.5 }}>{skills}</div>
      </div>}
      {d.spellcasting && <div style={{ marginTop:"0.4rem", padding:"0.4rem 0.6rem", background:"rgba(128,128,128,0.06)", borderLeft:"2px solid var(--spell-border)" }}>
        <div style={{ ...LBL, marginBottom:"0.2rem" }}>Rzucanie czarów</div>
        <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.85rem", color:"var(--spell-muted)" }}>
          Cecha rzucania: {d.spellcasting.spellcasting_ability?.name || "—"}
        </div>
      </div>}
      {/* Cechy poziomu 1 */}
      {(d.class_levels || d.subclasses) && <div style={{ marginTop:"0.5rem" }}>
        <div style={{ ...LBL, marginBottom:"0.3rem" }}>Podklasy</div>
        {(d.subclasses||[]).map(s => (
          <span key={s.index} style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", display:"inline-block", margin:"0.1rem 0.2rem 0.1rem 0",
            padding:"0.15rem 0.4rem", border:"1px solid rgba(128,128,128,0.2)", color:"var(--text-muted)" }}>{s.name}</span>
        ))}
      </div>}
    </div>
  );
}

export default function ClassesTab() {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [query, setQuery]           = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails]       = useState({});
  const [detailLoading, setDetailLoading] = useState(null);

  useEffect(() => {
    fetchList('/api/classes')
      .then(d => { setItems(d.results||[]); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    items.filter(i => !query || i.name.toLowerCase().includes(query.toLowerCase()))
  , [items, query]);

  const handleExpand = async (item) => {
    if (expandedId === item.index) { setExpandedId(null); return; }
    setExpandedId(item.index);
    if (!details[item.index]) {
      setDetailLoading(item.index);
      try { const d = await fetchDetail(item.url); setDetails(p => ({...p, [item.index]:d})); } catch {}
      setDetailLoading(null);
    }
  };

  return (
    <div>
      <input className="g-input" placeholder="Szukaj klasy…" value={query}
        onChange={e => setQuery(e.target.value)} style={{ marginBottom:"0.8rem" }}/>
      <div style={{ ...LBL, marginBottom:"0.5rem" }}>{loading?"Ładowanie…":`${filtered.length} klas`}</div>
      {error && <div className="card empty-state" style={{ color:"#c04040" }}>Błąd: {error}</div>}
      {loading && Array.from({length:6}).map((_,i) => (
        <div key={i} className="card" style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem" }}><Skel h="1rem" w="45%"/></div>
      ))}
      {!loading && filtered.map(item => {
        const d = details[item.index];
        const isOpen = expandedId === item.index;
        return (
          <div key={item.index} className={`card${isOpen?" pinned":""}`}
            style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem", cursor:"pointer" }}
            onClick={() => handleExpand(item)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700 }}>{item.name}</div>
                {d && <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.78rem", color:"var(--text-muted)", marginTop:"0.1rem" }}>
                  d{d.hit_die} · Rzuty: {(d.saving_throws||[]).map(s=>s.name).join(", ")}
                </div>}
              </div>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--text-dim)" }}>{isOpen?"▲":"▼"}</span>
            </div>
            {detailLoading===item.index && <div style={{ marginTop:"0.5rem" }}><Skel h="0.8rem"/><Skel h="3rem"/></div>}
            {isOpen && d && <ClassDetail d={d}/>}
          </div>
        );
      })}
      {!loading && filtered.length===0 && <div className="card empty-state">Brak wyników.</div>}
    </div>
  );
}
