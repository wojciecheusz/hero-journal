import { useEffect } from 'react';

/* Zamyka nakładkę klawiszem Escape (szuflady, popovery, okna modalne). */
export function useEscape(onClose, active = true) {
  useEffect(() => {
    if (!active) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, active]);
}
