import { useState } from 'react';

/* Dolna nawigacja mobile + szuflada grup wielo-zakładkowych (Wyposażenie/Świat) */
export default function MobileNav({ navGroups, tab, setTab }) {
  const [openGroup, setOpenGroup] = useState(null);

  return (
    <>
      {openGroup && <div className="nav-drawer-overlay" onClick={() => setOpenGroup(null)}/>}
      {openGroup && (() => {
        const group = navGroups.find(g => g.id === openGroup);
        if (!group) return null;
        return (
          <div className="nav-drawer" onClick={e => e.stopPropagation()}>
            {group.tabs.map(t => (
              <button key={t.id} className={`nav-drawer-item${tab === t.id ? " active" : ""}`}
                onClick={() => { setTab(t.id); setOpenGroup(null); }}>
                <span className="nav-drawer-icon">{t.icon}</span>
                <span className="nav-drawer-label">{t.label}</span>
              </button>
            ))}
          </div>
        );
      })()}

      <nav className="hj-bottom-nav">
        {navGroups.map(g => {
          const isGroupActive     = g.tabs.some(t => t.id === tab);
          const activeTabInGroup  = g.tabs.find(t => t.id === tab);
          const isOpen            = openGroup === g.id;
          return (
            <button key={g.id}
              className={`hj-nav-btn${isGroupActive ? " group-active" : ""}${isOpen ? " active" : ""}`}
              onClick={() => {
                if (isOpen) setOpenGroup(null);
                else if (g.tabs.length === 1) { setTab(g.tabs[0].id); setOpenGroup(null); }
                else setOpenGroup(g.id);
              }}>
              <span className="hj-nav-icon">{activeTabInGroup ? activeTabInGroup.icon : g.icon}</span>
              <span className="hj-nav-label">{g.label}</span>
              {!activeTabInGroup && (
                <span className="hj-nav-sub">{g.tabs.map(t => t.icon).join(" ")}</span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
