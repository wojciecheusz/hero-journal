import { useState } from 'react';
import Icon from './icons';
import { Modal } from './Overlay';
import { useT } from '../i18n/translations';
import { restoreFlattened } from '../utils/markdown';

/* Okno dodawania / edycji wpisu (P29/B1, B3). Pracuje na kopii roboczej:
   „Zapisz" zatwierdza, „Anuluj"/Escape porzuca zmiany. Usuwanie wymaga
   drugiego potwierdzenia. Formularz (children) dostaje draft i set(). */
export default function EntityEditModal({ kind, initial, isNew, onSave, onDelete, onClose, textFields = [], children }) {
  const T = useT();
  const L = T.LIST;
  /* Importowane notatki bez znaków nowej linii — w edytorze pokazujemy je
     z przywróconymi podziałami, żeby dało się je wygodnie poprawiać. */
  const [draft, setDraft] = useState(() => {
    const d = { ...initial };
    textFields.forEach(k => { if (d[k]) d[k] = restoreFlattened(d[k]); });
    return d;
  });
  const [confirmDel, setConfirmDel] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, value) => setDraft(d => ({ ...d, [key]: value }));
  const save = () => {
    if (!String(draft.name || "").trim()) { setError(L.nameRequired); return; }
    onSave({ ...draft, name: draft.name.trim() });
    onClose();
  };

  return (
    <Modal wide title={isNew ? L.newTitle[kind] : L.editTitle[kind]} onClose={onClose} closeLabel={T.UI.close}
      footer={<>
        {!isNew && onDelete && (
          <button className={`hj-btn danger edit-delete${confirmDel ? " confirm" : ""}`}
            onClick={() => { if (confirmDel) { onDelete(); onClose(); } else setConfirmDel(true); }}>
            <Icon name="warning" size="1em"/> {confirmDel ? L.deleteConfirm : L.delete}
          </button>
        )}
        <span className="foot-spacer"/>
        <button className="hj-btn" onClick={onClose}>{L.cancel}</button>
        <button className="hj-btn primary" onClick={save}><Icon name="check" size="1em"/> {L.save}</button>
      </>}>
      <label className="form-field" style={{ marginTop: 0 }}>
        <span className="form-label">{L.name}</span>
        <input className="g-input edit-name" value={draft.name || ""} autoFocus={isNew}
          onChange={e => { set("name", e.target.value); setError(null); }}
          onKeyDown={e => { if (e.key === "Enter") save(); }}/>
      </label>
      {error && <p className="form-hint warn" role="alert">{error}</p>}
      {children(draft, set)}
    </Modal>
  );
}

/* Wybór jednej opcji z listy przycisków (typ, kategoria, relacja…) */
export function ChoiceChips({ options, value, onChange, label }) {
  return (
    <div className="form-field">
      {label && <span className="form-label">{label}</span>}
      <div className="lt-options">
        {options.map(o => (
          <button key={o.value} type="button" className={`lt-chip${value === o.value ? " on" : ""}`}
            aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
            {o.icon && <Icon name={o.icon} size="1em"/>} <span>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Pole długiego tekstu z podpowiedzią o formatowaniu */
export function RichTextArea({ label, value, onChange, placeholder, rows = 6 }) {
  const T = useT();
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      <textarea className="g-textarea" rows={rows} value={value || ""} placeholder={placeholder} onChange={e => onChange(e.target.value)}/>
      <span className="form-hint small">{T.LIST.markdownHint}</span>
    </label>
  );
}
