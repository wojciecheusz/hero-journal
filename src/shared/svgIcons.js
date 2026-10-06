/* Ikony z plików SVG (P30) — folder src/assets/icons/game-icons/.
   Nazwa pliku = nazwa ikony w aplikacji (np. backpack.svg → <Icon name="backpack"/>),
   więc podmiana ikony to podmiana pliku. Plik jest parsowany do prostych
   kształtów (path/circle/rect/ellipse/polygon/polyline/line) — bez wstawiania
   surowego HTML; kolor zawsze z currentColor, więc działa z każdym motywem. */

const files = import.meta.glob('../assets/icons/game-icons/*.svg', { query: '?raw', import: 'default', eager: true });

const SHAPES = ['path', 'circle', 'rect', 'ellipse', 'polygon', 'polyline', 'line'];
const GEOMETRY = ['d', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'points', 'transform', 'fill-rule', 'clip-rule', 'opacity', 'fill', 'stroke-width'];
const toReactProp = a => a.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

export function parseSvg(src) {
  const viewBox = (src.match(/viewBox="([^"]+)"/) || [])[1] || "0 0 512 512";
  const shapes = [];
  const re = new RegExp(`<(${SHAPES.join('|')})\\b([^>]*?)\\/?>`, 'g');
  let m;
  while ((m = re.exec(src))) {
    const props = {};
    const attrRe = /([a-zA-Z:-]+)="([^"]*)"/g;
    let a;
    while ((a = attrRe.exec(m[2]))) {
      if (GEOMETRY.includes(a[1])) props[toReactProp(a[1])] = a[2];
    }
    // Kolor zawsze z motywu; ścieżki „bez wypełnienia" rysujemy obrysem
    const outline = props.fill === "none";
    delete props.fill;
    shapes.push({ tag: m[1], props, outline });
  }
  return { viewBox, shapes };
}

export const SVG_ICONS = Object.fromEntries(
  Object.entries(files).map(([file, src]) => [file.split('/').pop().replace(/\.svg$/, ''), parseSvg(src)])
);
