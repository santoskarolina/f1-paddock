import { CURRENT_SEASON, FIRST_SEASON } from '../../config/constants';
import styles from './SeasonPicker.module.css';

const SEASONS = Array.from({ length: CURRENT_SEASON - FIRST_SEASON + 1 }, (_, i) => CURRENT_SEASON - i);

/** Lista de temporadas, da atual até 1950. */
export function SeasonPicker({ season, onChange, disabled = false }) {
  return (
    <label className={styles.picker}>
      <span className={styles.label}>Temporada</span>
      <select value={season} onChange={(e) => onChange(Number(e.target.value))} disabled={disabled}>
        {SEASONS.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </label>
  );
}
