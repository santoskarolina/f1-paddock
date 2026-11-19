import { formatNumber } from '../../utils/format';
import styles from './SeasonTiles.module.css';

export function SeasonTiles({ summary }) {
  const tiles = [
    { label: 'corridas disputadas', value: summary.completedRaces },
    { label: 'pilotos diferentes venceram', value: summary.distinctWinners },
    summary.topTeam && { label: `vitórias da ${summary.topTeam.name}`, value: summary.topTeam.wins },
    { label: 'corridas restantes', value: summary.remainingRaces },
  ].filter(Boolean);

  return (
    <dl className={styles.tiles} aria-label="Números da temporada">
      {tiles.map((tile) => (
        <div key={tile.label} className={styles.tile}>
          <dt>{tile.label}</dt>
          <dd className="tabular">{formatNumber(tile.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
