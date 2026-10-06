import { Fragment, useMemo } from 'react';
import { parseMarkdown } from '../utils/markdown';

/* Bezpieczne wyświetlanie opisu z markdownem (P29/C3) — elementy React,
   bez dangerouslySetInnerHTML. Szerokość linii ograniczona w CSS (.rich). */
function Inline({ parts }) {
  return parts.map((p, i) => {
    let node = p.t;
    if (p.i) node = <em key={`i${i}`}>{node}</em>;
    if (p.b) node = <strong key={`b${i}`}>{node}</strong>;
    return <Fragment key={i}>{node}</Fragment>;
  });
}

export default function RichText({ text, className = '' }) {
  const blocks = useMemo(() => parseMarkdown(text), [text]);
  if (!blocks.length) return null;
  return (
    <div className={`rich ${className}`}>
      {blocks.map((b, i) => {
        if (b.type === "hr") return <hr key={i}/>;
        if (b.type === "h") {
          const Tag = b.level <= 2 ? "h4" : "h5";
          return <Tag key={i}><Inline parts={b.content}/></Tag>;
        }
        if (b.type === "list") {
          const Tag = b.ordered ? "ol" : "ul";
          return <Tag key={i}>{b.items.map((it, j) => <li key={j}><Inline parts={it}/></li>)}</Tag>;
        }
        const Tag = b.type === "quote" ? "blockquote" : "p";
        return (
          <Tag key={i}>
            {b.lines.map((l, j) => <Fragment key={j}>{j > 0 && <br/>}<Inline parts={l}/></Fragment>)}
          </Tag>
        );
      })}
    </div>
  );
}
