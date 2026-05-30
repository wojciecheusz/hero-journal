import { useState, useEffect, useMemo } from 'react';
import { fetchList, fetchDetail } from '../../utils/dnd5eApi';

const LBL = { fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-muted)" };
const TYPES = ["beast","dragon","fiend","humanoid","undead","construct","elemental","fey","giant","monstrosity","ooze","plant","celestial","aberration"];
const TYPE_PL = { beast:"Bestia",dragon:"Smok",fiend:"Diabeł/Demon",humanoid:"Humanoid",undead:"Nieumarły",construct:"Konstrukt",
  elemental:"Żywiołak",fey:"Wróżka",giant:"Olbrzym",monstrosity:"Monstrum",ooze:"Maź",plant:"Roślina",celestial:"Niebiański",aberration:"Aberracja" };
const CR_OPTIONS = [
  {label:"Wszystkie",val:null},
  {label:"0",val:"0"},{label:"1/8",val:"0.125"},{label:"1/4",val:"0.25"},{label:"1/2",val:"0.5"},
  {label:"1",val:"1"},{label:"2",val:"2"},{label:"3",val:"3"},{label:"4",val:"4"},{label:"5",val:"5"},
  {label:"6-10",val:"6-10"},{label:"11-15",val:"11-15"},{label:"16-20",val:"16-20"},{label:"21+",val:"21+"},
];

function Skel({ h="1rem", w="100%", mb="0.3rem" }) {
  return <div style={{ height:h, width:w, background:"rgba(128,128,128,0.14)", borderRadius:3, marginBottom:mb, animation:"skel 1.4s ease-in-out infinite" }}/>;
}

function numMod(v) { const m = Math.floor((v-10)/2); return m>=0?`+${m}`:String(m); }
function crLabel(cr) { if(cr===0.125) return "1/8"; if(cr===0.25) return "1/4"; if(cr===0.5) return "1/2"; return String(cr); }

function StatBox({ label, val }) {
  return (
    <div style={{ textAlign:"center", flex:1 }}>
      <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.44rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)" }}>{label}</div>
      <div style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700, color:"inherit" }}>{val}</div>
      <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.56rem", color:"var(--text-dim)" }}>{numMod(val)}</div>
    </div>
  );
}

function MonsterDetail({ d }) {
  if (!d) return null;
  const ac = Array.isArray(d.armor_class) ? d.armor_class[0]?.value : d.armor_class;
  const speed = Object.entries(d.speed || {}).map(([k,v]) => `${k} ${v}`).join(", ");
  return (
    <div style={{ marginTop:"0.6rem", paddingTop:"0.6rem", borderTop:"1px solid rgba(128,128,128,0.15)" }}>
      {/* Podstawowe statystyki */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem", marginBottom:"0.7rem" }}>
        {[["KP", ac],["PŻ", `${d.hit_points} (${d.hit_dice})`],["CR", `${crLabel(d.challenge_rating)} (${d.xp} PD)`],
          ["Prędkość", speed || "—"],["Rozmiar", d.size],["Typ", TYPE_PL[d.type]||d.type]
        ].map(([k,v]) => v ? (
          <div key={k}><div style={LBL}>{k}</div>
            <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.85rem", color:"var(--text-label)" }}>{v}</div>
          </div>
        ) : null)}
      </div>
      {/* Atrybuty */}
      <div style={{ display:"flex", gap:"0.3rem", marginBottom:"0.7rem", padding:"0.5rem 0.3rem", background:"rgba(128,128,128,0.05)", borderRadius:2 }}>
        {[["STR",d.strength],["DEX",d.dexterity],["CON",d.constitution],["INT",d.intelligence],["WIS",d.wisdom],["CHA",d.charisma]].map(([l,v]) => (
          <StatBox key={l} label={l} val={v}/>
        ))}
      </div>
      {/* Odporności / immunitet */}
      {[["Immunitet na obrażenia", d.damage_immunities],["Odporność na obrażenia", d.damage_resistances],
        ["Podatność na obrażenia", d.damage_vulnerabilities],
        ["Immunitet na stany", (d.condition_immunities||[]).map(c=>c.name)]
      ].filter(([,v]) => v?.length > 0).map(([label, vals]) => (
        <div key={label} style={{ marginBottom:"0.3rem" }}>
          <span style={LBL}>{label}: </span>
          <span style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.82rem", color:"var(--text-muted)" }}>{vals.join(", ")}</span>
        </div>
      ))}
      {/* Zmysły i języki */}
      {d.senses && Object.keys(d.senses).length > 0 && (
        <div style={{ marginBottom:"0.3rem" }}>
          <span style={LBL}>Zmysły: </span>
          <span style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.82rem", color:"var(--text-muted)" }}>
            {Object.entries(d.senses).map(([k,v])=>`${k} ${v}`).join(", ")}
          </span>
        </div>
      )}
      {d.languages && <div style={{ marginBottom:"0.5rem" }}>
        <span style={LBL}>Języki: </span>
        <span style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.82rem", color:"var(--text-muted)" }}>{d.languages}</span>
      </div>}
      {/* Cechy specjalne */}
      {(d.special_abilities||[]).length > 0 && (
        <div style={{ marginBottom:"0.6rem" }}>
          <div style={{ ...LBL, marginBottom:"0.35rem" }}>Cechy specjalne</div>
          {d.special_abilities.map((a,i) => (
            <div key={i} style={{ marginBottom:"0.4rem" }}>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.7rem", fontWeight:700, color:"var(--text-label)" }}>{a.name}. </span>
              <span style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", color:"var(--text-muted)" }}>
                {(a.desc||"").slice(0,300)}{(a.desc||"").length>300?"…":""}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Akcje */}
      {(d.actions||[]).length > 0 && (
        <div style={{ marginBottom:"0.6rem" }}>
          <div style={{ ...LBL, marginBottom:"0.35rem" }}>Akcje</div>
          {d.actions.map((a,i) => (
            <div key={i} style={{ marginBottom:"0.4rem", paddingLeft:"0.5rem", borderLeft:"2px solid rgba(128,128,128,0.2)" }}>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.7rem", fontWeight:700, color:"var(--text-label)" }}>{a.name}. </span>
              <span style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", color:"var(--text-muted)" }}>
                {(a.desc||"").slice(0,250)}{(a.desc||"").length>250?"…":""}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Legendarne */}
      {(d.legendary_actions||[]).length > 0 && (
        <div>
          <div style={{ ...LBL, marginBottom:"0.35rem" }}>Akcje legendarne</div>
          {d.legendary_actions.map((a,i) => (
            <div key={i} style={{ marginBottom:"0.4rem", paddingLeft:"0.5rem", borderLeft:"2px solid var(--spell-border)" }}>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.7rem", fontWeight:700, color:"var(--spell-accent)" }}>{a.name}. </span>
              <span style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.88rem", color:"var(--text-muted)" }}>
                {(a.desc||"").slice(0,200)}{(a.desc||"").length>200?"…":""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function matchCR(cr, filter) {
  if (!filter) return true;
  if (filter === "6-10")  return cr >= 6  && cr <= 10;
  if (filter === "11-15") return cr >= 11 && cr <= 15;
  if (filter === "16-20") return cr >= 16 && cr <= 20;
  if (filter === "21+")   return cr >= 21;
  return String(cr) === filter || Math.abs(cr - parseFloat(filter)) < 0.01;
}

export default function MonstersTab() {
  const [items, setItems]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [query, setQuery]             = useState("");
  const [filterCR, setFilterCR]       = useState(null);
  const [filterType, setFilterType]   = useState(null);
  const [expandedId, setExpandedId]   = useState(null);
  const [details, setDetails]         = useState({});
  const [detailLoading, setDetailLoading] = useState(null);

  useEffect(() => {
    fetchList('/api/monsters')
      .then(d => { setItems(d.results || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const handleExpand = async (item) => {
    if (expandedId === item.index) { setExpandedId(null); return; }
    setExpandedId(item.index);
    if (!details[item.index]) {
      setDetailLoading(item.index);
      try {
        const d = await fetchDetail(item.url);
        setDetails(p => ({ ...p, [item.index]: d }));
      } catch {}
      setDetailLoading(null);
    }
  };

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (query && !item.name.toLowerCase().includes(query.toLowerCase())) return false;
      const d = details[item.index];
      if (d) {
        if (!matchCR(d.challenge_rating, filterCR)) return false;
        if (filterType && d.type !== filterType) return false;
      }
      return true;
    });
  }, [items, query, filterCR, filterType, details]);

  return (
    <div>
      <input className="g-input" placeholder="Szukaj potwora…" value={query}
        onChange={e => setQuery(e.target.value)} style={{ marginBottom:"0.6rem" }}/>

      {/* Filtr CR */}
      <div className="filter-bar" style={{ marginBottom:"0.4rem" }}>
        <span style={LBL}>CR:</span>
        {CR_OPTIONS.map(o => (
          <button key={String(o.val)} className={`filter-tag${filterCR===o.val?" active-filter":""}`}
            onClick={() => setFilterCR(filterCR===o.val?null:o.val)}>{o.label}</button>
        ))}
      </div>

      {/* Filtr typu */}
      <div className="filter-bar" style={{ marginBottom:"0.8rem" }}>
        <span style={LBL}>Typ:</span>
        <button className={`filter-tag${!filterType?" active-filter":""}`} onClick={() => setFilterType(null)}>Wszystkie</button>
        {TYPES.map(t => (
          <button key={t} className={`filter-tag${filterType===t?" active-filter":""}`}
            onClick={() => setFilterType(filterType===t?null:t)}>{TYPE_PL[t]||t}</button>
        ))}
      </div>

      <div style={{ ...LBL, marginBottom:"0.5rem" }}>{loading ? "Ładowanie…" : `${filtered.length} potworów`}</div>
      {error && <div className="card empty-state" style={{ color:"#c04040" }}>Błąd: {error}</div>}

      {loading && Array.from({length:8}).map((_,i) => (
        <div key={i} className="card" style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem" }}>
          <Skel h="1rem" w="55%"/>
          <Skel h="0.7rem" w="35%"/>
        </div>
      ))}

      {!loading && filtered.map(item => {
        const d = details[item.index];
        const isOpen = expandedId === item.index;
        const isLoading = detailLoading === item.index;
        return (
          <div key={item.index} className={`card${isOpen?" pinned":""}`}
            style={{ padding:"0.75rem 1rem", marginBottom:"0.4rem", cursor:"pointer" }}
            onClick={() => handleExpand(item)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, color: isOpen?"var(--quest-reward)":"inherit" }}>{item.name}</div>
                {d && <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.78rem", color:"var(--text-muted)", marginTop:"0.1rem" }}>
                  CR {crLabel(d.challenge_rating)} · {TYPE_PL[d.type]||d.type} · {d.size}
                </div>}
              </div>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--text-dim)", flexShrink:0 }}>{isOpen?"▲":"▼"}</span>
            </div>
            {isLoading && <div style={{ marginTop:"0.5rem" }}><Skel h="0.8rem"/><Skel h="4rem"/></div>}
            {isOpen && d && <MonsterDetail d={d}/>}
          </div>
        );
      })}

      {!loading && filtered.length === 0 && (
        <div className="card empty-state">Brak wyników dla wybranych filtrów.</div>
      )}
    </div>
  );
}
