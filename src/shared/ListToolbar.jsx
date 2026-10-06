import { useState } from 'react';
import Icon from './icons';
import { useT } from '../i18n/translations';

/* Wspólny pasek narzędzi list (P29/A4): jedno pole wyszukiwania, przycisk
   filtrów (panel domyślnie zwinięty) i „Dodaj". Aktywne filtry widać jako
   usuwalne chipy, więc nie trzeba otwierać panelu, żeby wiedzieć, co jest
   przefiltrowane. Ten sam układ w każdej z sześciu podzakładek.

   filterGroups: [{ key, label, value, onChange, isSort?, options: [{ value, label, icon, count }] }]
   (isSort — wybór sortowania: zawsze jakaś wartość, nie liczy się jako filtr)
   extraActions: dodatkowe przyciski (np. „Sloty czarów") */
export default function ListToolbar({
  search, onSearch, searchPlaceholder,
  filterGroups = [], summary,
  onAdd, addLabel, addActive = false,
  extraActions = null,
}) {
  const T = useT();
  const L = T.LIST;
  const [open, setOpen] = useState(false);

  const groups = filterGroups.filter(g => g.options.length > 0);
  const active = groups.flatMap(g => {
    if (g.value == null || g.isSort) return [];
    const opt = g.options.find(o => o.value === g.value);
    return opt ? [{ group: g, opt }] : [];
  });
  const clearAll = () => groups.filter(g => !g.isSort).forEach(g => g.onChange(null));

  return (
    <div className="list-toolbar">
      <div className="lt-row">
        <label className="lt-search">
          <Icon name="search" size="1.05em"/>
          <input type="search" value={search} onChange={e => onSearch(e.target.value)}
            placeholder={searchPlaceholder || T.UI.searchPlaceholder} aria-label={L.search}
            enterKeyHint="search"/>
          {search && (
            <button className="lt-search-clear" onClick={() => onSearch("")} aria-label={L.clearSearch}>
              <Icon name="close" size="1em"/>
            </button>
          )}
        </label>
        {groups.length > 0 && (
          <button className={`hj-btn lt-filter-btn${open || active.length ? " on" : ""}`}
            aria-expanded={open} onClick={() => setOpen(o => !o)}>
            <Icon name="filters" size="1em"/>
            <span>{L.filters}</span>
            {active.length > 0 && <span className="lt-badge">{active.length}</span>}
            <Icon name={open ? "chevron-up" : "chevron-down"} size="1em"/>
          </button>
        )}
        {extraActions}
        {onAdd && (
          <button className={`hj-btn primary lt-add${addActive ? " on" : ""}`} onClick={onAdd} aria-expanded={addActive}>
            <Icon name={addActive ? "close" : "plus"} size="1em"/>
            <span>{addActive ? T.HERO.cancel : (addLabel || L.add)}</span>
          </button>
        )}
      </div>

      {open && groups.length > 0 && (
        <div className="lt-panel">
          {groups.map(g => (
            <div key={g.key} className="lt-group">
              <span className="lt-group-label">{g.label}</span>
              <div className="lt-options">
                {!g.isSort && (
                  <button className={`lt-chip${g.value == null ? " on" : ""}`} aria-pressed={g.value == null}
                    onClick={() => g.onChange(null)}>{L.all}</button>
                )}
                {g.options.map(o => (
                  <button key={String(o.value)} className={`lt-chip${g.value === o.value ? " on" : ""}`}
                    aria-pressed={g.value === o.value}
                    onClick={() => g.onChange(g.isSort ? o.value : (g.value === o.value ? null : o.value))}>
                    {o.icon && <Icon name={o.icon} size="1em"/>}
                    <span>{o.label}</span>
                    {o.count != null && <span className="lt-chip-count">{o.count}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {(active.length > 0 || summary) && (
        <div className="lt-status">
          {summary && <span className="lt-summary">{summary}</span>}
          {active.map(({ group, opt }) => (
            <button key={group.key} className="lt-chip on removable" onClick={() => group.onChange(null)}
              aria-label={`${L.removeFilter}: ${opt.label}`}>
              <span className="lt-chip-group">{group.label}:</span> <span>{opt.label}</span>
              <Icon name="close" size="0.95em"/>
            </button>
          ))}
          {active.length > 1 && <button className="lt-clear" onClick={clearAll}>{L.clearAll}</button>}
        </div>
      )}
    </div>
  );
}
