import { Flag } from '../../components/ui/Flag';
import { formatNumber, formatPercent } from '../../utils/format';
import { DriverAvatar } from './DriverAvatar';
import styles from './DriverHoverCard.module.css';

/** Conteúdo do cartão exibido ao passar o mouse sobre um piloto. */
export function DriverHoverCard({ driver, odds }) {
  const stats = [
    { label: 'no campeonato', value: `${driver.position}º` },
    { label: 'pontos', value: formatNumber(driver.points) },
    { label: 'vitórias', value: formatNumber(driver.wins) },
    { label: 'pódios', value: formatNumber(driver.podiums) },
    ...(odds
      ? [
          { label: 'chance de vice', value: formatPercent(odds.runnerUp) },
          { label: 'vencer a próxima', value: formatPercent(odds.winNext) },
        ]
      : []),
  ];

  return (
    <article className={styles.card} style={{ '--team': driver.color }}>
      <header className={styles.header}>
        <DriverAvatar driver={driver} size={64} />
        <div className={styles.identity}>
          <span className={styles.number}>{driver.number}</span>
          <strong className={styles.name}><Flag iso={driver.nationalityIso} />{driver.name}</strong>
          <span className={styles.team}>{driver.team.name}</span>
        </div>
      </header>
      <dl className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd className="tabular">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
