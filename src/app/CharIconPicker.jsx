import { useState } from 'react';
import Icon from '../shared/icons';
import { Modal } from '../shared/Overlay';
import { useT } from '../i18n/translations';
import { ICON_CHOICES } from './charIcons';

/* ── Wybór ikony bohatera — duże pola pod palec w oknie modalnym (P29) ── */
export default function CharIconPicker({ value, onChange, className = '' }) {
  const T = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={`hero-icon-btn ${className}`} onClick={() => setOpen(true)}
        aria-label={T.HERO.changeIcon} title={T.HERO.changeIcon}>
        <Icon name={value} size="1.15em"/>
      </button>
      {open && (
        <Modal title={T.HERO.changeIcon} onClose={() => setOpen(false)} closeLabel={T.UI.close}>
          <div className="icon-choice-grid">
            {ICON_CHOICES.map(icon => (
              <button key={icon} className={`icon-choice${icon === value ? " active" : ""}`}
                aria-pressed={icon === value} aria-label={icon}
                onClick={() => { onChange(icon); setOpen(false); }}>
                <Icon name={icon} size="1.3em"/>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
