
import { statMod } from "../../utils/math";

export default function StatsGrid({ stats }) {
  return (
    <div className="stat-grid">
      {Object.entries(stats).map(([key, value]) => (
        <div className="stat-box" key={key}>
          <div className="stat-name">{key}</div>

          <div className="stat-value">
            {value}
          </div>

          <div className="stat-mod">
            {statMod(value)}
          </div>
        </div>
      ))}
    </div>
  );
}
