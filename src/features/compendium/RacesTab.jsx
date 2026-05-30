import { useState, useEffect, useMemo } from 'react';
import { fetchList, fetchDetail } from '../../utils/dnd5eApi';

const LBL = { fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-muted)" };

function Skel({ h="1rem", w="100%", mb="0.3rem" }) {
  return <div style={{ height:h, width:w, background:"rgba(128,128,128,0.14)", borderRadius:3, marginBottom:mb, animation:"skel 1.4s ease-in-out infinite" }}/>;
}

function RaceDetail({ d }) {
  if (!d) return null;
  const bonuses = (d.ability_bonuses||[]).map(b => `${b.ability_score.name} +${b.bonus}`).join(", ");
  const langs   = (d.languages||[]).map(l => l.name).join(", ");
  const traits  = (d.traits||[]).map(t => t.name).join(", ");
  const proficiencies = (d.starting_proficiencies||[]).map(p => p.name).join(", ");
  return (
    <div style={{ marginTop:"0.6rem", paddingTop:"0.6rem", borderTop:"1px solid rgba(128,128,128,0.15)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.4rem", marginBottom:"0.6rem" }}>
        {[["Prędkość", `${d.speed} stóp`],["Rozmiar", d.size],["Bonusy cech", bonuses],
          ["Języki", langs],["Cechy rasowe", traits],["Biegłości", proficiencies]
        ].filter(([,v]) => v).map(([k,v]) => (
          <div key={k}><div style={LBL}>{k}</div>
            <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.85rem", color:"var(--text-label)", lineHeight:1.5 }}>{v}</div>
          </div>
        ))}
      </div>
      {d.alignment && <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", color:"var(--text-muted)", marginBottom:"0.4rem", fontStyle:"italic" }}>{d.alignment}</div>}
      {d.age && <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", color:"var(--text-muted)", marginBottom:"0.4rem" }}>{d.age}</div>}
      {d.size_description && <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", color:"var(--text-muted)", marginBottom:"0.4rem" }}>{d.size_description}</div>}
      {(d.language_desc) && <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", color:"var(--text-muted)" }}>{d.language_desc}</div>}
    </div>
  );
}

export default function RacesTab() {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [query, setQuery]           = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails]       = useState({});
  const [detailLoading, setDetailLoading] = useState(null);

  useEffect(() => {
    fetchList('/api/races')
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
      <input className="g-input" placeholder="Szukaj rasy…" value={query}
        onChange={e => setQuery(e.target.value)} style={{ marginBottom:"0.8rem" }}/>
      <div style={{ ...LBL, marginBottom:"0.5rem" }}>{loading?"Ładowanie…":`${filtered.length} ras`}</div>
      {error && <div className="card empty-state" style={{ color:"#c04040" }}>Błąd: {error}</div>}
      {loading && Array.from({length:6}).map((_,i) => (
        <div key={i} className="card" style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem" }}><Skel h="1rem" w="50%"/></div>
      ))}
      {!loading && filtered.map(item => {
        const d = details[item.index];
        const isOpen = expandedId === item.index;
        const bonuses = d ? (d.ability_bonuses||[]).map(b=>`${b.ability_score.name} +${b.bonus}`).join(", ") : "";
        return (
          <div key={item.index} className={`card${isOpen?" pinned":""}`}
            style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem", cursor:"pointer" }}
            onClick={() => handleExpand(item)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700 }}>{item.name}</div>
                {bonuses && <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.78rem", color:"var(--text-muted)", marginTop:"0.1rem" }}>{bonuses}</div>}
              </div>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--text-dim)" }}>{isOpen?"▲":"▼"}</span>
            </div>
            {detailLoading===item.index && <div style={{ marginTop:"0.5rem" }}><Skel h="0.8rem"/><Skel h="2.5rem"/></div>}
            {isOpen && d && <RaceDetail d={d}/>}
          </div>
        );
      })}
      {!loading && filtered.length===0 && <div className="card empty-state">Brak wyników.</div>}
    </div>
  );
}
