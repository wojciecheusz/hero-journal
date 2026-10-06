import Icon from '../shared/icons';

/* Pasek podzakładek na górze obszaru roboczego (P29/A1–A3) — Wyposażenie
   (Przedmioty / Zdolności / Czary) i Świat (Postacie / Lokacje / Frakcje).
   Jedna podzakładka zajmuje cały obszar; liczniki pomagają się zorientować. */
export default function SubTabBar({ tabs, active, onSelect, label }) {
  return (
    <nav className="subtabs" aria-label={label}>
      <div className="subtabs-inner" role="tablist">
        {tabs.map(t => {
          const on = t.id === active;
          return (
            <button key={t.id} role="tab" aria-selected={on}
              className={`subtab${on ? " active" : ""}`} onClick={() => onSelect(t.id)}>
              <Icon name={t.icon} size="1.1em"/>
              <span className="subtab-label">{t.label}</span>
              {t.count != null && <span className="subtab-count">{t.count}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
