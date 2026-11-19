import { RaceCard } from './RaceCard';
import styles from './RaceCalendar.module.css';

export function RaceCalendar({ races, selectedRound, onSelect }) {
  return (
    <div className={styles.grid}>
      {races.map((race) => (
        <RaceCard key={race.round} race={race} isSelected={race.round === selectedRound} onSelect={onSelect} />
      ))}
    </div>
  );
}
