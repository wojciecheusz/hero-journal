import { useState, useCallback } from 'react';
import { clamp, numMod } from '../../utils/math';
import { SAVING_THROWS, ITEM_ICONS, XP_THRESHOLDS, CONDITIONS } from '../../constants/gameConstants';
import { StatBox, SkillPips, Toggle, RestModal, SpellSlotsWidget } from '../../shared/ui';
import { useT } from '../../i18n/translations';

const hpBarColor = pct => pct > 70
  ? "linear-gradient(90deg,#1a5a1a,#2a8a2a,#33aa33)"
  : pct > 35
    ? "linear-gradient(90deg,#7a4a10,#cc7020,#e08030)"
    : "linear-gradient(90deg,#3a0a0a,#6b0f0f,#961a1a)";
const hpNumColor = pct => pct > 70 ? "#3a9a3a" : pct > 35 ? "#c06010" : "#c03030";

const LBL    = { fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:"0.25rem", color:"var(--text-label)" };
const LBL_SM = { fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)" };

export default function CharacterScreen({ char, setChar, inventory, skills, spells }) {
  const T  = useT();
  const C  = T.CHAR;
  const GENERIC_SKILLS = T.GENERIC_SKILLS;

  const upd   = (f, v) => setChar(c => ({ ...c, [f]: v }));
  const updSt = (s, v) => setChar(c => ({ ...c, stats: { ...c.stats, [s]: v } }));
  const hpPct = Math.round(clamp((char.hp.current / char.hp.max) * 100, 0, 100));
  const pb    = char.profBonus || 2;
  const ds    = char.deathSaves || { successes: 0, failures: 0 };

  const [restModal, setRestModal] = useState(null);
  const [activeTab, setActiveTab] = useState("items");

  const equippedItems = (inventory || []).filter(i => i.equipped);
  const activeSkills  = (skills || []).filter(s => s.inUse);
  const activeSpells  = (spells || []).filter(s => s.inUse);

  const totalLevel = Math.min(Math.max((char.classes || []).reduce((s, c) => s + (c.level || 1), 0), 1), 20);
  const xpMax      = totalLevel < 20 ? XP_THRESHOLDS[totalLevel] : null;

  const wisBonus  = Math.floor((char.stats.WIS - 10) / 2);
  const percProf  = !!(char.skills || {}).perception;
  const percExp   = !!(char.skillExp || {}).perception;
  const percBonus = percExp ? wisBonus + pb * 2 : percProf ? wisBonus + pb : wisBonus;
  const spellAbi  = Math.floor(((char.stats || {})[char.spellcastingAbility || "INT"] || 10) - 10) / 2;
  const spellDC   = 8 + pb + spellAbi;

  const cycleSkill = useCallback(key => setChar(c => {
    const wasP = !!(c.skills || {})[key]; const wasE = !!(c.skillExp || {})[key];
    if (!wasP && !wasE) return { ...c, skills: { ...(c.skills||{}), [key]: true  }, skillExp: { ...(c.skillExp||{}), [key]: false } };
    if ( wasP && !wasE) return { ...c, skills: { ...(c.skills||{}), [key]: true  }, skillExp: { ...(c.skillExp||{}), [key]: true  } };
    const s2 = { ...(c.skills||{}) }; delete s2[key];
    const e2 = { ...(c.skillExp||{}) }; delete e2[key];
    return { ...c, skills: s2, skillExp: e2 };
  }), [setChar]);

  const toggleDeath = useCallback((type, idx) => setChar(c => {
    const cur = (c.deathSaves||{})[type] || 0;
    const next = idx < cur ? idx : idx + 1;
    return { ...c, deathSaves: { ...(c.deathSaves||{}), [type]: Math.min(3, Math.max(0, next)) } };
  }), [setChar]);

  const toggleCondition = useCallback(key => setChar(c => {
    const conds = { ...(c.conditions||{}) };
    if (conds[key]) { delete conds[key]; } else { conds[key] = true; }
    return { ...c, conditions: conds };
  }), [setChar]);

  const updCoins = useCallback((type, val) => setChar(c => ({
    ...c, coins: { ...(c.coins||{gold:0,silver:0,copper:0}), [type]: Math.max(0, parseInt(val)||0) }
  })), [setChar]);

  const CoinRow = () => (
    <div style={{ borderBottom:"1px solid rgba(128,128,128,0.15)", paddingBottom:"0.75rem", marginBottom:"0.75rem" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem" }}>
        {[["gold",C.gold,"#c8a820"],["silver",C.silver,"#8898a8"],["copper",C.copper,"#b07040"]].map(([type,label,color]) => {
          const val = (char.coins||{})[type] || 0;
          return (
            <div key={type} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.25rem" }}>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.08em", textTransform:"uppercase", color, lineHeight:1 }}>{label}</span>
              <div style={{ display:"flex", alignItems:"center", gap:"0.2rem" }}>
                <button onClick={() => updCoins(type, val-1)} style={{ width:22, height:22, background:"transparent", border:"1px solid var(--pip-empty)", cursor:"pointer", fontFamily:"monospace", fontSize:"0.85rem", color:"inherit", lineHeight:1 }}>−</button>
                <input type="number" min={0} value={val}
                  onChange={e => updCoins(type, parseInt(e.target.value)||0)}
                  onFocus={e => e.target.select()}
                  style={{ width:46, fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, textAlign:"center", background:"transparent", border:"none", borderBottom:`1px dashed ${color}`, outline:"none", color:"inherit" }}/>
                <button onClick={() => updCoins(type, val+1)} style={{ width:22, height:22, background:"transparent", border:"1px solid var(--pip-empty)", cursor:"pointer", fontFamily:"monospace", fontSize:"0.85rem", color:"inherit", lineHeight:1 }}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {restModal && <RestModal type={restModal} char={char} setChar={setChar} onClose={() => setRestModal(null)}/>}

      {/* KARTA 1: POSTAĆ */}
      <div className="card">
        <div className="sect-label">{C.title}</div>

        <input className="iedit"
          style={{ fontFamily:"Cinzel,serif", fontSize:"1.35rem", fontWeight:700, letterSpacing:"0.04em", width:"100%", marginBottom:"0.7rem" }}
          value={char.name || ""} onChange={e => upd("name", e.target.value)} placeholder={C.heroName}/>

        {(char.classes || []).map((cls, i) => (
          <div key={i} className="class-row" style={{ alignItems:"baseline", gap:"0.4rem", marginBottom:"0.2rem" }}>
            <input className="iedit flex1"
              style={{ fontFamily:"Cinzel,serif", fontSize: i===0?"1.1rem":"0.95rem", fontWeight:700, letterSpacing:"0.03em" }}
              value={cls.name} placeholder={`${i+1}…`}
              onChange={e => setChar(c => { const cl=[...c.classes]; cl[i]={...cl[i],name:e.target.value}; return {...c,classes:cl}; })}/>
            {i === 0 && (char.classes||[]).length < 4 && (
              <button className="btn-ghost" style={{ padding:"0.1rem 0.4rem", fontSize:"0.8rem", flexShrink:0 }}
                onClick={() => setChar(c => ({...c, classes:[...(c.classes||[]),{name:"",level:1}]}))}>+</button>
            )}
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.14em", opacity:0.45, flexShrink:0, textTransform:"uppercase" }}>{C.level}</span>
            <input type="number" className="iedit" style={{ width:32, textAlign:"center", fontFamily:"Cinzel,serif", fontSize:i===0?"1rem":"0.88rem", fontWeight:600, opacity:0.85 }}
              value={cls.level} min={1} max={20}
              onChange={e => setChar(c => { const cl=[...c.classes]; cl[i]={...cl[i],level:clamp(parseInt(e.target.value)||1,1,20)}; return {...c,classes:cl}; })}/>
            {i === 0 && (
              <>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.12em", opacity:0.45, flexShrink:0, textTransform:"uppercase" }}>XP</span>
                <input type="number" min={0} className="iedit"
                  style={{ width:50, fontFamily:"Cinzel,serif", fontSize:"0.9rem", textAlign:"center", color:"inherit" }}
                  value={char.xp ?? 0} onChange={e => upd("xp", Math.max(0, parseInt(e.target.value)||0))}
                  onFocus={e => e.target.select()}/>
              </>
            )}
            {i > 0 && <button className="btn-ghost" style={{ padding:"0.1rem 0.35rem", fontSize:"0.65rem" }}
              onClick={() => setChar(c => ({...c, classes:c.classes.filter((_,j) => j!==i)}))}>✕</button>}
          </div>
        ))}
        <div style={{ ...LBL_SM, fontSize:"0.4rem", marginBottom:"0.5rem", textAlign:"right" }}>
          {xpMax !== null ? C.xpNext(totalLevel+1, xpMax.toLocaleString()) : C.xpMax}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem", alignItems:"end" }}>
          <div>
            <div style={LBL}>{C.race}</div>
            <input className="iedit" style={{ fontSize:"0.9rem" }} value={char.race||""}
              onChange={e => upd("race", e.target.value)} placeholder={C.racePh}/>
          </div>
          <div>
            <div style={LBL}>{C.background}</div>
            <input className="iedit" style={{ fontSize:"0.9rem" }} value={char.background||""}
              onChange={e => upd("background", e.target.value)} placeholder={C.backgroundPh}/>
          </div>
          <div>
            <div style={LBL}>{C.alignment}</div>
            <input className="iedit" maxLength={8} style={{ fontSize:"0.9rem" }} value={char.alignment||""}
              onChange={e => upd("alignment", e.target.value)} placeholder={C.alignmentPh}/>
          </div>
        </div>

        <hr className="inner-divider" data-label={C.appearance} style={{ marginTop:"1rem" }}/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem", marginTop:"0.7rem" }}>
          {[
            ["age",C.age,C.agePh],["height",C.height,C.heightPh],["weight",C.weight,C.weightPh],
            ["eyes",C.eyes,C.eyesPh],["skin",C.skin,C.skinPh],["hair",C.hair,C.hairPh],
          ].map(([key,label,ph]) => (
            <div key={key}>
              <div style={LBL}>{label}</div>
              <input className="iedit" style={{ fontSize:"0.88rem" }}
                value={(char.appearance||{})[key]||""} placeholder={ph}
                onChange={e => setChar(c => ({...c, appearance:{...(c.appearance||{}),[key]:e.target.value}}))}/>
            </div>
          ))}
        </div>
      </div>

      {/* KARTA 2: CECHY I RZUTY OBRONNE */}
      <div className="card">
        <div className="sect-label">{C.savingThrowsTitle}</div>
        <div className="stat-grid-6">
          {SAVING_THROWS.map(st => {
            const base = Math.floor((char.stats[st.attr]-10)/2);
            const over = (char.savingThrowOverride||{})[st.key];
            const stVal = over !== undefined ? over : base;
            const stColor = over !== undefined ? "var(--pip-prof)" : "inherit";
            return (
              <div key={st.key} style={{ display:"flex", flexDirection:"column", gap:0 }}>
                <StatBox label={st.attr} value={char.stats[st.attr]} onChange={v => updSt(st.attr, v)}/>
                <div className="stat-box" style={{ borderTop:"none", textAlign:"center", padding:"0.25rem 0.1rem 0.2rem", display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-muted)", lineHeight:1 }}>{C.st}</span>
                  <input type="number" value={stVal}
                    style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, color:stColor, textAlign:"center", width:"100%", padding:"0.1rem 0", lineHeight:1, cursor:"text" }}
                    onFocus={e => e.target.select()}
                    onChange={e => { const n=parseInt(e.target.value); setChar(c => ({...c, savingThrowOverride:{...(c.savingThrowOverride||{}),[st.key]:isNaN(n)?undefined:n}})); }}
                    onDoubleClick={() => setChar(c => { const o={...(c.savingThrowOverride||{})}; delete o[st.key]; return {...c,savingThrowOverride:o}; })}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KARTA 3: UMIEJĘTNOŚCI */}
      <div className="card">
        <div className="sect-label">{C.skillsTitle}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:"0.3rem" }}>
          {GENERIC_SKILLS.map(sk => {
            const prz = !!(char.skills||{})[sk.key];
            const exp = !!(char.skillExp||{})[sk.key];
            const base = Math.floor((char.stats[sk.attr]-10)/2);
            const bonus = exp ? base+pb*2 : prz ? base+pb : base;
            const pipColor  = exp ? "var(--pip-exp)"  : prz ? "var(--pip-prof)" : "transparent";
            const pipBorder = exp ? "2px solid var(--pip-exp)" : prz ? "1.5px solid var(--pip-prof)" : "1.5px solid var(--pip-empty)";
            const pipClip   = exp ? "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" : "none";
            const statColor = exp ? "var(--pip-exp)"  : prz ? "var(--pip-prof)" : "inherit";
            return (
              <div key={sk.key} title={sk.label} className={`stat-box${exp?" stat-box-exp":prz?" stat-box-prz":""}`}
                onClick={() => cycleSkill(sk.key)}
                style={{ position:"relative", cursor:"pointer", padding:"0.35rem 0.25rem 0.3rem", textAlign:"center", userSelect:"none", minWidth:0 }}>
                <div style={{ position:"absolute", top:"0.22rem", right:"0.22rem", width:10, height:10, borderRadius:"50%", border:pipBorder, background:pipColor, clipPath:pipClip, boxShadow:exp?"0 0 4px var(--pip-exp)":prz?"0 0 4px var(--pip-prof)":"none", transition:"all 0.15s", pointerEvents:"none" }}/>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-label)", display:"block", marginBottom:"0.15rem", lineHeight:1.2, paddingRight:"0.7rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sk.label}</span>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, color:statColor, display:"block", lineHeight:1 }}>{numMod(bonus)}</span>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.38rem", color:"var(--text-muted)", display:"block", marginTop:"0.1rem" }}>{sk.attr}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* KARTA 4: WALKA */}
      <div className="card">
        <div className="sect-label">{C.combatTitle}</div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.4rem", marginBottom:"0.7rem" }}>
          <div className="combat-box">
            <span className="combat-box-label">{C.ac}</span>
            <input className="combat-box-input" type="number" value={char.ac||0}
              onFocus={e => e.target.select()}
              onChange={e => upd("ac", e.target.value===""?0:parseInt(e.target.value)||0)}
              onBlur={e => upd("ac", parseInt(e.target.value)||0)}/>
          </div>
          <div className="combat-box" title={C.initiativeTip}>
            <span className="combat-box-label">{C.initiative}</span>
            <input className="combat-box-input" type="number"
              value={char.initiativeBonus !== undefined ? char.initiativeBonus : Math.floor((char.stats.DEX-10)/2)}
              onFocus={e => e.target.select()}
              onChange={e => upd("initiativeBonus", e.target.value===""?undefined:parseInt(e.target.value))}
              onBlur={e => { if(e.target.value==="") setChar(c => {const o={...c};delete o.initiativeBonus;return o;}); }}/>
          </div>
          <div className="combat-box">
            <span className="combat-box-label">{C.speed}</span>
            <input className="combat-box-input" type="number" value={char.speed||30}
              onFocus={e => e.target.select()}
              onChange={e => upd("speed", parseInt(e.target.value)||30)}/>
          </div>
          <div className="combat-box" title={C.profBonusTip}>
            <span className="combat-box-label">{C.profBonus}</span>
            <input className="combat-box-input" type="number" value={pb}
              onFocus={e => e.target.select()}
              onChange={e => upd("profBonus", parseInt(e.target.value)||2)}/>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"36px auto 36px 1fr", gap:"0.3rem", alignItems:"stretch" }}>
          <button className="btn-pm minus" style={{ height:"100%", minHeight:52 }}
            onClick={() => setChar(c => ({...c, hp:{...c.hp, current:clamp(c.hp.current-1,0,c.hp.max)}}))}>−</button>
          <div className="combat-box" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0.2rem 0.4rem", gap:0 }}>
            <span className="combat-box-label">{C.hp}</span>
            <div style={{ display:"flex", alignItems:"baseline", gap:"0.15rem" }}>
              <input type="number" value={char.hp.current}
                style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"1.4rem", fontWeight:700, width:52, color:hpNumColor(hpPct), transition:"color 0.5s" }}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({...c, hp:{...c.hp, current:e.target.value===""?0:clamp(parseInt(e.target.value)||0,0,c.hp.max)}}))}
                onBlur={e => setChar(c => ({...c, hp:{...c.hp, current:clamp(parseInt(e.target.value)||0,0,c.hp.max)}}))}/>
              <span style={{ color:"inherit", opacity:0.35, fontSize:"0.85rem" }}>/</span>
              <input type="number" value={char.hp.max}
                style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"0.9rem", width:40, opacity:0.75, color:"inherit" }}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({...c, hp:{...c.hp, max:e.target.value===""?1:Math.max(1,parseInt(e.target.value)||1)}}))}
                onBlur={e => setChar(c => ({...c, hp:{...c.hp, max:Math.max(1,parseInt(e.target.value)||1)}}))}/>
            </div>
          </div>
          <button className="btn-pm plus" style={{ height:"100%", minHeight:52 }}
            onClick={() => setChar(c => ({...c, hp:{...c.hp, current:clamp(c.hp.current+1,0,c.hp.max)}}))}>+</button>
          <div className="combat-box">
            <span className="combat-box-label">{C.hpTemp}</span>
            <input className="combat-box-input" type="number" value={char.hp.temp||0}
              onFocus={e => e.target.select()}
              onChange={e => setChar(c => ({...c, hp:{...c.hp, temp:e.target.value===""?0:parseInt(e.target.value)||0}}))}
              onBlur={e => setChar(c => ({...c, hp:{...c.hp, temp:parseInt(e.target.value)||0}}))}/>
          </div>
        </div>

        <div className="hp-bar-bg" style={{ marginTop:"0.5rem" }}>
          <div className="hp-bar-fill" style={{ width:`${hpPct}%`, background:hpBarColor(hpPct) }}/>
        </div>
        <div className="hp-pct" style={{ color:hpNumColor(hpPct) }}>{hpPct}{C.hpVitality}</div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem", marginTop:"0.6rem" }}>
          <div className="combat-box">
            <span className="combat-box-label">{C.passivePerc}</span>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"1.1rem", fontWeight:700, display:"block", textAlign:"center", color:"inherit" }}>{10+percBonus}</span>
          </div>
          <div className="combat-box" title={`8 + ${pb} + ${spellAbi>=0?"+":""}${spellAbi}`}>
            <span className="combat-box-label">{C.spellDC}</span>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"1.1rem", fontWeight:700, display:"block", textAlign:"center", color:"var(--spell-accent)" }}>{spellDC}</span>
          </div>
          <div className="combat-box">
            <span className="combat-box-label">{C.spellAtk}</span>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"1.1rem", fontWeight:700, display:"block", textAlign:"center", color:"var(--spell-accent)" }}>{numMod(pb+spellAbi)}</span>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"0.4rem", marginTop:"0.6rem" }}>
          <div className="combat-box" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0.25rem 0.4rem", gap:"0.1rem" }}>
            <span className="combat-box-label">{C.hitDice}</span>
            <div style={{ display:"flex", alignItems:"center", gap:"0.2rem" }}>
              <select className="combat-box-input" style={{ width:"auto", cursor:"pointer", fontSize:"0.75rem" }}
                value={(char.hitDice||{type:"d8"}).type}
                onChange={e => setChar(c => ({...c, hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),type:e.target.value}}))}>
                {["d4","d6","d8","d10","d12"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="number" min={0} value={(char.hitDice||{used:0}).used||0}
                onChange={e => setChar(c => ({...c, hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),used:parseInt(e.target.value)||0}}))}
                style={{ width:24, background:"transparent", border:"none", borderBottom:"1px dashed currentColor", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, textAlign:"center", color:"inherit" }}/>
              <span style={{ fontSize:"0.6rem", opacity:0.35 }}>/</span>
              <input type="number" min={1} value={(char.hitDice||{max:1}).max||1}
                onChange={e => setChar(c => ({...c, hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),max:parseInt(e.target.value)||1}}))}
                style={{ width:24, background:"transparent", border:"none", borderBottom:"1px dashed currentColor", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.9rem", textAlign:"center", color:"inherit", opacity:0.65 }}/>
            </div>
          </div>
          <button className="btn-rest short" onClick={() => setRestModal("short")}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.1rem", padding:"0.35rem 0.2rem" }}>
            <span style={{ fontSize:"1rem", lineHeight:1 }}>☽</span>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.43rem", textTransform:"uppercase" }}>{C.shortRest}</span>
          </button>
          <button className="btn-rest long" onClick={() => setRestModal("long")}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.1rem", padding:"0.35rem 0.2rem" }}>
            <span style={{ fontSize:"1rem", lineHeight:1 }}>☀</span>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.43rem", textTransform:"uppercase" }}>{C.longRest}</span>
          </button>
        </div>

        <div style={{ marginTop:"0.8rem" }}>
          <div style={{ ...LBL_SM, marginBottom:"0.4rem" }}>{C.conditionsTitle}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
            {CONDITIONS.map(cond => {
              const active = !!(char.conditions||{})[cond.key];
              return (
                <button key={cond.key} onClick={() => toggleCondition(cond.key)}
                  style={{ fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.06em", textTransform:"uppercase", padding:"0.22rem 0.45rem", border:`1px solid ${active?"#cc3030":"var(--pip-empty)"}`, background:active?"rgba(200,48,48,0.2)":"transparent", color:active?"#ee5050":"var(--text-muted)", cursor:"pointer", transition:"all 0.15s", borderRadius:"2px" }}>
                  {cond.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginTop:"0.8rem" }}>
          <div style={{ padding:"0.5rem 0.6rem", border:"1px solid rgba(128,128,128,0.14)", background:"rgba(128,128,128,0.04)", borderRadius:"2px" }}>
            <div style={{ ...LBL_SM, marginBottom:"0.5rem" }}>{C.deathSaves}</div>
            {[["successes",C.deathSuccess,"#4a9a5a"],["failures",C.deathFailure,"#9a3a3a"]].map(([type,label,color]) => (
              <div key={type} style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.35rem" }}>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.08em", textTransform:"uppercase", color, flexShrink:0, minWidth:44 }}>{label}</span>
                <div style={{ display:"flex", gap:"0.3rem" }}>
                  {[0,1,2].map(i => (
                    <div key={i} onClick={() => toggleDeath(type, i)}
                      style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${color}`, background:i<(ds[type]||0)?color:"transparent", cursor:"pointer", transition:"background 0.15s", flexShrink:0 }}/>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding:"0.5rem 0.6rem", border:"1px solid rgba(128,128,128,0.14)", background:"rgba(128,128,128,0.04)", borderRadius:"2px" }}>
            <div style={{ ...LBL_SM, marginBottom:"0.5rem" }}>{C.exhaustion}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.25rem" }}>
              {[0,1,2,3,4,5,6].map(level => {
                const cur = (char.conditions||{}).exhaustion || 0;
                const filled = level > 0 && level <= cur;
                return (
                  <button key={level}
                    onClick={() => setChar(c => ({...c, conditions:{...(c.conditions||{}), exhaustion:level===cur?0:level}}))}
                    style={{ width:"100%", aspectRatio:"1", borderRadius:"4px", border:`1.5px solid ${filled?"#cc5020":level===0&&cur===0?"#4a9a5a":"var(--pip-empty)"}`, background:filled?"rgba(200,80,32,0.25)":level===0&&cur===0?"rgba(74,154,90,0.15)":"transparent", cursor:"pointer", fontFamily:"Cinzel,serif", fontSize:"0.5rem", fontWeight:700, color:filled?"#ee7040":level===0&&cur===0?"#4a9a5a":"var(--text-dim)", lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {level===0?"✓":level}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* KARTA 5: AKTYWNE I WYPOSAŻONE */}
      <div className="card">
        <div className="sect-label">{C.equippedTitle}</div>
        <CoinRow/>
        <div className="subtab-bar">
          <button className={`subtab-btn${activeTab==="items"?"  active":""}`} onClick={() => setActiveTab("items")}>
            {C.tabItems}{equippedItems.length>0?` (${equippedItems.length})`:""}
          </button>
          <button className={`subtab-btn${activeTab==="skills"?" active":""}`} onClick={() => setActiveTab("skills")}>
            {C.tabAbilities}{activeSkills.length>0?` (${activeSkills.length})`:""}
          </button>
          <button className={`subtab-btn${activeTab==="spells"?" active":""}`} onClick={() => setActiveTab("spells")}>
            {C.tabSpells}{activeSpells.length>0?` (${activeSpells.length})`:""}
          </button>
        </div>

        {activeTab==="items" && (equippedItems.length===0
          ? <div className="empty-state">{C.emptyItems}</div>
          : equippedItems.map(item => (
            <div key={item.id} className="equipped-item">
              <span className="equipped-icon">{ITEM_ICONS[item.type]||"◈"}</span>
              <div className="flex1">
                <div className="row" style={{ gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                  <span className="equipped-name">{item.name}</span>
                  <span className="equipped-type-badge">{item.type}</span>
                  {item.qty && item.qty!=="1" && <span className="equipped-type-badge">×{item.qty}</span>}
                </div>
                {item.damage && <div className="equipped-stat">⚔ {item.damage}{item.damageType?` (${item.damageType})`:""}{item.modifier?` · +${parseInt(item.modifier)||0}`:""}</div>}
                {item.charges && <div className="equipped-stat">{C.charges} {item.charges}</div>}
                {item.effect && <div className="equipped-stat" style={{ color:"var(--spell-muted)" }}>{item.effect}</div>}
                {item.note && <div className="equipped-stat" style={{ fontStyle:"italic", opacity:0.7 }}>{item.note}</div>}
              </div>
            </div>
          ))
        )}

        {activeTab==="skills" && (activeSkills.length===0
          ? <div className="empty-state">{C.emptyAbilities}</div>
          : activeSkills.map(sk => (
            <div key={sk.id} className="equipped-item">
              <span className="equipped-icon">✨</span>
              <div className="flex1">
                <div className="row" style={{ gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                  <span className="equipped-name">{sk.name}</span>
                  <span className="equipped-skill-badge">{sk.category}</span>
                  {sk.level>0 && <span className="equipped-skill-badge">{"●".repeat(sk.level)}</span>}
                </div>
                {sk.description && <div className="equipped-stat">{sk.description}</div>}
              </div>
            </div>
          ))
        )}

        {activeTab==="spells" && (
          <>
            <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
            {activeSpells.length > 0 && (
              <div style={{ marginTop:"0.8rem" }}>
                {activeSpells.map(sp => (
                  <div key={sp.id} className="equipped-item">
                    <span className="equipped-icon">🔮</span>
                    <div className="flex1">
                      <div className="row" style={{ gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                        <span className="equipped-name" style={{ color:"var(--spell-text)" }}>{sp.name}</span>
                        <span className="equipped-spell-badge">{sp.level}</span>
                        {sp.school && <span className="equipped-spell-badge">{sp.school}</span>}
                      </div>
                      {sp.description && <div className="equipped-stat">{sp.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeSpells.length===0 && <div className="empty-state">{C.emptySpells}</div>}
          </>
        )}
      </div>

      {/* KARTA 6: BIEGŁOŚCI */}
      <div className="card">
        <div className="sect-label">{C.profTitle}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
          {[
            ["weapons", C.weapons, C.weaponsPh],
            ["armor",   C.armor,   C.armorPh],
            ["languages",C.languages,C.languagesPh],
            ["tools",   C.tools,   C.toolsPh],
          ].map(([key,label,ph]) => (
            <div key={key}>
              <div style={LBL}>{label}</div>
              <textarea className="g-textarea" rows={2} placeholder={ph}
                value={(char.proficiencies||{})[key]||""}
                onChange={e => setChar(c => ({...c, proficiencies:{...(c.proficiencies||{}),[key]:e.target.value}}))}
                style={{ fontSize:"0.9rem", minHeight:"2.5rem" }}/>
            </div>
          ))}
        </div>
      </div>

      {/* KARTA 7: CECHY OSOBOWOŚCI */}
      <div className="card">
        <div className="sect-label">{C.personalityTitle}</div>
        <div className="trait-grid">
          {[
            ["personality",C.persTraits,C.persPh],
            ["ideals",C.ideals,C.idealsPh],
            ["bonds",C.bonds,C.bondsPh],
            ["flaws",C.flaws,C.flawsPh],
          ].map(([key,label,ph]) => (
            <div key={key} className="trait-block">
              <span className="trait-label">{label}</span>
              <textarea className="trait-ta" rows={3} placeholder={ph} value={char.traits?.[key]||""}
                onChange={e => setChar(c => ({...c, traits:{...(c.traits||{}),[key]:e.target.value}}))}/>
            </div>
          ))}
        </div>
      </div>

      {/* KARTA 8: HISTORIA I NOTATKI */}
      <div className="card">
        <div className="sect-label">{C.notesTitle}</div>
        <div style={{ ...LBL, marginBottom:"0.3rem" }}>{C.personalNotes}</div>
        <textarea className="g-textarea" rows={3} placeholder={C.personalNotesPh} value={char.personalNotes||""} onChange={e => upd("personalNotes", e.target.value)}/>
        <div style={{ ...LBL, marginTop:"0.8rem", marginBottom:"0.3rem" }}>{C.backstory}</div>
        <textarea className="g-textarea" rows={5} placeholder={C.backstoryPh} value={char.backstory||""} onChange={e => upd("backstory", e.target.value)}/>
      </div>
    </>
  );
}
