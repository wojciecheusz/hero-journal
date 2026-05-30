import { useState, useEffect, useMemo } from 'react';
import { fetchList, fetchDetail } from '../../utils/dnd5eApi';

const SCHOOLS = ["Odrzucanie","Przywoływanie","Wieszczenie","Surogacja","Wywoływanie","Iluzja","Nekromancja","Przemiana"];
const SCHOOL_MAP = { abjuration:"Odrzucanie", conjuration:"Przywoływanie", divination:"Wieszczenie",
  enchantment:"Surogacja", evocation:"Wywoływanie", illusion:"Iluzja", necromancy:"Nekromancja", transmutation:"Przemiana" };
const LEVEL_LABELS = ["Sztuczka","1","2","3","4","5","6","7","8","9"];
const LBL = { fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-muted)" };

function Skel({ h = "1rem", w = "100%", mb = "0.3rem" }) {
  return <div style={{ height:h, width:w, background:"rgba(128,128,128,0.14)", borderRadius:3, marginBottom:mb, animation:"skel 1.4s ease-in-out infinite" }}/>;
}

function numMod(v) { return v >= 0 ? `+${v}` : String(v); }

function SpellDetail({ d }) {
  if (!d) return null;
  const lvl = d.level === 0 ? "Sztuczka" : `${d.level}. poziom`;
  const school = SCHOOL_MAP[d.school?.name?.toLowerCase()] || d.school?.name || "";
  const comps = (d.components || []).join(", ");
  const classes = (d.classes || []).map(c => c.name).join(", ");
  const concentration = d.concentration ? "Tak" : "Nie";
  const ritual = d.ritual ? "Tak" : "Nie";
  return (
    <div style={{ marginTop:"0.6rem", paddingTop:"0.6rem", borderTop:"1px solid rgba(128,128,128,0.15)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.4rem", marginBottom:"0.6rem" }}>
        {[["Poziom", lvl],["Szkoła", school],["Czas rzucania", d.casting_time],
          ["Zasięg", d.range],["Czas trwania", d.duration],["Komponenty", comps],
          ["Koncentracja", concentration],["Rytuał", ritual],["Klasy", classes]
        ].map(([label, val]) => val ? (
          <div key={label}>
            <div style={LBL}>{label}</div>
            <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", color:"var(--spell-text)", lineHeight:1.4 }}>{val}</div>
          </div>
        ) : null)}
      </div>
      {d.material && <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.82rem", color:"var(--text-muted)", fontStyle:"italic", marginBottom:"0.5rem" }}>Materiały: {d.material}</div>}
      {(d.desc || []).map((p, i) => <p key={i} style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.95rem", lineHeight:1.65, marginBottom:"0.4rem", color:"var(--text-label)" }}>{p}</p>)}
      {(d.higher_level || []).length > 0 && (
        <div style={{ marginTop:"0.5rem", padding:"0.4rem 0.6rem", background:"rgba(128,128,128,0.06)", borderLeft:"2px solid var(--spell-border)" }}>
          <div style={{ ...LBL, marginBottom:"0.2rem" }}>Na wyższych poziomach</div>
          {d.higher_level.map((p, i) => <p key={i} style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", lineHeight:1.6, color:"var(--text-muted)" }}>{p}</p>)}
        </div>
      )}
    </div>
  );
}

export default function SpellsTab() {
  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [query, setQuery]               = useState("");
  const [filterLevel, setFilterLevel]   = useState(null);
  const [filterClass, setFilterClass]   = useState(null);
  const [filterSchool, setFilterSchool] = useState(null);
  const [expandedId, setExpandedId]     = useState(null);
  const [details, setDetails]           = useState({});
  const [detailLoading, setDetailLoading] = useState(null);
  const [allClasses, setAllClasses]     = useState([]);

  useEffect(() => {
    fetchList('/api/spells')
      .then(d => { setItems(d.results || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
    fetchList('/api/classes')
      .then(d => setAllClasses((d.results || []).map(c => c.name)));
  }, []);

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (query && !item.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [items, query]);

  const handleExpand = async (item) => {
    if (expandedId === item.index) { setExpandedId(null); return; }
    setExpandedId(item.index);
    if (!details[item.index]) {
      setDetailLoading(item.index);
      try {
        const d = await fetchDetail(item.url);
        if (filterLevel !== null && d.level !== filterLevel) { setExpandedId(null); setDetailLoading(null); return; }
        setDetails(p => ({ ...p, [item.index]: d }));
      } catch {}
      setDetailLoading(null);
    }
  };

  // After detail loaded, apply level/class/school filters
  const visibleFiltered = useMemo(() => {
    if (filterLevel === null && !filterClass && !filterSchool) return filtered;
    return filtered.filter(item => {
      const d = details[item.index];
      if (!d) return true; // show until detail loaded
      if (filterLevel !== null && d.level !== filterLevel) return false;
      if (filterClass && !(d.classes || []).some(c => c.name === filterClass)) return false;
      if (filterSchool && (SCHOOL_MAP[d.school?.name?.toLowerCase()] !== filterSchool)) return false;
      return true;
    });
  }, [filtered, filterLevel, filterClass, filterSchool, details]);

  return (
    <div>
      {/* Wyszukiwarka */}
      <input className="g-input" placeholder="Szukaj czaru…" value={query}
        onChange={e => setQuery(e.target.value)} style={{ marginBottom:"0.6rem" }}/>

      {/* Filtry poziomu */}
      <div className="filter-bar" style={{ marginBottom:"0.4rem" }}>
        <span style={LBL}>Poziom:</span>
        <button className={`filter-tag${filterLevel===null?" active-filter":""}`} onClick={() => setFilterLevel(null)}>Wszystkie</button>
        {LEVEL_LABELS.map((lbl, i) => (
          <button key={i} className={`filter-tag${filterLevel===i?" active-filter":""}`}
            onClick={() => setFilterLevel(filterLevel===i?null:i)}>{lbl}</button>
        ))}
      </div>

      {/* Filtr szkoły */}
      <div className="filter-bar" style={{ marginBottom:"0.4rem" }}>
        <span style={LBL}>Szkoła:</span>
        {SCHOOLS.map(s => (
          <button key={s} className={`filter-tag${filterSchool===s?" active-filter":""}`}
            onClick={() => setFilterSchool(filterSchool===s?null:s)}>{s}</button>
        ))}
      </div>

      {/* Filtr klasy */}
      <div className="filter-bar" style={{ marginBottom:"0.8rem" }}>
        <span style={LBL}>Klasa:</span>
        {allClasses.map(c => (
          <button key={c} className={`filter-tag${filterClass===c?" active-filter":""}`}
            onClick={() => setFilterClass(filterClass===c?null:c)}>{c}</button>
        ))}
      </div>

      {/* Licznik */}
      <div style={{ ...LBL, marginBottom:"0.5rem" }}>{loading ? "Ładowanie…" : `${visibleFiltered.length} czarów`}</div>

      {error && <div className="card empty-state" style={{ color:"#c04040" }}>Błąd: {error}</div>}

      {/* Szkielety podczas ładowania */}
      {loading && Array.from({length:8}).map((_,i) => (
        <div key={i} className="card" style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem" }}>
          <Skel h="1rem" w="60%"/>
          <Skel h="0.7rem" w="40%"/>
        </div>
      ))}

      {/* Lista */}
      {!loading && visibleFiltered.map(item => {
        const d = details[item.index];
        const isOpen = expandedId === item.index;
        const isLoading = detailLoading === item.index;
        const lvlLabel = d ? (d.level === 0 ? "Sztuczka" : `${d.level}. poziom`) : "";
        const schoolLabel = d ? (SCHOOL_MAP[d.school?.name?.toLowerCase()] || d.school?.name || "") : "";
        return (
          <div key={item.index} className={`card${isOpen?" pinned":""}`}
            style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem", cursor:"pointer" }}
            onClick={() => handleExpand(item)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, color: isOpen?"var(--spell-accent)":"inherit" }}>{item.name}</div>
                {d && <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.8rem", color:"var(--text-muted)", marginTop:"0.15rem" }}>{lvlLabel}{schoolLabel ? ` · ${schoolLabel}` : ""}</div>}
              </div>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--text-dim)", flexShrink:0 }}>{isOpen?"▲":"▼"}</span>
            </div>
            {isLoading && <div style={{ marginTop:"0.5rem" }}><Skel h="0.8rem"/><Skel h="3rem"/></div>}
            {isOpen && d && <SpellDetail d={d}/>}
          </div>
        );
      })}

      {!loading && visibleFiltered.length === 0 && (
        <div className="card empty-state">Brak wyników dla wybranych filtrów.</div>
      )}
    </div>
  );
}
