import { useLayoutEffect, useRef } from 'react';

/* Tekst w jednej linii, który zmniejsza czcionkę, aż się zmieści (P29/D5).
   Rozmiary w rem, więc wynik skaluje się z bazową czcionką (mobile → 4K).
   Poniżej `min` zostaje wielokropek, a pełna nazwa jest w podpowiedzi. */
export default function FitText({ text, className = '', max = 1.2, min = 0.7, as: Tag = 'span' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let size = max;
      el.style.fontSize = `${size}rem`;
      while (el.scrollWidth > el.clientWidth + 1 && size > min) {
        size = Math.max(min, +(size - 0.04).toFixed(2));
        el.style.fontSize = `${size}rem`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready?.then(fit);
    return () => ro.disconnect();
  }, [text, max, min]);

  return (
    <Tag ref={ref} className={`fit-text ${className}`} title={text}>{text}</Tag>
  );
}
