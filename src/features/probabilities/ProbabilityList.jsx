import { HoverCard } from '../../components/ui/HoverCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useHoverCard } from '../../hooks/useHoverCard';
import { formatPercent } from '../../utils/format';
import { DriverHoverCard } from '../drivers/DriverHoverCard';
import styles from './ProbabilityList.module.css';

/** Lista os pilotos com chance > 0 em uma métrica da simulação, do maior para o menor. */
export function ProbabilityList({ title, drivers, odds, metric, limit }) {
  const { containerRef, card, bind } = useHoverCard();

  const ranked = drivers
    .map((driver) => ({ driver, chance: odds.get(driver.code)?.[metric] ?? 0 }))
    .filter(({ chance }) => chance > 0)
    .sort((a, b) => b.chance - a.chance)
    .slice(0, limit);

  return (
    <div className={styles.block}>
      <h3 className={styles.title}>{title}</h3>
      <div ref={containerRef} className={styles.list}>
        {ranked.length === 0 && <p className={styles.empty}>Nenhum piloto com chance relevante.</p>}
        {ranked.map(({ driver, chance }) => (
          <div
            key={driver.id}
            className={styles.row}
            {...bind(() => <DriverHoverCard driver={driver} odds={odds.get(driver.code)} />)}
          >
            <span className={styles.name}><b>{driver.code}</b>{driver.name.split(' ').at(-1)}</span>
            <ProgressBar value={chance} max={100} color={driver.color} size="lg" />
            <span className={`${styles.value} tabular`}>{formatPercent(chance)}</span>
          </div>
        ))}
        <HoverCard card={card} containerRef={containerRef} />
      </div>
    </div>
  );
}
