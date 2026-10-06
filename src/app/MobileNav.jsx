import Icon from '../shared/icons';
import { isEquipmentTab, isWorldTab } from './navigation';

/* Dolne menu na telefonie / tablecie w pionie (P29): te same pozycje co
   sidebar — Postać, Wyposażenie, Świat, Kronika, Zadania. Bez wysuwanej
   szuflady: podzakładki Wyposażenia i Świata są na górze ekranu. */
export default function MobileNav({ navGroups, tab, setTab }) {
  const items = navGroups.flatMap(g => g.tabs.length > 1
    ? g.tabs
    : [{ ...g.tabs[0], label: g.label, icon: g.icon }]);
  const isActive = id =>
    tab === id
    || (id === "equipment" && isEquipmentTab(tab))
    || (id === "world-all" && isWorldTab(tab));

  return (
    <nav className="hj-bottom-nav">
      {items.map(t => {
        const active = isActive(t.id);
        return (
          <button key={t.id} className={`hj-nav-btn${active ? " active group-active" : ""}`}
            aria-current={active ? "page" : undefined} onClick={() => setTab(t.id)}>
            <span className="hj-nav-icon"><Icon name={t.icon}/></span>
            <span className="hj-nav-label">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
