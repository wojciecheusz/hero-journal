import { useState } from 'react';
import { useT } from '../i18n/translations';
import { THEMES } from '../theme/themes';

export default function TutorialModal({ theme, onClose }) {
  const T   = useT();
  const TUT = T.TUTORIAL;
  const t   = THEMES[theme] || THEMES.dungeon;
  const [slide, setSlide] = useState(0);

  const slides = TUT.slides;
  const isLast = slide === slides.length - 1;
  const cur    = slides[slide];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:`calc(env(safe-area-inset-top, 16px) + 1rem) 1rem calc(env(safe-area-inset-bottom, 16px) + 1rem)` }}>
      <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, padding:"2rem 2rem 1.5rem", maxWidth:480, width:"100%", borderRadius:"4px", boxShadow:`0 24px 80px ${t.shadowBot}`, position:"relative" }}>

        {/* Counter */}
        <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.22em", textTransform:"uppercase", color:t.textDim, marginBottom:"1.25rem" }}>
          {TUT.stepOf(slide+1, slides.length)}
        </div>

        {/* Icon */}
        <div style={{ fontSize:"2.2rem", lineHeight:1, marginBottom:"0.65rem" }}>{cur.icon}</div>

        {/* Title */}
        <div style={{ fontFamily:"Cinzel Decorative,serif", fontSize:"1.05rem", color:t.accent, fontWeight:700, marginBottom:"0.9rem", letterSpacing:"0.04em", lineHeight:1.3 }}>
          {cur.title}
        </div>

        {/* Body */}
        {cur.body && (
          <p style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"1.05rem", color:t.text, lineHeight:1.72, marginBottom:"1rem" }}>
            {cur.body}
          </p>
        )}

        {/* Actions list (slide 4) */}
        {cur.actions && (
          <div style={{ display:"flex", flexDirection:"column", gap:"0.45rem", marginBottom:"1rem" }}>
            {cur.actions.map(([icon, label]) => (
              <div key={icon} style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem" }}>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.65rem", color:t.accent, minWidth:52, textAlign:"center", background:`${t.accent}14`, border:`1px solid ${t.accentBorder}`, padding:"0.2rem 0.35rem", borderRadius:"2px", flexShrink:0 }}>
                  {icon}
                </span>
                <span style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.95rem", color:t.text, lineHeight:1.55 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tip */}
        {cur.tip && (
          <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.1em", color:t.textMuted, background:t.bgInput, border:`1px solid ${t.borderSub}`, padding:"0.5rem 0.75rem", marginBottom:"1rem", lineHeight:1.65 }}>
            {cur.tip}
          </div>
        )}

        {/* Progress dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:"0.45rem", margin:"1.25rem 0 1.5rem" }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width:7, height:7, borderRadius:"50%", background: i===slide ? t.accent : t.borderInput, border:"none", cursor:"pointer", padding:0, transition:"background 0.2s", flexShrink:0 }}/>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button onClick={onClose}
            style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", border:"none", color:t.textDim, cursor:"pointer", padding:"0.3rem 0" }}>
            {TUT.skip}
          </button>
          <div style={{ display:"flex", gap:"0.5rem" }}>
            {slide > 0 && (
              <button onClick={() => setSlide(s => s-1)}
                style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", border:`1px solid ${t.borderInput}`, color:t.textMuted, padding:"0.42rem 0.9rem", cursor:"pointer" }}>
                {TUT.prev}
              </button>
            )}
            <button onClick={() => isLast ? onClose() : setSlide(s => s+1)}
              style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"rgba(226,185,78,0.1)", border:`1px solid ${t.accentBorder}`, color:t.accent, padding:"0.42rem 1.1rem", cursor:"pointer" }}>
              {isLast ? TUT.start : TUT.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
