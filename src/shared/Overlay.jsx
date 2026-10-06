import { useId } from 'react';
import { useEscape } from '../hooks/useEscape';
import { createPortal } from 'react-dom';
import Icon from './icons';

/* Wspólne nakładki (P29): szuflada boczna i popover renderowane przez portal
   bezpośrednio w <body>. Dzięki temu nie przycina ich overflow sidebara ani
   kontekst warstw (z-index) głównego obszaru — wcześniej panel ustawień był
   zasłaniany przez treść, a pomoc lądowała pod nawigacją bez możliwości
   przewinięcia. Escape i dotknięcie tła zamykają nakładkę. */

export function Portal({ children }) {
  return createPortal(children, document.body);
}

/* Szuflada wysuwana z prawej — pełna wysokość, własne przewijanie treści. */
export function Drawer({ title, icon, onClose, closeLabel, children }) {
  const titleId = useId();
  useEscape(onClose);
  return (
    <Portal>
      <div className="hj-overlay-backdrop" onClick={onClose}/>
      <aside className="hj-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="hj-drawer-head">
          <h2 id={titleId} className="hj-drawer-title">
            {icon && <Icon name={icon} size="1em"/>}
            <span>{title}</span>
          </h2>
          <button className="hj-icon-btn" onClick={onClose} aria-label={closeLabel} title={closeLabel}>
            <Icon name="close" size="1.1em"/>
          </button>
        </header>
        <div className="hj-drawer-body">{children}</div>
      </aside>
    </Portal>
  );
}

/* Popover — pozycja z klasy CSS (placement), np. nad stopką sidebara na
   desktopie albo pod nagłówkiem na mobile. */
export function Popover({ onClose, className = '', label, children }) {
  useEscape(onClose);
  return (
    <Portal>
      <div className="hj-overlay-backdrop hj-overlay-backdrop-clear" onClick={onClose}/>
      <div className={`hj-popover ${className}`} role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </div>
    </Portal>
  );
}

/* Okno modalne wyśrodkowane — na telefonie wysuwa się od dołu jak arkusz. */
export function Modal({ title, onClose, closeLabel, children, footer, wide = false }) {
  const titleId = useId();
  useEscape(onClose);
  return (
    <Portal>
      <div className="hj-overlay-backdrop" onClick={onClose}/>
      <div className={`hj-modal${wide ? ' hj-modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="hj-drawer-head">
          <h2 id={titleId} className="hj-drawer-title"><span>{title}</span></h2>
          <button className="hj-icon-btn" onClick={onClose} aria-label={closeLabel} title={closeLabel}>
            <Icon name="close" size="1.1em"/>
          </button>
        </header>
        <div className="hj-modal-body">{children}</div>
        {footer && <footer className="hj-modal-foot">{footer}</footer>}
      </div>
    </Portal>
  );
}
