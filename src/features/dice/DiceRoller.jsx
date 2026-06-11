import { useState } from 'react';
import { useT } from '../../i18n/translations';
import Icon from '../../shared/icons';

const QUICK_DICE = [4, 6, 8, 10, 12, 20, 100];

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function parseExpr(raw) {
  // Akceptuje d/k, np.: d20, k20, 2d6, 2k6+3, d20-1
  const m = raw.trim().match(/^(\d*)[dk](\d+)([+-]\d+)?$/i);
  if (!m) return null;
  const count = parseInt(m[1] || '1', 10);
  const sides = parseInt(m[2], 10);
  const mod   = parseInt(m[3] || '0', 10);
  if (count < 1 || count > 20 || sides < 2 || sides > 1000) return null;
  return { count, sides, mod };
}

function formatExpr(count, sides, mod) {
  return `${count > 1 ? count : ''}k${sides}${mod > 0 ? '+' + mod : mod < 0 ? mod : ''}`;
}

function rollBreakdown(result) {
  const { rolls, mod, count } = result;
  if (count === 1 && mod === 0) return null;
  const base = count > 1 ? `[${rolls.join('+')}]` : String(rolls[0]);
  const modStr = mod > 0 ? `+${mod}` : mod < 0 ? String(mod) : '';
  return base + modStr;
}

export default function DiceRoller({ onClose }) {
  const T = useT();
  const D = T.DICE;

  const [expr, setExpr]       = useState('k20');
  const [result, setResult]   = useState(null);
  const [history, setHistory] = useState([]);
  const [shake, setShake]     = useState(false);

  const doRoll = () => {
    const parsed = parseExpr(expr);
    if (!parsed) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const { count, sides, mod } = parsed;
    const rolls = Array.from({ length: count }, () => rollDie(sides));
    const total = rolls.reduce((a, b) => a + b, 0) + mod;
    const res   = { expr: formatExpr(count, sides, mod), rolls, mod, total, sides, count };
    setResult(res);
    setHistory(h => [res, ...h].slice(0, 6));
  };

  const isCrit   = result?.sides === 20 && result?.count === 1 && result?.rolls[0] === 20;
  const isFumble = result?.sides === 20 && result?.count === 1 && result?.rolls[0] === 1;

  const resultColor = isCrit ? '#ffd700' : isFumble ? 'var(--hj-danger, #c94a4a)' : 'var(--hj-accent)';

  return (
    <div className="dice-panel">
      {/* Nagłówek */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.55rem' }}>
        <span style={{ fontFamily:'Cinzel,serif', fontSize:'0.55rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--hj-accent)', display:'flex', alignItems:'center', gap:'0.4rem' }}>
          <Icon name="dice" size="1em"/> {D.title}
        </span>
        <button onClick={onClose}
          style={{ background:'none', border:'none', color:'var(--hj-text-dim)', cursor:'pointer', padding:'0 0.2rem', lineHeight:1, display:'flex' }}>
          <Icon name="close" size="0.9em"/>
        </button>
      </div>

      {/* Szybkie kości */}
      <div style={{ display:'flex', gap:'0.28rem', marginBottom:'0.55rem', flexWrap:'wrap' }}>
        {QUICK_DICE.map(d => {
          const e = `k${d}`;
          const active = expr === e;
          return (
            <button key={d} onClick={() => setExpr(e)}
              style={{ fontFamily:'Cinzel,serif', fontSize:'0.58rem', padding:'0.22rem 0.4rem',
                background: active ? 'rgba(226,185,78,0.12)' : 'transparent',
                border: `1px solid ${active ? 'var(--hj-accent-border)' : 'var(--hj-border-input)'}`,
                color: active ? 'var(--hj-accent)' : 'var(--hj-text-muted)',
                cursor:'pointer', borderRadius:'2px', transition:'all 0.1s' }}>
              k{d}
            </button>
          );
        })}
      </div>

      {/* Wyrażenie + przycisk */}
      <div style={{ display:'flex', gap:'0.45rem', marginBottom:'0.6rem' }}>
        <input className="g-input" value={expr}
          onChange={e => setExpr(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doRoll()}
          placeholder={D.placeholder}
          style={{ flex:1, borderColor: shake ? 'var(--hj-danger,#c94a4a)' : undefined, transition:'border-color 0.2s' }}/>
        <button className="btn-ghost" onClick={doRoll} style={{ flexShrink:0, minWidth:56 }}>
          {D.roll}
        </button>
      </div>

      {/* Wynik */}
      {result && (
        <div style={{ textAlign:'center', padding:'0.25rem 0 0.5rem' }}>
          <div style={{ fontFamily:'Cinzel,serif', fontWeight:700, fontSize:'2.8rem', lineHeight:1,
            color: resultColor,
            textShadow: isCrit ? '0 0 18px rgba(255,215,0,0.55)' : 'none',
          }}>
            {result.total}
          </div>
          <div style={{ fontFamily:'Crimson Text,Georgia,serif', fontSize:'0.8rem', color:'var(--hj-text-muted)', fontStyle:'italic', marginTop:'0.1rem', minHeight:'1.1em' }}>
            {rollBreakdown(result)}
            {isCrit   && <span style={{ color:'#ffd700',   marginLeft:'0.5rem', fontFamily:'Cinzel,serif', fontSize:'0.52rem', letterSpacing:'0.1em' }}>{D.crit}</span>}
            {isFumble && <span style={{ color:'#c94a4a',   marginLeft:'0.5rem', fontFamily:'Cinzel,serif', fontSize:'0.52rem', letterSpacing:'0.1em' }}>{D.fumble}</span>}
          </div>
        </div>
      )}

      {/* Historia */}
      {history.length > 1 && (
        <div style={{ display:'flex', gap:'0.3rem', flexWrap:'wrap', paddingTop:'0.35rem', borderTop:'1px solid var(--hj-border-sub)' }}>
          {history.slice(1).map((h, i) => (
            <button key={i} onClick={() => setExpr(h.expr)}
              style={{ fontFamily:'Cinzel,serif', fontSize:'0.46rem', padding:'0.1rem 0.3rem',
                border:'1px solid var(--hj-border-sub)', color:'var(--hj-text-dim)',
                background:'transparent', cursor:'pointer', borderRadius:'2px' }}>
              {h.expr} → <strong style={{ color:'var(--hj-text)' }}>{h.total}</strong>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
