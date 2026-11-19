import { HoverCard } from '../../components/ui/HoverCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Section } from '../../components/ui/Section';
import { buildTeammateDuels } from '../../domain/seasonStats';
import { useHoverCard } from '../../hooks/useHoverCard';
import { formatNumber } from '../../utils/format';
import { DriverHoverCard } from '../drivers/DriverHoverCard';
import styles from './TeammateDuels.module.css';

export function TeammateDuels({ drivers, teams, odds }) {
  const { containerRef, card, show, hide } = useHoverCard();
  const duels = buildTeammateDuels(drivers, teams);

  return (
    <Section id="duelos" title="Duelo entre companheiros" description="Os dois pilotos com mais pontos de cada equipe.">
      <div ref={containerRef} className={styles.grid}>
        {duels.map(({ team, drivers: pair }) => {
          const max = Math.max(1, ...pair.map((d) => d.points));
          return (
            <div key={team.id} className={styles.duel} style={{ '--team': team.color }}>
              <h3 className={styles.team}>{team.name}</h3>
              {pair.map((driver) => (
                <div
                  key={driver.id}
                  className={styles.row}
                  onPointerMove={(e) => show(e, <DriverHoverCard driver={driver} odds={odds.get(driver.code)} />)}
                  onPointerLeave={hide}
                >
                  <b>{driver.code}</b>
                  <ProgressBar value={driver.points} max={max} color={team.color} size="sm" />
                  <span className="tabular">{formatNumber(driver.points)}</span>
                </div>
              ))}
            </div>
          );
        })}
        <HoverCard card={card} containerRef={containerRef} />
      </div>
    </Section>
  );
}
