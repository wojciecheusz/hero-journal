import { useRef, useState } from 'react';
import Icon, { PALETTE_ICONS } from '../shared/icons';
import { PALETTES, THEMES } from '../theme/themes';

/**
 * Menu ustawień (P29/D8) — renderowane w Popoverze (portal), więc nie jest
 * przycinane przez sidebar ani zasłaniane przez obszar roboczy.
 * Sekcje: bohater i język → konto → motyw → kopia zapasowa → strefa
 * niebezpieczna (reset postaci odseparowany od zwykłych akcji).
 */
export default function SettingsMenu({
  T, theme, setTheme, toggleLanguage,
  setScreen, setShowReset, onClose,
  user, onCloudRefresh, onLogout,
  onExport, onImport,
}) {
  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState(null);

  const run = (fn) => () => { fn(); onClose(); };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        onImport(ev.target.result);
        onClose();
      } catch {
        setImportError(T.UI.importError);
        setTimeout(() => setImportError(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const userName = user ? (user.displayName || user.email || "").split(/[\s@]/)[0] : "";

  return (
    <>
      <div className="settings-section">
        <button className="settings-btn" onClick={run(() => setScreen("profiles"))}>
          <Icon name="users" size="1.1em"/> {T.UI.changeHero}
        </button>
        <button className="settings-btn" onClick={run(toggleLanguage)}>
          <Icon name="globe" size="1.1em"/> {T.UI.langLabel}
          <span className="settings-btn-sub">{T.UI.langName}</span>
        </button>
        {user && onCloudRefresh && (
          <button className="settings-btn" onClick={run(onCloudRefresh)}>
            <Icon name="sync" size="1.1em"/> {T.UI.syncData}
          </button>
        )}
        {user && onLogout && (
          <button className="settings-btn" onClick={run(onLogout)}>
            <Icon name="logout" size="1.1em"/> {T.UI.logout}
            {userName && <span className="settings-btn-sub">{userName}</span>}
          </button>
        )}
      </div>

      <div className="settings-section">
        <div className="settings-heading">{T.UI.themeColor}</div>
        <div className="theme-grid">
          {PALETTES.map(name => {
            const t = THEMES[name];
            const active = theme === name;
            const label = T.PALETTE_LABELS?.[name] || name;
            return (
              <button key={name} className={`theme-btn${active ? " active" : ""}`}
                onClick={() => setTheme(name)} aria-pressed={active} title={label}>
                <span className="theme-swatch" style={{ background:t.bg, border:`2px solid ${t.accent}` }}>
                  <Icon name={PALETTE_ICONS[name] || "sparkle"} size="0.75rem" color={t.accent}/>
                </span>
                <span className="theme-name">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-heading">{T.UI.backupSection}</div>
        <button className="settings-btn" onClick={onExport}>
          <Icon name="download" size="1.1em"/> {T.UI.exportProfile}
        </button>
        <button className="settings-btn" onClick={() => fileInputRef.current?.click()}>
          <Icon name="upload" size="1.1em"/> {T.UI.importProfile}
        </button>
        <input ref={fileInputRef} type="file" accept=".json" style={{ display:"none" }} onChange={handleFileChange}/>
        {importError && (
          <span className="settings-error" role="alert"><Icon name="warning" size="1em"/> {importError}</span>
        )}
      </div>

      <div className="settings-section settings-danger">
        <div className="settings-heading">{T.UI.dangerZone}</div>
        <button className="settings-btn danger" onClick={run(() => setShowReset(true))}>
          <Icon name="warning" size="1.1em"/> {T.UI.resetChar}
        </button>
      </div>

      {/* Licencja CC BY 3.0 wymaga podania autorów ikon */}
      <p className="settings-credits">
        {T.UI.iconCredits}{" "}
        <a href="https://game-icons.net" target="_blank" rel="noopener noreferrer">game-icons.net</a>
        {" "}(Lorc, Delapouite {T.UI.andOthers}) · <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>
      </p>
    </>
  );
}
