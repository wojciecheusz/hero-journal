import { useState, useCallback } from 'react';
import { WFRP_CHARS, WFRP_CONDITIONS, WFRP_SPECIES } from '../../constants/systems';

const LBL  = { fontFamily:"Cinzel,serif", fontSize:"0.5rem",  letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:"0.25rem", color:"var(--text-label)" };
const LBL_SM = { fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)" };

const WFRP_RED  = "#9a3a3a";
const WFRP_GOLD = "#c9943e";

/* Obliczone wartości cechy */
const charCurrent = (c) => (c.start || 0) + (c.adv || 0);
const charBonus   = (c) => Math.floor(charCurrent(c) / 10);
/* Obliczone maks. ran */
const calcMaxWounds = (chars) => {
  const sb  = charBonus(chars.k   || {start:30,adv:0});
  const tb  = charBonus(chars.odp || {start:30,adv:0});
  const wpb = charBonus(chars.sw  || {start:30,adv:0});
  return sb + tb * 2 + wpb;
};

function numMod(v) { return v >= 0 ? `+${v}` : String(v); }

/* ── Skeleton ──────────────────────────────────────── */
function Skel({ h="1rem", w="100%" }) {
  return <div style={{ height:h, width:w, background:"rgba(128,128,128,0.14)", borderRadius:2, animation:"skel 1.4s ease-in-out infinite" }}/>;
}

export default function WFRPCharacterScreen({ char, setChar }) {
  const upd = (f, v) => setChar(c => ({ ...c, [f]: v }));
  const updChars = (key, field, val) => setChar(c => ({
    ...c, chars: { ...c.chars, [key]: { ...(c.chars[key]||{start:30,adv:0}), [field]: parseInt(val)||0 } }
  }));
  const [showAddSkill,  setShowAddSkill]  = useState(false);
  const [showAddTalent, setShowAddTalent] = useState(false);
  const [newSkill,  setNewSkill]  = useState({ name:"", char:"ww", adv:0 });
  const [newTalent, setNewTalent] = useState({ name:"", times:1, description:"" });

  const chars     = char.chars || {};
  const wounds    = char.wounds    || { current:10, max:10 };
  const fate      = char.fate      || { current:0, max:0 };
  const resilience= char.resilience|| { current:0, max:0 };
  const xp        = char.xp        || { current:0, total:0, spent:0 };
  const career    = char.career    || { name:"", tier:1, class:"", status:"Brass", standing:0 };
  const coins     = char.coins     || { gc:0, ss:0, bp:0 };
  const armour    = char.armour    || { head:0, arms:0, body:0, legs:0 };
  const conditions= char.conditions|| {};

  const woundPct = wounds.max > 0 ? Math.round(clamp((wounds.current / wounds.max)*100,0,100)) : 100;
  function clamp(n,a,b){ return Math.max(a,Math.min(b,n)); }
  const woundColor = woundPct > 50 ? "linear-gradient(90deg,#1a5a1a,#33aa33)" : woundPct > 20 ? "linear-gradient(90deg,#7a4a10,#e08030)" : "linear-gradient(90deg,#3a0a0a,#961a1a)";

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    setChar(c => ({...c, skills:[...(c.skills||[]), { id:Date.now(), ...newSkill, name:newSkill.name.trim() }]}));
    setNewSkill({ name:"", char:"ww", adv:0 });
    setShowAddSkill(false);
  };
  const updSkill = (id, field, val) =>
    setChar(c => ({...c, skills:(c.skills||[]).map(s => s.id===id?{...s,[field]:field==="adv"?parseInt(val)||0:val}:s)}));
  const delSkill = (id) => setChar(c => ({...c, skills:(c.skills||[]).filter(s=>s.id!==id)}));

  const addTalent = () => {
    if (!newTalent.name.trim()) return;
    setChar(c => ({...c, talents:[...(c.talents||[]), { id:Date.now(), ...newTalent, name:newTalent.name.trim() }]}));
    setNewTalent({ name:"", times:1, description:"" });
    setShowAddTalent(false);
  };
  const updTalent = (id, f, v) => setChar(c => ({...c, talents:(c.talents||[]).map(t=>t.id===id?{...t,[f]:v}:t)}));
  const delTalent = (id) => setChar(c => ({...c, talents:(c.talents||[]).filter(t=>t.id!==id)}));

  const toggleCondition = (key) => setChar(c => {
    const conds = {...(c.conditions||{})};
    if (conds[key]) delete conds[key]; else conds[key] = true;
    return {...c, conditions: conds};
  });

  /* ════════════════ Karta 1: POSTAĆ ════════════════ */
  return (
    <>
    {/* ── Imię ── */}
    <div className="card">
      <div className="sect-label" style={{ color:WFRP_RED }}>Postać</div>
      <input className="iedit" style={{ fontFamily:"Cinzel,serif", fontSize:"1.3rem", fontWeight:700, letterSpacing:"0.04em", width:"100%", marginBottom:"0.7rem" }}
        value={char.name||""} onChange={e=>upd("name",e.target.value)} placeholder="Imię postaci…"/>

      {/* Gatunek + Kariera */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginBottom:"0.5rem" }}>
        <div>
          <div style={LBL}>Gatunek</div>
          <select className="g-select" style={{ fontSize:"0.82rem", padding:"0.3rem 0.4rem" }}
            value={char.species||"human"} onChange={e=>upd("species",e.target.value)}>
            {WFRP_SPECIES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <div style={LBL}>Kariera</div>
          <input className="iedit" style={{ fontSize:"0.9rem" }} value={career.name||""}
            onChange={e=>setChar(c=>({...c,career:{...c.career,name:e.target.value}}))} placeholder="Nazwa kariery…"/>
        </div>
      </div>

      {/* Tier + Klasa + Status */}
      <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 80px 50px", gap:"0.5rem", marginBottom:"0.5rem", alignItems:"end" }}>
        <div>
          <div style={LBL}>Tier</div>
          <input type="number" min={1} max={4} className="iedit"
            style={{ textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"0.95rem" }}
            value={career.tier||1} onChange={e=>setChar(c=>({...c,career:{...c.career,tier:parseInt(e.target.value)||1}}))}/>
        </div>
        <div>
          <div style={LBL}>Klasa kariery</div>
          <input className="iedit" style={{ fontSize:"0.88rem" }} value={career.class||""}
            onChange={e=>setChar(c=>({...c,career:{...c.career,class:e.target.value}}))} placeholder="np. Wojownik…"/>
        </div>
        <div>
          <div style={LBL}>Status</div>
          <select className="g-select" style={{ fontSize:"0.75rem", padding:"0.25rem 0.3rem" }}
            value={career.status||"Brass"} onChange={e=>setChar(c=>({...c,career:{...c.career,status:e.target.value}}))}>
            {["Brass","Silver","Gold"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <div style={LBL}>Standing</div>
          <input type="number" min={0} max={5} className="iedit"
            style={{ textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"0.95rem" }}
            value={career.standing||0} onChange={e=>setChar(c=>({...c,career:{...c.career,standing:parseInt(e.target.value)||0}}))}/>
        </div>
      </div>

      {/* Religia + Motywacja */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginBottom:"0.5rem" }}>
        {[["religion","Religia","np. Ulric"],["motivation","Motywacja","Co napędza bohatera?"]].map(([f,l,ph])=>(
          <div key={f}><div style={LBL}>{l}</div>
            <input className="iedit" style={{ fontSize:"0.88rem" }} value={char[f]||""} placeholder={ph}
              onChange={e=>upd(f,e.target.value)}/>
          </div>
        ))}
      </div>

      {/* Ambicje */}
      <div style={{ marginBottom:"0.5rem" }}>
        <div style={LBL}>Krótkoterminowa ambicja</div>
        <input className="iedit" style={{ fontSize:"0.88rem", width:"100%" }} value={char.ambitionShort||""}
          onChange={e=>upd("ambitionShort",e.target.value)} placeholder="Co chcesz osiągnąć wkrótce?"/>
      </div>
      <div style={{ marginBottom:"0.5rem" }}>
        <div style={LBL}>Długoterminowa ambicja</div>
        <input className="iedit" style={{ fontSize:"0.88rem", width:"100%" }} value={char.ambitionLong||""}
          onChange={e=>upd("ambitionLong",e.target.value)} placeholder="Cel na całą kampanię…"/>
      </div>

      {/* XP */}
      <hr className="inner-divider" data-label="Doświadczenie" style={{ marginTop:"0.8rem" }}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.5rem", marginTop:"0.7rem" }}>
        {[["current","Bieżące XP"],["total","Łącznie zdobyte"],["spent","Wydane"]].map(([f,l])=>(
          <div key={f} className="combat-box">
            <span className="combat-box-label">{l}</span>
            <input className="combat-box-input" type="number" min={0}
              value={xp[f]||0} onFocus={e=>e.target.select()}
              onChange={e=>setChar(c=>({...c,xp:{...(c.xp||{}), [f]:parseInt(e.target.value)||0}}))}/>
          </div>
        ))}
      </div>

      {/* Wygląd */}
      <hr className="inner-divider" data-label="Wygląd" style={{ marginTop:"1rem" }}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem", marginTop:"0.7rem" }}>
        {[["age","Wiek","25"],["height","Wzrost","175 cm"],["weight","Waga","70 kg"],["hair","Włosy","brązowe"],["eyes","Oczy","niebieskie"],["handedness","Rączność","praworęczny"]].map(([k,l,ph])=>(
          <div key={k}><div style={LBL}>{l}</div>
            <input className="iedit" style={{ fontSize:"0.85rem" }} value={char[k]||""} placeholder={ph}
              onChange={e=>upd(k,e.target.value)}/>
          </div>
        ))}
      </div>
    </div>

    {/* ════════════════ Karta 2: CECHY ═════════════════ */}
    <div className="card">
      <div className="sect-label" style={{ color:WFRP_RED }}>Cechy</div>
      <p style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", color:"var(--text-muted)", marginBottom:"0.7rem", letterSpacing:"0.08em" }}>
        Teraz = Start + Awanse · Bonus = pierwsza cyfra Teraz
      </p>

      {/* Nagłówek tabeli */}
      <div style={{ display:"grid", gridTemplateColumns:"60px repeat(4,1fr)", gap:"0.3rem", marginBottom:"0.3rem" }}>
        {["","Start","Aw.","Teraz","Bon"].map((h,i)=>(
          <div key={i} style={{ ...LBL_SM, textAlign:i>0?"center":"left", marginBottom:0 }}>{h}</div>
        ))}
      </div>

      {/* Wiersze cech */}
      {WFRP_CHARS.map(({ key, abbr, name }) => {
        const c = chars[key] || { start:30, adv:0 };
        const cur = charCurrent(c);
        const bon = charBonus(c);
        return (
          <div key={key} style={{ display:"grid", gridTemplateColumns:"60px repeat(4,1fr)", gap:"0.3rem", marginBottom:"0.25rem", alignItems:"center" }}>
            <span title={name} style={{ fontFamily:"Cinzel,serif", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.08em", color:WFRP_GOLD }}>{abbr}</span>
            <input type="number" className="stat-input" style={{ width:"100%", textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"0.88rem", fontWeight:700, background:"var(--bgInput,transparent)", border:"1px solid rgba(128,128,128,0.2)", outline:"none", padding:"0.2rem 0" }}
              value={c.start} onFocus={e=>e.target.select()} onChange={e=>updChars(key,"start",e.target.value)}/>
            <input type="number" className="stat-input" style={{ width:"100%", textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"0.88rem", background:"var(--bgInput,transparent)", border:"1px solid rgba(128,128,128,0.2)", outline:"none", padding:"0.2rem 0" }}
              value={c.adv} onFocus={e=>e.target.select()} onChange={e=>updChars(key,"adv",e.target.value)}/>
            <span style={{ textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"0.95rem", fontWeight:700, color:WFRP_GOLD }}>{cur}</span>
            <span style={{ textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"0.95rem", fontWeight:700, color:"var(--text-muted)" }}>{bon}</span>
          </div>
        );
      })}
    </div>

    {/* ════════════════ Karta 3: WALKA ════════════════ */}
    <div className="card">
      <div className="sect-label" style={{ color:WFRP_RED }}>Walka i Ruch</div>

      {/* Rany */}
      <div style={{ display:"grid", gridTemplateColumns:"36px auto 36px 1fr 1fr", gap:"0.3rem", alignItems:"stretch" }}>
        <button className="btn-pm minus" style={{ height:"100%", minHeight:50 }}
          onClick={()=>setChar(c=>({...c,wounds:{...c.wounds,current:Math.max(0,c.wounds.current-1)}}))}>−</button>
        <div className="combat-box" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0.2rem 0.3rem" }}>
          <span className="combat-box-label">Rany</span>
          <div style={{ display:"flex", alignItems:"baseline", gap:"0.1rem" }}>
            <input type="number" value={wounds.current}
              style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"1.25rem", fontWeight:700, width:46, color:woundPct>50?"#3a9a3a":woundPct>20?"#c06010":"#c03030" }}
              onFocus={e=>e.target.select()}
              onChange={e=>setChar(c=>({...c,wounds:{...c.wounds,current:parseInt(e.target.value)||0}}))}/>
            <span style={{ opacity:0.3, fontSize:"0.75rem" }}>/</span>
            <input type="number" value={wounds.max}
              style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"0.82rem", width:36, opacity:0.75, color:"inherit" }}
              onFocus={e=>e.target.select()}
              onChange={e=>setChar(c=>({...c,wounds:{...c.wounds,max:parseInt(e.target.value)||1}}))}/>
          </div>
        </div>
        <button className="btn-pm plus" style={{ height:"100%", minHeight:50 }}
          onClick={()=>setChar(c=>({...c,wounds:{...c.wounds,current:Math.min(c.wounds.max,c.wounds.current+1)}}))}>+</button>
        <div className="combat-box">
          <span className="combat-box-label">Przewaga</span>
          <input className="combat-box-input" type="number" value={char.advantage||0}
            onFocus={e=>e.target.select()} onChange={e=>upd("advantage",parseInt(e.target.value)||0)}/>
        </div>
        <div className="combat-box" title="Awanse Zwinności ÷ 10 (zaokrąglone)">
          <span className="combat-box-label">Ruch (m)</span>
          <input className="combat-box-input" type="number" value={char.movement||4}
            onFocus={e=>e.target.select()} onChange={e=>upd("movement",parseInt(e.target.value)||4)}/>
        </div>
      </div>
      <div className="hp-bar-bg" style={{ marginTop:"0.5rem" }}>
        <div className="hp-bar-fill" style={{ width:`${woundPct}%`, background:woundColor }}/>
      </div>
      <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.55rem", textAlign:"right", marginTop:"0.2rem", color:woundPct>50?"#3a9a3a":woundPct>20?"#c06010":"#c03030" }}>{woundPct}% ran pozostało</div>

      {/* Zbroja per lokacja */}
      <hr className="inner-divider" data-label="Punkty Zbroi (PZ) per lokacja" style={{ marginTop:"0.8rem" }}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.4rem", marginTop:"0.7rem" }}>
        {[["head","Głowa"],["arms","Ramiona"],["body","Tułów"],["legs","Nogi"]].map(([loc,label])=>(
          <div key={loc} className="combat-box">
            <span className="combat-box-label">{label}</span>
            <input className="combat-box-input" type="number" min={0} max={12}
              value={armour[loc]||0} onFocus={e=>e.target.select()}
              onChange={e=>setChar(c=>({...c,armour:{...(c.armour||{}), [loc]:parseInt(e.target.value)||0}}))}/>
          </div>
        ))}
      </div>

      {/* Ruch walk/run */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem", marginTop:"0.5rem" }}>
        <div className="combat-box">
          <span className="combat-box-label">Chód (×2)</span>
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700, textAlign:"center", display:"block" }}>{(char.movement||4)*2}</span>
        </div>
        <div className="combat-box">
          <span className="combat-box-label">Bieg (×4)</span>
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700, textAlign:"center", display:"block" }}>{(char.movement||4)*4}</span>
        </div>
        <div className="combat-box" title="Wyliczane: K-bonus + Odp-bonus×2 + SW-bonus">
          <span className="combat-box-label">Rany maks.</span>
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.75rem", color:"var(--text-muted)", textAlign:"center", display:"block" }}>{calcMaxWounds(chars)}</span>
        </div>
      </div>
    </div>

    {/* ════════════════ Karta 4: KONDYCJA ══════════════ */}
    <div className="card">
      <div className="sect-label" style={{ color:WFRP_RED }}>Kondycja</div>

      {/* Przeznaczenie + Wytrwałość */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginBottom:"0.7rem" }}>
        <div>
          <div style={LBL}>Przeznaczenie / Szczęście</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.3rem" }}>
            <div className="combat-box">
              <span className="combat-box-label">Przezn.</span>
              <div style={{ display:"flex", alignItems:"baseline", gap:"0.1rem", justifyContent:"center" }}>
                <input type="number" min={0} value={fate.current||0} style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"1rem", fontWeight:700, width:32, color:WFRP_GOLD }}
                  onFocus={e=>e.target.select()} onChange={e=>setChar(c=>({...c,fate:{...c.fate,current:parseInt(e.target.value)||0}}))}/>
                <span style={{ opacity:0.3, fontSize:"0.7rem" }}>/</span>
                <input type="number" min={0} value={fate.max||0} style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"0.8rem", width:28, opacity:0.7 }}
                  onFocus={e=>e.target.select()} onChange={e=>setChar(c=>({...c,fate:{...c.fate,max:parseInt(e.target.value)||0}}))}/>
              </div>
            </div>
            <div className="combat-box">
              <span className="combat-box-label">Szczęście</span>
              <input className="combat-box-input" type="number" min={0} value={char.fortune||0}
                onFocus={e=>e.target.select()} onChange={e=>upd("fortune",parseInt(e.target.value)||0)}/>
            </div>
          </div>
        </div>
        <div>
          <div style={LBL}>Wytrwałość / Determinacja</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.3rem" }}>
            <div className="combat-box">
              <span className="combat-box-label">Wytrw.</span>
              <div style={{ display:"flex", alignItems:"baseline", gap:"0.1rem", justifyContent:"center" }}>
                <input type="number" min={0} value={resilience.current||0} style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"1rem", fontWeight:700, width:32 }}
                  onFocus={e=>e.target.select()} onChange={e=>setChar(c=>({...c,resilience:{...c.resilience,current:parseInt(e.target.value)||0}}))}/>
                <span style={{ opacity:0.3, fontSize:"0.7rem" }}>/</span>
                <input type="number" min={0} value={resilience.max||0} style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"0.8rem", width:28, opacity:0.7 }}
                  onFocus={e=>e.target.select()} onChange={e=>setChar(c=>({...c,resilience:{...c.resilience,max:parseInt(e.target.value)||0}}))}/>
              </div>
            </div>
            <div className="combat-box">
              <span className="combat-box-label">Determ.</span>
              <input className="combat-box-input" type="number" min={0} value={char.resolve||0}
                onFocus={e=>e.target.select()} onChange={e=>upd("resolve",parseInt(e.target.value)||0)}/>
            </div>
          </div>
        </div>
      </div>

      {/* Skażenie */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0.5rem", marginBottom:"0.7rem", alignItems:"start" }}>
        <div className="combat-box">
          <span className="combat-box-label">Skażenie</span>
          <input className="combat-box-input" type="number" min={0} value={char.corruption||0}
            onFocus={e=>e.target.select()} onChange={e=>upd("corruption",parseInt(e.target.value)||0)}/>
        </div>
        <div>
          <div style={LBL}>Mutacje i skażenia</div>
          <input className="iedit" style={{ fontSize:"0.85rem", width:"100%" }} value={char.mutations||""}
            onChange={e=>upd("mutations",e.target.value)} placeholder="Opis mutacji…"/>
        </div>
      </div>

      {/* Stany */}
      <div style={{ ...LBL_SM, marginBottom:"0.4rem" }}>Stany postaci</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
        {WFRP_CONDITIONS.map(cond => {
          const active = !!conditions[cond.key];
          return (
            <button key={cond.key} onClick={() => toggleCondition(cond.key)}
              style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.06em", textTransform:"uppercase",
                padding:"0.25rem 0.5rem", border:`1px solid ${active?"#cc3030":"rgba(128,128,128,0.3)"}`,
                background:active?"rgba(200,48,48,0.2)":"transparent", color:active?"#ee5050":"var(--text-muted)",
                cursor:"pointer", transition:"all 0.15s", borderRadius:"2px" }}>
              {cond.label}
            </button>
          );
        })}
      </div>

      {/* Monety WFRP */}
      <hr className="inner-divider" data-label="Sakiewka" style={{ marginTop:"0.8rem" }}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem", marginTop:"0.7rem" }}>
        {[["gc","🟡","Złote\nKorony","#c8a820"],["ss","⚪","Srebrne\nSzylingi","#8898a8"],["bp","🟤","Miedziane\nPensy","#b07040"]].map(([type,icon,label,color])=>{
          const val = coins[type]||0;
          return (
            <div key={type} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.25rem" }}>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.44rem", letterSpacing:"0.06em", textTransform:"uppercase", color, lineHeight:1.3, textAlign:"center" }}>{icon} {label.replace("\n"," ")}</span>
              <div style={{ display:"flex", alignItems:"center", gap:"0.2rem" }}>
                <button onClick={()=>setChar(c=>({...c,coins:{...c.coins,[type]:Math.max(0,val-1)}}))}
                  style={{ width:22, height:22, background:"transparent", border:"1px solid rgba(128,128,128,0.3)", cursor:"pointer", fontFamily:"monospace", fontSize:"0.85rem", color:"inherit", lineHeight:1 }}>−</button>
                <input type="number" min={0} value={val}
                  onChange={e=>setChar(c=>({...c,coins:{...c.coins,[type]:parseInt(e.target.value)||0}}))}
                  onFocus={e=>e.target.select()}
                  style={{ width:46, fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, textAlign:"center", background:"transparent", border:"none", borderBottom:`1px dashed ${color}`, outline:"none", color:"inherit" }}/>
                <button onClick={()=>setChar(c=>({...c,coins:{...c.coins,[type]:val+1}}))}
                  style={{ width:22, height:22, background:"transparent", border:"1px solid rgba(128,128,128,0.3)", cursor:"pointer", fontFamily:"monospace", fontSize:"0.85rem", color:"inherit", lineHeight:1 }}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* ════════════════ Karta 5: UMIEJĘTNOŚCI ══════════ */}
    <div className="card">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.7rem" }}>
        <div className="sect-label" style={{ color:WFRP_RED, margin:0 }}>Umiejętności</div>
        <button className="btn-sm" onClick={()=>setShowAddSkill(s=>!s)}>{showAddSkill?"✕ Anuluj":"⊕ Dodaj"}</button>
      </div>
      {showAddSkill && (
        <div className="add-form" style={{ marginBottom:"0.6rem" }}>
          <div className="col">
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto 60px", gap:"0.4rem" }}>
              <input className="g-input" placeholder="Nazwa umiejętności…" value={newSkill.name}
                onChange={e=>setNewSkill(s=>({...s,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addSkill()}/>
              <select className="g-select" style={{ width:"auto" }} value={newSkill.char}
                onChange={e=>setNewSkill(s=>({...s,char:e.target.value}))}>
                {WFRP_CHARS.map(c=><option key={c.key} value={c.key}>{c.abbr}</option>)}
              </select>
              <input type="number" className="g-input" placeholder="Aw." min={0} max={30} value={newSkill.adv}
                onChange={e=>setNewSkill(s=>({...s,adv:parseInt(e.target.value)||0}))}/>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <button className="btn-sm" onClick={addSkill}>⊕ Dodaj umiejętność</button>
            </div>
          </div>
        </div>
      )}
      {/* Nagłówek */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 40px 40px 50px 30px", gap:"0.3rem", marginBottom:"0.3rem" }}>
        {["Umiejętność","Cecha","Aw.","Razem",""].map((h,i)=>(
          <div key={i} style={{ ...LBL_SM, textAlign:i>0?"center":"left", marginBottom:0 }}>{h}</div>
        ))}
      </div>
      {(char.skills||[]).map(sk => {
        const charDef = WFRP_CHARS.find(c=>c.key===sk.char) || WFRP_CHARS[0];
        const charVal = charCurrent(chars[sk.char]||{start:30,adv:0});
        const total = charVal + (sk.adv||0);
        return (
          <div key={sk.id} style={{ display:"grid", gridTemplateColumns:"1fr 40px 40px 50px 30px", gap:"0.3rem", marginBottom:"0.2rem", alignItems:"center" }}>
            <input className="iedit" style={{ fontSize:"0.85rem" }} value={sk.name}
              onChange={e=>updSkill(sk.id,"name",e.target.value)}/>
            <select style={{ background:"transparent", border:"1px solid rgba(128,128,128,0.2)", color:"inherit", fontFamily:"Cinzel,serif", fontSize:"0.55rem", textAlign:"center", cursor:"pointer", outline:"none", padding:"0.1rem" }}
              value={sk.char} onChange={e=>updSkill(sk.id,"char",e.target.value)}>
              {WFRP_CHARS.map(c=><option key={c.key} value={c.key}>{c.abbr}</option>)}
            </select>
            <input type="number" min={0} style={{ width:"100%", textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"0.82rem", background:"transparent", border:"1px solid rgba(128,128,128,0.2)", outline:"none", padding:"0.1rem 0" }}
              value={sk.adv||0} onFocus={e=>e.target.select()} onChange={e=>updSkill(sk.id,"adv",e.target.value)}/>
            <span style={{ textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"0.88rem", fontWeight:700, color:WFRP_GOLD }}>{total}</span>
            <button className="btn-ghost" style={{ padding:"0.1rem 0.25rem", fontSize:"0.65rem" }} onClick={()=>delSkill(sk.id)}>✕</button>
          </div>
        );
      })}
      {!(char.skills||[]).length && <div className="empty-state" style={{ padding:"1rem" }}>Brak umiejętności. Kliknij ⊕ Dodaj.</div>}
    </div>

    {/* ════════════════ Karta 6: TALENTY ═══════════════ */}
    <div className="card">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.7rem" }}>
        <div className="sect-label" style={{ color:WFRP_RED, margin:0 }}>Talenty</div>
        <button className="btn-sm" onClick={()=>setShowAddTalent(s=>!s)}>{showAddTalent?"✕ Anuluj":"⊕ Dodaj"}</button>
      </div>
      {showAddTalent && (
        <div className="add-form" style={{ marginBottom:"0.6rem" }}>
          <div className="col">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 60px", gap:"0.4rem" }}>
              <input className="g-input" placeholder="Nazwa talentu…" value={newTalent.name}
                onChange={e=>setNewTalent(t=>({...t,name:e.target.value}))}/>
              <input type="number" min={1} className="g-input" placeholder="Razy" value={newTalent.times}
                onChange={e=>setNewTalent(t=>({...t,times:parseInt(e.target.value)||1}))}/>
            </div>
            <textarea className="g-textarea" rows={2} placeholder="Opis efektu talentu…" value={newTalent.description}
              onChange={e=>setNewTalent(t=>({...t,description:e.target.value}))}/>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <button className="btn-sm" onClick={addTalent}>⊕ Dodaj talent</button>
            </div>
          </div>
        </div>
      )}
      {(char.talents||[]).map(t=>(
        <div key={t.id} className="card" style={{ padding:"0.6rem 0.8rem", marginBottom:"0.4rem" }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:"0.4rem", marginBottom:"0.2rem" }}>
            <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"0.82rem", fontWeight:700 }}
              value={t.name} onChange={e=>updTalent(t.id,"name",e.target.value)}/>
            <span style={{ ...LBL_SM, flexShrink:0 }}>×</span>
            <input type="number" min={1} style={{ width:32, background:"transparent", border:"none", borderBottom:"1px dashed rgba(128,128,128,0.3)", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.82rem", textAlign:"center", color:"inherit" }}
              value={t.times||1} onChange={e=>updTalent(t.id,"times",parseInt(e.target.value)||1)}/>
            <button className="btn-ghost" style={{ padding:"0.1rem 0.25rem", fontSize:"0.62rem" }} onClick={()=>delTalent(t.id)}>✕</button>
          </div>
          <textarea className="g-textarea" rows={2} style={{ fontSize:"0.85rem" }} value={t.description||""}
            placeholder="Opis efektu…" onChange={e=>updTalent(t.id,"description",e.target.value)}/>
        </div>
      ))}
      {!(char.talents||[]).length && <div className="empty-state" style={{ padding:"1rem" }}>Brak talentów.</div>}
    </div>

    {/* ════════════════ Karta 7: HISTORIA ══════════════ */}
    <div className="card">
      <div className="sect-label" style={{ color:WFRP_RED }}>Historia i Notatki</div>
      <div style={{ ...LBL, marginBottom:"0.3rem" }}>Historia postaci</div>
      <textarea className="g-textarea" rows={5} placeholder="Skąd pochodzi Twój bohater?…" value={char.backstory||""}
        onChange={e=>upd("backstory",e.target.value)}/>
      <div style={{ ...LBL, marginTop:"0.8rem", marginBottom:"0.3rem" }}>Notatki</div>
      <textarea className="g-textarea" rows={3} placeholder="Bieżące notatki…" value={char.notes||""}
        onChange={e=>upd("notes",e.target.value)}/>
      <div style={{ ...LBL, marginTop:"0.8rem", marginBottom:"0.3rem" }}>Drużyna / Ambicja drużyny</div>
      <input className="iedit" style={{ fontSize:"0.9rem", width:"100%", marginBottom:"0.4rem" }}
        value={char.partyName||""} onChange={e=>upd("partyName",e.target.value)} placeholder="Nazwa drużyny…"/>
      <input className="iedit" style={{ fontSize:"0.88rem", width:"100%" }}
        value={char.partyAmbition||""} onChange={e=>upd("partyAmbition",e.target.value)} placeholder="Wspólna ambicja drużyny…"/>
    </div>
    </>
  );
}
