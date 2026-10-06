import Icon from '../../shared/icons';
import { Modal } from '../../shared/Overlay';
import { clamp } from '../../utils/math';

/* Szczegóły bohatera (dawny panel „More", P29/D6): klasy z poziomami
   (multiclassing), rasa, przeszłość, charakter i wygląd — w czytelnym oknie
   z dużymi polami, zamiast prowizorycznej listy wciśniętej w sidebar. */
export default function HeroDetailsModal({ T, char, setChar, onClose }) {
  const C = T.CHAR;
  const classes = char.classes?.length ? char.classes : [{ name: "", level: 1 }];

  const setClass = (i, patch) => setChar(c => {
    const cl = c.classes?.length ? [...c.classes] : [{ name: "", level: 1 }];
    cl[i] = { ...cl[i], ...patch };
    return { ...c, classes: cl };
  });
  const stepLevel = (i, d) => setClass(i, { level: clamp((parseInt(classes[i].level) || 1) + d, 1, 20) });
  const removeClass = i => setChar(c => ({ ...c, classes: (c.classes || []).filter((_, j) => j !== i) }));
  const addClass = () => setChar(c => ({ ...c, classes: [...(c.classes?.length ? c.classes : [{ name: "", level: 1 }]), { name: "", level: 1 }] }));
  const setAppearance = (key, val) => setChar(c => ({ ...c, appearance: { ...(c.appearance || {}), [key]: val } }));

  const basics = [
    ["race",       C.race,       C.racePh],
    ["background", C.background, C.backgroundPh],
    ["alignment",  C.alignment,  C.alignmentPh],
  ];
  const looks = [
    ["age", C.age, C.agePh], ["height", C.height, C.heightPh], ["weight", C.weight, C.weightPh],
    ["eyes", C.eyes, C.eyesPh], ["skin", C.skin, C.skinPh], ["hair", C.hair, C.hairPh],
  ];

  return (
    <Modal title={T.HERO.detailsTitle} onClose={onClose} closeLabel={T.UI.close} wide
      footer={<button className="hj-btn primary" onClick={onClose}>{T.UI.close}</button>}>

      <div className="form-section">
        <div className="form-heading">{C.classLabel}</div>
        {classes.map((cls, i) => (
          <div key={i} className="class-edit-row">
            <input className="g-input" value={cls.name || ""} aria-label={C.classLabel}
              placeholder={i === 0 ? C.classPh : `${C.classPh} (${i + 1})`}
              onChange={e => setClass(i, { name: e.target.value })}/>
            <div className="stepper" role="group" aria-label={T.HERO.levelLabel}>
              <button className="stepper-btn" onClick={() => stepLevel(i, -1)} aria-label="−1" disabled={(cls.level || 1) <= 1}>
                <Icon name="minus" size="1em"/>
              </button>
              <span className="stepper-value"><small>{T.HERO.levelLabel}</small>{cls.level || 1}</span>
              <button className="stepper-btn" onClick={() => stepLevel(i, 1)} aria-label="+1" disabled={(cls.level || 1) >= 20}>
                <Icon name="plus" size="1em"/>
              </button>
            </div>
            {i > 0 && (
              <button className="hj-icon-btn" onClick={() => removeClass(i)} aria-label={T.HERO.removeClass}>
                <Icon name="close" size="1em"/>
              </button>
            )}
          </div>
        ))}
        {classes.length < 4 && (
          <button className="hj-btn" onClick={addClass}><Icon name="plus" size="1em"/> {C.addClass}</button>
        )}
      </div>

      <div className="form-section">
        <div className="form-grid">
          {basics.map(([key, label, ph]) => (
            <label key={key} className="form-field">
              <span className="form-label">{label}</span>
              <input className="g-input" value={char[key] || ""} placeholder={ph || ""}
                onChange={e => setChar(c => ({ ...c, [key]: e.target.value }))}/>
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="form-heading">{C.appearance}</div>
        <div className="form-grid">
          {looks.map(([key, label, ph]) => (
            <label key={key} className="form-field">
              <span className="form-label">{label}</span>
              <input className="g-input" value={(char.appearance || {})[key] || ""} placeholder={ph || ""}
                onChange={e => setAppearance(key, e.target.value)}/>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}
