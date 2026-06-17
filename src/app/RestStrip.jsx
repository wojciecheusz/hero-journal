import Icon from '../shared/icons';

/* Stały pasek odpoczynku — widoczny tylko na mobile, między nagłówkiem a treścią */
export default function RestStrip({ C, onRestModal }) {
  return (
    <div className="rest-strip-mobile">
      <button className="btn-rest short" aria-label="Short rest" onClick={() => onRestModal("short")}>
        <Icon name="moon" size="1.1em"/>
        <span>{C.shortRest}</span>
      </button>
      <button className="btn-rest long" aria-label="Long rest" onClick={() => onRestModal("long")}>
        <Icon name="sun" size="1.1em"/>
        <span>{C.longRest}</span>
      </button>
    </div>
  );
}
