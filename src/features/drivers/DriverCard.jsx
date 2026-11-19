import { Flag } from '../../components/ui/Flag';
import { formatNumber } from '../../utils/format';
import { DriverAvatar } from './DriverAvatar';
import styles from './DriverCard.module.css';

export function DriverCard({ driver }) {
  const stats = [
    { label: 'pontos', value: driver.points },
    { label: 'vitórias', value: driver.wins },
    { label: 'pódios', value: driver.podiums },
  ];

  return (
    <article className={styles.card} style={{ '--team': driver.color }}>
      <span className={styles.number} aria-hidden="true">{driver.number}</span>
      <div className={styles.top}>
        <DriverAvatar driver={driver} size={56} />
        <div>
          <p className={styles.position}>{driver.position}º no campeonato</p>
          <h3 className={styles.name}><Flag iso={driver.nationalityIso} />{driver.name}</h3>
          <p className={styles.team}>{driver.team.name}</p>
        </div>
      </div>
      <dl className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd className="tabular">{formatNumber(stat.value)}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
