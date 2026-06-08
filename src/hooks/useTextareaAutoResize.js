import { useEffect } from 'react';

const resize = ta => { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`; };

/**
 * Auto-rozszerzanie pól <textarea> w miarę wpisywania tekstu oraz po zmianie
 * zakładki/profilu (kiedy treść pól jest wczytywana programowo, bez eventu 'input').
 */
export function useTextareaAutoResize(tab, activeId) {
  useEffect(() => {
    const onInput = e => { if (e.target.tagName === 'TEXTAREA') resize(e.target); };
    document.addEventListener('input', onInput, true);
    return () => document.removeEventListener('input', onInput, true);
  }, []);

  useEffect(() => {
    const runAll = () => document.querySelectorAll('textarea').forEach(resize);
    const rafId = requestAnimationFrame(runAll);
    /* Fallback dla lazy-loaded chunków — czekamy aż komponent się zamontuje */
    const tid = setTimeout(runAll, 250);
    return () => { cancelAnimationFrame(rafId); clearTimeout(tid); };
  }, [tab, activeId]);
}
