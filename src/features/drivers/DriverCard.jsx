import { Flag } from '../../components/ui/Flag';
import { formatNumber } from '../../utils/format';
import { DriverAvatar } from './DriverAvatar';
import styles from './DriverCard.module.css';

export function DriverCard({ driver, onSelect }) {
  const stats = [
    { label: 'pontos', value: driver.points },
    { label: 'vitórias', value: driver.wins },
    { label: 'pódios', value: driver.podiums },
  ];
  const pisitionLabel = driver.position ? `${driver.position}º no campeonato` : 'posição não definida';

  return (
    <button
      type="button"
      className={styles.card}
      style={{ '--team': driver.color }}
      onClick={() => onSelect(driver.id)}
      aria-label={`Abrir carta de ${driver.name}`}
    >
      <span className={styles.number} aria-hidden="true">{driver.number}</span>
      <span className={styles.top}>
        <DriverAvatar driver={driver} size={56} />
        <span className={styles.identity}>
          <span className={styles.position}>{pisitionLabel}</span>
          <span className={styles.name}><Flag iso={driver.nationalityIso} />{driver.name}</span>
          <span className={styles.team}>{driver.team.name}</span>
        </span>
      </span>
      <span className={styles.stats}>
        {stats.map((stat) => (
          <span key={stat.label} className={styles.stat}>
            <span className={styles.statValue}>{formatNumber(stat.value)}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </span>
        ))}
      </span>
    </button>
  );
}
