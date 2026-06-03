import React from 'react';

/* ── Ekran błędu ────────────────────────────────────────────── */
function CrashScreen({ error, onReload, onReset }) {
  return (
    <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem", background:"#080304", color:"#f0d8d5", fontFamily:"Crimson Text,Georgia,serif" }}>
      <div style={{ maxWidth:480, width:"100%", textAlign:"center" }}>

        <div style={{ fontSize:"3rem", marginBottom:"1rem", opacity:0.6 }}>⚠</div>

        <h1 style={{ fontFamily:"Cinzel Decorative,serif", fontSize:"1.1rem", color:"#cc2233", letterSpacing:"0.06em", marginBottom:"0.75rem" }}>
          Something went wrong
        </h1>

        <p style={{ fontSize:"1rem", color:"#c07070", lineHeight:1.75, marginBottom:"1.5rem" }}>
          Hero Journal encountered an unexpected error.
          Your character data is safe in the browser's local storage.
        </p>

        <details style={{ textAlign:"left", marginBottom:"1.5rem", background:"rgba(255,255,255,0.04)", border:"1px solid #3a0e0e", padding:"0.75rem 1rem", borderRadius:"2px" }}>
          <summary style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", color:"#804040", userSelect:"none" }}>
            Error details
          </summary>
          <pre style={{ fontFamily:"monospace", fontSize:"0.72rem", color:"#804040", marginTop:"0.6rem", overflow:"auto", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
            {error?.message || String(error)}
          </pre>
        </details>

        <div style={{ display:"flex", gap:"0.75rem", justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={onReload}
            style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", border:"1px solid #941525", color:"#cc2233", padding:"0.55rem 1.2rem", cursor:"pointer", transition:"all 0.15s", borderRadius:"2px" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(204,34,51,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}>
            Reload page
          </button>
          {onReset && (
            <button onClick={onReset}
              style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"rgba(204,34,51,0.08)", border:"1px solid #941525", color:"#ee5060", padding:"0.55rem 1.2rem", cursor:"pointer", transition:"all 0.15s", borderRadius:"2px" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(204,34,51,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(204,34,51,0.08)"}>
              Try to recover
            </button>
          )}
        </div>

        <p style={{ marginTop:"1.5rem", fontSize:"0.82rem", color:"#4a2020", lineHeight:1.6 }}>
          If this keeps happening, try{" "}
          <button onClick={() => { localStorage.removeItem("hj_tutorial_seen"); window.location.reload(); }}
            style={{ background:"none", border:"none", color:"#804040", cursor:"pointer", textDecoration:"underline", fontFamily:"inherit", fontSize:"inherit", padding:0 }}>
            clearing tutorial state
          </button>
          {" "}or contact support.
        </p>
      </div>
    </div>
  );
}

/* ── Error Boundary class ───────────────────────────────────── */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleReset  = this.handleReset.bind(this);
    this.handleReload = this.handleReload.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[HeroJournal] Unhandled error:', error);
    console.error('Component stack:', info.componentStack);
  }

  handleReset() {
    this.setState({ error: null });
    this.props.onReset?.();
  }

  handleReload() {
    window.location.reload();
  }

  render() {
    if (this.state.error) {
      return (
        <CrashScreen
          error={this.state.error}
          onReload={this.handleReload}
          onReset={this.props.onReset ? this.handleReset : null}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
