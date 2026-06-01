export default function LoadingScreen() {
  return (
    <div style={{ position:"fixed", inset:0, background:"var(--hj-bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1rem" }}>
      <div style={{ fontFamily:"Cinzel Decorative,serif", fontSize:"1.5rem", color:"var(--hj-accent)", letterSpacing:"0.1em" }}>⚔ Hero Journal</div>
      <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem", color:"var(--hj-text-dim)", letterSpacing:"0.18em", textTransform:"uppercase" }}>Synchronizacja…</div>
    </div>
  );
}
