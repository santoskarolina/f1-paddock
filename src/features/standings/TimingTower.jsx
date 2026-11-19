import { useMemo, useState } from 'react';
import { HoverCard } from '../../components/ui/HoverCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Section } from '../../components/ui/Section';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { gapToLeader } from '../../domain/seasonStats';
import { useHoverCard } from '../../hooks/useHoverCard';
import { formatGap, formatNumber } from '../../utils/format';
import { DriverHoverCard } from '../drivers/DriverHoverCard';
import styles from './TimingTower.module.css';

const SORT_OPTIONS = [
  { value: 'points', label: 'Pontos' },
  { value: 'wins', label: 'Vitórias' },
  { value: 'podiums', label: 'Pódios' },
];

function TowerRow({ driver, rank, metric, max, gap, onHover, onLeave }) {
  return (
    <li className={styles.row} onPointerMove={onHover} onPointerLeave={onLeave}>
      <span className={styles.rank}>{rank}</span>
      <span className={styles.tick} style={{ background: driver.color }} />
      <span className={styles.code}>{driver.code}</span>
      <ProgressBar value={driver[metric]} max={max} color={driver.color} />
      <span className={`${styles.value} tabular`}>{formatNumber(driver[metric])}</span>
      <span className={`${styles.gap} tabular`}>{formatGap(gap)}</span>
    </li>
  );
}

export function TimingTower({ drivers, odds }) {
  const [metric, setMetric] = useState('points');
  const { containerRef, card, show, hide } = useHoverCard();

  const sorted = useMemo(
    () => [...drivers].sort((a, b) => b[metric] - a[metric] || b.points - a.points),
    [drivers, metric],
  );
  const max = Math.max(1, ...drivers.map((d) => d[metric]));

  return (
    <Section
      id="classificacao"
      title="Classificação de pilotos"
      description="No estilo da torre de cronometragem; à direita, a diferença para o líder em pontos."
      aside={<SegmentedControl label="Ordenar por" options={SORT_OPTIONS} value={metric} onChange={setMetric} />}
    >
      <div ref={containerRef} className={styles.tower}>
        <ol className={styles.list}>
          {sorted.map((driver, index) => (
            <TowerRow
              key={driver.id}
              driver={driver}
              rank={metric === 'points' ? driver.position : index + 1}
              metric={metric}
              max={max}
              gap={gapToLeader(drivers, driver)}
              onHover={(e) => show(e, <DriverHoverCard driver={driver} odds={odds.get(driver.code)} />)}
              onLeave={hide}
            />
          ))}
        </ol>
        <HoverCard card={card} containerRef={containerRef} />
      </div>
    </Section>
  );
}
