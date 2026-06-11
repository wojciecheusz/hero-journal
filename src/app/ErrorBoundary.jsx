import React from 'react';
import { remove } from '../utils/storage';
import { detectLang, TRANSLATIONS } from '../i18n/translations';
import Icon from '../shared/icons';

/* ── Ekran błędu ────────────────────────────────────────────── */
function CrashScreen({ error, onReload, onReset }) {
  const T = TRANSLATIONS[detectLang()];
  return (
    <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem", background:"var(--hj-bg,#080304)", color:"var(--hj-text,#f0d8d5)", fontFamily:"Crimson Text,Georgia,serif" }}>
      <div style={{ maxWidth:480, width:"100%", textAlign:"center" }}>

        <div style={{ display:"flex", justifyContent:"center", marginBottom:"1rem", opacity:0.6, color:"var(--hj-accent,#cc2233)" }}><Icon name="warning" size="3rem"/></div>

        <h1 style={{ fontFamily:"Cinzel Decorative,serif", fontSize:"1.1rem", color:"var(--hj-accent,#cc2233)", letterSpacing:"0.06em", marginBottom:"0.75rem" }}>
          {T.CRASH?.title ?? "Something went wrong"}
        </h1>

        <p style={{ fontSize:"1rem", color:"var(--hj-text-muted,#c07070)", lineHeight:1.75, marginBottom:"1.5rem" }}>
          {T.CRASH?.body ?? "Hero Journal encountered an unexpected error. Your character data is safe in the browser's local storage."}
        </p>

        <details style={{ textAlign:"left", marginBottom:"1.5rem", background:"rgba(255,255,255,0.04)", border:"1px solid var(--hj-border,#3a0e0e)", padding:"0.75rem 1rem", borderRadius:"2px" }}>
          <summary style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", color:"var(--hj-text-dim,#804040)", userSelect:"none" }}>
            {T.CRASH?.details ?? "Error details"}
          </summary>
          <pre style={{ fontFamily:"monospace", fontSize:"0.72rem", color:"var(--hj-text-dim,#804040)", marginTop:"0.6rem", overflow:"auto", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
            {error?.message || String(error)}
          </pre>
        </details>

        <div style={{ display:"flex", gap:"0.75rem", justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={onReload}
            style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", border:"1px solid var(--hj-accent-border,#941525)", color:"var(--hj-accent,#cc2233)", padding:"0.55rem 1.2rem", cursor:"pointer", transition:"all 0.15s", borderRadius:"2px" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(204,34,51,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}>
            {T.CRASH?.reload ?? "Reload page"}
          </button>
          {onReset && (
            <button onClick={onReset}
              style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"rgba(204,34,51,0.08)", border:"1px solid var(--hj-accent-border,#941525)", color:"var(--hj-accent,#cc2233)", padding:"0.55rem 1.2rem", cursor:"pointer", transition:"all 0.15s", borderRadius:"2px" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(204,34,51,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(204,34,51,0.08)"}>
              {T.CRASH?.recover ?? "Try to recover"}
            </button>
          )}
        </div>

        <p style={{ marginTop:"1.5rem", fontSize:"0.82rem", color:"var(--hj-text-dim,#4a2020)", lineHeight:1.6 }}>
          {T.CRASH?.resetHint ?? "If this keeps happening, try"}{" "}
          <button onClick={() => { remove("hj_tutorial_seen"); window.location.reload(); }}
            style={{ background:"none", border:"none", color:"var(--hj-text-dim,#804040)", cursor:"pointer", textDecoration:"underline", fontFamily:"inherit", fontSize:"inherit", padding:0 }}>
            {T.CRASH?.resetLink ?? "clearing tutorial state"}
          </button>
          {" "}{T.CRASH?.contactSuffix ?? "or contact support."}
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
