import { useState, useEffect, useMemo } from 'react';
import { fetchList, fetchDetail } from '../../utils/dnd5eApi';

const LBL = { fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-muted)" };
const CATS = ["Weapon","Armor","Adventuring Gear","Tools","Mounts and Vehicles","Treasure"];
const CAT_PL = { "Weapon":"Broń","Armor":"Zbroja","Adventuring Gear":"Ekwipunek","Tools":"Narzędzia","Mounts and Vehicles":"Wierzchowce","Treasure":"Skarby" };

function Skel({ h="1rem", w="100%", mb="0.3rem" }) {
  return <div style={{ height:h, width:w, background:"rgba(128,128,128,0.14)", borderRadius:3, marginBottom:mb, animation:"skel 1.4s ease-in-out infinite" }}/>;
}

function EquipDetail({ d }) {
  if (!d) return null;
  const cost = d.cost ? `${d.cost.quantity} ${d.cost.unit}` : "—";
  const weight = d.weight ? `${d.weight} funtów` : "—";
  const cat = d.equipment_category?.name || "—";
  const dmg = d.damage ? `${d.damage.damage_dice} ${d.damage.damage_type?.name||""}` : null;
  const props = (d.properties||[]).map(p=>p.name).join(", ");
  const acBase = d.armor_class?.base;
  return (
    <div style={{ marginTop:"0.6rem", paddingTop:"0.6rem", borderTop:"1px solid rgba(128,128,128,0.15)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.4rem", marginBottom:"0.5rem" }}>
        {[["Kategoria",cat],["Koszt",cost],["Waga",weight],
          ...(dmg?[["Obrażenia",dmg]]:acBase?[["KP",acBase]]:acBase===0?[["KP","0 + DEX"]]:[] ),
          ...(d.range?[["Zasięg",`${d.range.normal||"—"} / ${d.range.long||"—"} stóp`]]:[]),
          ...(props?[["Właściwości",props]]:[]),
        ].filter(([,v]) => v).map(([k,v]) => (
          <div key={k}><div style={LBL}>{k}</div>
            <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.85rem", color:"var(--text-label)" }}>{v}</div>
          </div>
        ))}
      </div>
      {d.desc && d.desc.length > 0 && d.desc.map((p,i) => (
        <p key={i} style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", color:"var(--text-muted)", lineHeight:1.6, marginBottom:"0.3rem" }}>{p}</p>
      ))}
      {d.special && d.special.length > 0 && d.special.map((p,i) => (
        <p key={i} style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.85rem", color:"var(--text-muted)", fontStyle:"italic", lineHeight:1.6 }}>{p}</p>
      ))}
    </div>
  );
}

export default function EquipmentTab() {
  const [items, setItems]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [query, setQuery]             = useState("");
  const [filterCat, setFilterCat]     = useState(null);
  const [expandedId, setExpandedId]   = useState(null);
  const [details, setDetails]         = useState({});
  const [detailLoading, setDetailLoading] = useState(null);

  useEffect(() => {
    fetchList('/api/equipment')
      .then(d => { setItems(d.results||[]); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const handleExpand = async (item) => {
    if (expandedId === item.index) { setExpandedId(null); return; }
    setExpandedId(item.index);
    if (!details[item.index]) {
      setDetailLoading(item.index);
      try { const d = await fetchDetail(item.url); setDetails(p=>({...p,[item.index]:d})); } catch {}
      setDetailLoading(null);
    }
  };

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (query && !item.name.toLowerCase().includes(query.toLowerCase())) return false;
      const d = details[item.index];
      if (filterCat && d && d.equipment_category?.name !== filterCat) return false;
      return true;
    });
  }, [items, query, filterCat, details]);

  return (
    <div>
      <input className="g-input" placeholder="Szukaj przedmiotu…" value={query}
        onChange={e => setQuery(e.target.value)} style={{ marginBottom:"0.6rem" }}/>
      <div className="filter-bar" style={{ marginBottom:"0.8rem" }}>
        <span style={LBL}>Typ:</span>
        <button className={`filter-tag${!filterCat?" active-filter":""}`} onClick={() => setFilterCat(null)}>Wszystkie</button>
        {CATS.map(c => (
          <button key={c} className={`filter-tag${filterCat===c?" active-filter":""}`}
            onClick={() => setFilterCat(filterCat===c?null:c)}>{CAT_PL[c]||c}</button>
        ))}
      </div>
      <div style={{ ...LBL, marginBottom:"0.5rem" }}>{loading?"Ładowanie…":`${filtered.length} przedmiotów`}</div>
      {error && <div className="card empty-state" style={{ color:"#c04040" }}>Błąd: {error}</div>}
      {loading && Array.from({length:8}).map((_,i) => (
        <div key={i} className="card" style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem" }}><Skel h="1rem" w="55%"/></div>
      ))}
      {!loading && filtered.map(item => {
        const d = details[item.index];
        const isOpen = expandedId === item.index;
        const cost = d?.cost ? `${d.cost.quantity} ${d.cost.unit}` : "";
        return (
          <div key={item.index} className={`card${isOpen?" pinned":""}`}
            style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem", cursor:"pointer" }}
            onClick={() => handleExpand(item)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700 }}>{item.name}</div>
                {(cost || d?.equipment_category?.name) && (
                  <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.78rem", color:"var(--text-muted)", marginTop:"0.1rem" }}>
                    {[d?.equipment_category?.name, cost].filter(Boolean).join(" · ")}
                  </div>
                )}
              </div>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--text-dim)" }}>{isOpen?"▲":"▼"}</span>
            </div>
            {detailLoading===item.index && <div style={{ marginTop:"0.5rem" }}><Skel h="0.8rem"/><Skel h="2rem"/></div>}
            {isOpen && d && <EquipDetail d={d}/>}
          </div>
        );
      })}
      {!loading && filtered.length===0 && <div className="card empty-state">Brak wyników.</div>}
    </div>
  );
}
