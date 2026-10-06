import Icon from './icons';
import { useT } from '../i18n/translations';
import { hasCharges, chargesLeft, isConsumable, qtyOf, consumeOnce, setChargesUsed } from '../utils/items';

/* Licznik użyć przedmiotu (P29/C2) — w karcie „Walka i wyposażenie"
   i w liście przedmiotów. Ładunki jako kropki (stuknięcie = zużycie /
   odzyskanie), przy dużej liczbie zwykły licznik; przedmiot jednorazowy
   pokazuje liczbę sztuk. Zawsze z dużym przyciskiem „Użyj". */
export default function ItemUses({ item, onChange, compact = false }) {
  const T = useT();
  const U = T.USES;
  const charged = hasCharges(item);
  const single  = !charged && isConsumable(item);
  if (!charged && !single) return null;

  const max  = charged ? parseInt(item.uses.max) || 0 : 0;
  const left = charged ? chargesLeft(item) : qtyOf(item);
  const recharge = charged ? U.rechargeShort[item.uses.recharge || "none"] : "";
  const tapPip = i => onChange(setChargesUsed(item, i < left ? max - i : max - (i + 1)));

  return (
    <div className={`item-uses${compact ? " compact" : ""}${left === 0 ? " empty" : ""}`}>
      {charged && max <= 10 ? (
        <div className="uses-pips" role="group" aria-label={U.charges(left, max)}>
          {Array.from({ length: max }, (_, i) => (
            <button key={i} className={`uses-pip${i < left ? " on" : ""}`} aria-pressed={i < left}
              aria-label={U.pip(i + 1)} onClick={() => tapPip(i)}/>
          ))}
        </div>
      ) : null}
      <span className="uses-text">
        {charged ? U.charges(left, max) : U.left(left)}
        {recharge && <span className="uses-recharge"> · {recharge}</span>}
      </span>
      <button className="hj-btn uses-btn" disabled={left <= 0} onClick={() => onChange(consumeOnce(item))}>
        <Icon name="minus" size="1em"/> {U.useOne}
      </button>
    </div>
  );
}
