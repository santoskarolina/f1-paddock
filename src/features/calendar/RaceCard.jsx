import { Flag } from '../../components/ui/Flag';
import { formatDay } from '../../utils/format';
import { CircuitTrack } from '../circuits/CircuitTrack';
import styles from './RaceCard.module.css';

const STATUS_TEXT = { next: 'Próxima corrida', upcoming: 'A disputar' };

function RaceOutcome({ race }) {
  const [winner, second, third] = race.podium;
  if (race.status !== 'done') {
    return <span className={race.status === 'next' ? styles.badge : styles.meta}>{STATUS_TEXT[race.status]}</span>;
  }
  return (
    <span className={styles.podium}>
      {winner && <span className={styles.winner}>🏆 {winner.name}</span>}
      {second && <span>2º {second.code}</span>}
      {third && <span>3º {third.code}</span>}
    </span>
  );
}

export function RaceCard({ race, isSelected, onSelect }) {
  const accent = race.podium[0]?.color ?? (race.status === 'next' ? 'var(--accent)' : 'var(--muted)');

  return (
    <button
      type="button"
      className={`${styles.card} ${styles[race.status]}`}
      style={{ '--team': accent }}
      aria-pressed={isSelected}
      aria-label={`Ver detalhes: ${race.name}`}
      onClick={() => onSelect(race.round)}
    >
      <span className={`${styles.round} tabular`}>{race.round}</span>
      <span className={styles.body}>
        <span className={styles.name}><Flag iso={race.countryIso} />{race.name}</span>
        <span className={styles.meta}>{race.circuit}, {formatDay(race.startsAt)}{race.hasSprint && ' · sprint'}</span>
        <RaceOutcome race={race} />
      </span>
      <span className={styles.thumb} aria-hidden="true">
        {race.layout && <CircuitTrack layout={race.layout} color={accent} width={84} height={60} variant="thumb" />}
      </span>
    </button>
  );
}
