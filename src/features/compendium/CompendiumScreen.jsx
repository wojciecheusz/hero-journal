import RacesTab     from './RacesTab';
import ClassesTab   from './ClassesTab';
import SpellsTab    from './SpellsTab';
import MonstersTab  from './MonstersTab';
import EquipmentTab from './EquipmentTab';

const TABS = [
  { id:"races",     label:"Rasy",       icon:"🧝", Component: RacesTab },
  { id:"classes",   label:"Klasy",      icon:"⚔️", Component: ClassesTab },
  { id:"spells",    label:"Czary",      icon:"✨", Component: SpellsTab },
  { id:"monsters",  label:"Potwory",    icon:"🐉", Component: MonstersTab },
  { id:"equipment", label:"Przedmioty", icon:"🎒", Component: EquipmentTab },
];

export default function CompendiumScreen({ activeTab = "spells" }) {
  const tab = TABS.find(t => t.id === activeTab) || TABS[0];
  const { Component } = tab;
  return (
    <div>
      {/* Nagłówek sekcji */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.2rem" }}>
        <span style={{ fontSize:"1.1rem" }}>{tab.icon}</span>
        <div className="sect-label" style={{ margin:0 }}>{tab.label}</div>
      </div>
      <p style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", color:"var(--text-dim)", letterSpacing:"0.1em", marginBottom:"0.9rem" }}>
        Dane: D&D 5e System Reference Document (SRD) · dnd5eapi.co
      </p>
      <Component/>
    </div>
  );
}
