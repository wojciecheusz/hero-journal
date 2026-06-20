import { useState } from 'react';
import { DND_CLASSES } from '../constants/gameConstants';
import Icon from '../shared/icons';

export const ICON_CHOICES = [...new Set(DND_CLASSES.map(c => c.icon))];

export function getCharIcon(char) {
  const classIcon = DND_CLASSES.find(c => c.name === char.classes?.[0]?.name)?.icon || "sword";
  return char.icon || classIcon;
}

/* ── Wybór ikony profilu bohatera (obok logo HJ) — używany w Header (mobile) i Sidebar (desktop) ── */
export default function CharIconPicker({ value, onChange, size = 28 }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:"relative" }}>
      <button onClick={e => { e.stopPropagation(); setOpen(o => !o); }} aria-expanded={open}
        title="Zmień ikonę bohatera"
        style={{ background:"transparent", border:"1px solid var(--hj-border-input)",
                 color:"var(--hj-accent)", width:size, height:size, borderRadius:"50%",
                 cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                 transition:"all 0.15s", flexShrink:0 }}>
        <Icon name={value} size="1em"/>
      </button>
      {open && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:200 }} onClick={() => setOpen(false)}/>
          <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, zIndex:201,
                        background:"var(--hj-modal-bg)", border:"1px solid var(--hj-accent-border)",
                        borderRadius:"var(--radius-md)", padding:"0.4rem",
                        display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:"0.3rem",
                        boxShadow:"0 8px 24px rgba(0,0,0,0.45)", width:170 }}>
            {ICON_CHOICES.map(icon => (
              <button key={icon} onClick={() => { onChange(icon); setOpen(false); }}
                aria-label={icon}
                style={{ width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center",
                         background: icon===value ? "rgba(226,185,78,0.15)" : "transparent",
                         border:`1px solid ${icon===value ? "var(--hj-accent-border)" : "transparent"}`,
                         borderRadius:"var(--radius-sm)", cursor:"pointer",
                         color: icon===value ? "var(--hj-accent)" : "var(--hj-text-muted)" }}>
                <Icon name={icon} size="1em"/>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
