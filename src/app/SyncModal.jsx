import { useState } from 'react';
import Icon from '../shared/icons';

/* Klucz localStorage → czytelna nazwa. Klucze slotow maja postac
   `hj_{slot}_{profileId}`, reszta to pojedyncze klucze aplikacji. */
function keyLabel(key, S) {
  if (key === 'hj_profiles')       return S.profilesLabel;
  if (key === 'hj_active_profile') return S.activeProfileLabel;
  const m = /^hj_([a-z]+)_/.exec(key);
  if (m && S.slotLabels[m[1]])     return S.slotLabels[m[1]];
  return S.settingsLabel;
}

const rowStyle = {
  fontFamily: "Crimson Text,Georgia,serif", fontSize: "0.95rem",
  color: "var(--hj-text)", padding: "0.15rem 0",
};

/**
 * Narzedzia synchronizacji: stan, rozstrzyganie konfliktow i furtka awaryjna.
 *
 * Konflikt = te same dane zmienily sie i lokalnie, i w chmurze, odkad ostatnio
 * byly zgodne. Aplikacja nigdy nie wybiera wtedy sama — decyzja nalezy do
 * uzytkownika, bo kazdy wybor kogos kosztuje dane.
 */
export default function SyncModal({
  T, conflicts = [], legacy = [], dirtyCount = 0, signedIn = true,
  onKeepLocal, onTakeCloud, onForcePush, onForcePull, onClose,
}) {
  const S = T.SYNC;
  const [busy, setBusy]    = useState(false);
  const [msg, setMsg]      = useState(null);
  const [arm, setArm]      = useState(null);   // ktory przycisk awaryjny jest uzbrojony

  const run = async (fn) => {
    setBusy(true); setMsg(null); setArm(null);
    try { setMsg(await fn()); }
    catch { setMsg(S.failed); }
    finally { setBusy(false); }
  };

  const armed = (which, fn) => () => {
    if (arm !== which) { setArm(which); return; }
    run(fn);
  };

  const btn = {
    background: "transparent", border: "1px solid var(--hj-border-input)", color: "var(--hj-text)",
    fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase",
    padding: "0.5rem 0.7rem", cursor: busy ? "wait" : "pointer", borderRadius: "var(--radius-sm)",
    textAlign: "left", width: "100%",
  };
  const btnArmed = { ...btn, border: "1px solid #8a6a2a", color: "#e2b94e" };
  const sectionLabel = {
    fontFamily: "Cinzel,serif", fontSize: "0.55rem", letterSpacing: "0.14em",
    textTransform: "uppercase", color: "var(--hj-text-muted)",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ borderColor: "var(--hj-accent-border)", maxWidth: 460 }}
        onClick={e => e.stopPropagation()}>
        <div className="modal-title" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--hj-accent)" }}>
          <Icon name="cloud" size="0.95em"/> {S.title}
        </div>

        {/* ── Stan ── */}
        <div style={{ ...rowStyle, paddingBottom: "0.6rem" }}>
          {!signedIn ? S.offline : dirtyCount > 0 ? S.statusDirty(dirtyCount) : S.statusClean}
        </div>

        {legacy.length > 0 && (
          <div style={{ ...rowStyle, color: "var(--hj-text-muted)", paddingBottom: "0.6rem" }}>
            {S.legacyNote(legacy.length)}
          </div>
        )}

        {/* ── Konflikty ── */}
        {conflicts.length > 0 && (
          <div style={{ borderTop: "1px solid var(--hj-border-sub)", paddingTop: "0.6rem", marginBottom: "0.6rem" }}>
            <div style={{ ...sectionLabel, paddingBottom: "0.3rem" }}>{S.conflictTitle}</div>
            <div style={{ ...rowStyle, color: "var(--hj-text-muted)", paddingBottom: "0.4rem" }}>{S.conflictIntro}</div>
            <ul style={{ margin: "0 0 0.6rem", paddingLeft: "1.1rem" }}>
              {conflicts.map(k => <li key={k} style={rowStyle}>{keyLabel(k, S)}</li>)}
            </ul>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <button style={btn} disabled={busy}
                onClick={() => run(() => onKeepLocal(conflicts))}>{S.keepLocal}</button>
              <button style={btn} disabled={busy}
                onClick={() => run(() => onTakeCloud(conflicts))}>{S.takeCloud}</button>
            </div>
          </div>
        )}

        {/* ── Furtka awaryjna ── */}
        <div style={{ borderTop: "1px solid var(--hj-border-sub)", paddingTop: "0.6rem" }}>
          <div style={{ ...sectionLabel, paddingBottom: "0.3rem" }}>{S.toolsTitle}</div>
          <div style={{ ...rowStyle, color: "var(--hj-text-muted)", paddingBottom: "0.5rem" }}>{S.toolsIntro}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <button style={arm === "push" ? btnArmed : btn} disabled={busy || !signedIn}
              onClick={armed("push", onForcePush)}>
              {arm === "push" ? S.forcePushWarn : S.forcePush}
            </button>
            <button style={arm === "pull" ? btnArmed : btn} disabled={busy || !signedIn}
              onClick={armed("pull", onForcePull)}>
              {arm === "pull" ? S.forcePullWarn : S.forcePull}
            </button>
          </div>
        </div>

        {(busy || msg) && (
          <div style={{ ...rowStyle, paddingTop: "0.6rem", color: "var(--hj-accent)" }}>
            {busy ? S.working : msg}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.8rem" }}>
          <button style={{ ...btn, width: "auto" }} onClick={onClose}>{S.close}</button>
        </div>
      </div>
    </div>
  );
}
