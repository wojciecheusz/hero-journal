import { useT } from '../i18n/translations';
import Icon, { ICONS } from '../shared/icons';
import { Drawer } from '../shared/Overlay';

/* Mapuje aktywny tab na klucz w T.HELP */
function helpKey(tab) {
  if (tab === "character")                                       return "character";
  if (tab === "equipment" || ["inventory","spells","skills"].includes(tab)) return "equipment";
  if (tab === "world-all"  || ["npcs","locations","factions"].includes(tab)) return "world";
  if (tab === "sessions")                                        return "sessions";
  if (tab === "quests")                                          return "quests";
  return "character";
}

/* Pomoc kontekstowa — szuflada z prawej na każdej szerokości ekranu (P29/D7).
   Wcześniej na desktopie pomoc wciskała się między nawigację a stopkę
   sidebara i nie dało się jej przewinąć. */
export default function HelpPanel({ tab, onClose }) {
  const T       = useT();
  const content = T.HELP[helpKey(tab)];
  if (!content) return null;

  return (
    <Drawer title={content.title} icon="help-circle" onClose={onClose} closeLabel={T.UI.close}>
      {content.intro && <p className="help-intro">{content.intro}</p>}
      {content.items.map(([icon, label, desc]) => {
        const iconKeys = Array.isArray(icon) ? icon : (ICONS[icon] ? [icon] : null);
        return (
          <div key={label} className="help-item">
            <span className="help-badge">
              {iconKeys
                ? iconKeys.map((ic, i) => (
                    <span key={ic} style={{ display:"inline-flex", alignItems:"center", gap:"0.2rem" }}>
                      {i > 0 && <span style={{ opacity:0.5 }}>/</span>}
                      <Icon name={ic} size="1.1em"/>
                    </span>
                  ))
                : icon}
            </span>
            <div>
              <div className="help-label">{label}</div>
              {desc && <div className="help-desc">{desc}</div>}
            </div>
          </div>
        );
      })}
    </Drawer>
  );
}
