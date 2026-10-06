import Icon from './icons';
import { useT } from '../i18n/translations';

/* Karta wpisu listy (P29/B1–B4) — wspólna dla Przedmiotów, Zdolności,
   Czarów, Postaci, Lokacji i Frakcji.
   - Tytuł to tekst (nie pole edycji), więc zawija się zamiast ucinać.
   - Cały nagłówek rozwija kartę (duży cel pod palec); przypinanie i
     przełącznik stanu mają własne przyciski.
   - Zwinięta: najważniejsze informacje w wierszu meta + 2 linie podglądu.
   - Rozwinięta: pełna treść (children) na całą szerokość siatki + „Edytuj".
   Edycja odbywa się w oknie, nie w karcie (koniec z edytorem tagów
   i polami formularza w każdej karcie). */
export default function EntityCard({
  id, icon, iconTone, title, meta, quick, preview, open, onToggle,
  pinned, onPin, onEdit, accent, children,
}) {
  const T = useT();
  const L = T.LIST;
  return (
    <article id={id != null ? `entity-${id}` : undefined}
      className={`ecard${open ? " is-open" : ""}${pinned ? " pinned" : ""}${accent ? ` accent-${accent}` : ""}`}>
      <div className="ecard-head">
        <button className="ecard-toggle" onClick={onToggle} aria-expanded={!!open}
          aria-label={`${open ? L.collapse : L.expand}: ${title}`}>
          <span className={`icon-badge${iconTone ? ` tone-${iconTone}` : ""}`}><Icon name={icon || "diamond"}/></span>
          <span className="ecard-title">{title}</span>
        </button>
        <div className="ecard-actions">
          {onPin && (
            <button className={`ecard-act pin${pinned ? " on" : ""}`} onClick={onPin}
              aria-pressed={!!pinned} aria-label={pinned ? L.unpin : L.pin} title={pinned ? L.unpin : L.pin}>
              <Icon name="pin" fill={pinned ? "currentColor" : "none"}/>
            </button>
          )}
          <button className="ecard-act" onClick={onToggle} aria-label={open ? L.collapse : L.expand} tabIndex={-1}>
            <Icon name={open ? "chevron-up" : "chevron-down"}/>
          </button>
        </div>
      </div>

      {(meta || quick) && (
        <div className="ecard-meta">
          {meta}
          {quick && <span className="ecard-quick">{quick}</span>}
        </div>
      )}

      {!open && preview && <p className="ecard-preview">{preview}</p>}

      {open && (
        <div className="ecard-body">
          {children}
          {onEdit && (
            <div className="ecard-foot">
              <button className="hj-btn" onClick={onEdit}><Icon name="edit" size="1em"/> {L.edit}</button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* Siatka „etykieta: wartość" w rozwiniętej karcie — tylko niepuste pola. */
export function FieldGrid({ fields }) {
  const shown = fields.filter(([, v]) => v != null && String(v).trim() !== "");
  if (!shown.length) return null;
  return (
    <dl className="field-grid">
      {shown.map(([label, value]) => (
        <div key={label} className="field-cell">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Tagi tylko do odczytu (edycja w oknie) */
export function TagList({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="tag-list">
      {tags.map(t => <span key={t} className="tag tag-default">{t}</span>)}
    </div>
  );
}
