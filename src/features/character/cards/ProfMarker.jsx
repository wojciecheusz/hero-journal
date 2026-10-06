/* Znacznik biegłości (P29) — kropka / romb, ale z obszarem dotyku ≥36–44px.
   Wcześniej był to przycisk 8–10px, praktycznie nie do trafienia palcem. */
export function ProfMarker({ prof, exp, label, C, onClick }) {
  const state = exp ? "exp" : prof ? "prof" : "none";
  return (
    <button className={`prof-marker ${state}`} onClick={onClick}
      aria-label={`${label}: ${C.profState?.[state] ?? state}`} aria-pressed={prof || exp}>
      <span className="prof-dot"/>
    </button>
  );
}

/* Legenda znaczników pod tytułem karty */
export function ProfLegend({ C }) {
  return (
    <div className="prof-legend">
      <span><span className="prof-dot none"/> {C.profState?.none}</span>
      <span><span className="prof-dot prof"/> {C.profState?.prof}</span>
      <span><span className="prof-dot exp"/> {C.profState?.exp}</span>
      <span className="prof-legend-hint">{C.profLegend}</span>
    </div>
  );
}
