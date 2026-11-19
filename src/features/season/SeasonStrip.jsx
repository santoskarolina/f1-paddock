import { Flag } from '../../components/ui/Flag';
import { HoverCard } from '../../components/ui/HoverCard';
import { Section } from '../../components/ui/Section';
import { useHoverCard } from '../../hooks/useHoverCard';
import { formatDay } from '../../utils/format';
import styles from './SeasonStrip.module.css';

const STATUS_LABEL = { next: 'Próxima corrida', upcoming: 'A disputar' };

function RaceTooltip({ race }) {
  const winner = race.podium[0];
  return (
    <div className={styles.tooltip}>
      <strong><Flag iso={race.countryIso} />{race.name}</strong>
      <span>{winner ? `Vencedor: ${winner.name}` : STATUS_LABEL[race.status]}</span>
      <span>{formatDay(race.startsAt)}</span>
    </div>
  );
}

function Legend({ races }) {
  const winners = new Map();
  races.forEach((race) => {
    const winner = race.podium[0];
    if (winner) winners.set(winner.code, winner);
  });

  return (
    <ul className={styles.legend}>
      {[...winners.values()].map((w) => (
        <li key={w.code}><i style={{ background: w.color }} />{w.name}</li>
      ))}
    </ul>
  );
}

export function SeasonStrip({ races }) {
  const { containerRef, card, bind } = useHoverCard();

  return (
    <Section
      id="temporada"
      title="Quem venceu cada etapa"
      description="Cada barra é uma corrida, na cor do vencedor. A listrada é a próxima; as tracejadas ainda vão acontecer."
    >
      <div ref={containerRef} className={styles.strip} style={{ '--count': races.length }}>
        {races.map((race) => {
          const winner = race.podium[0];
          return (
            <div
              key={race.round}
              className={`${styles.cell} ${styles[race.status]}`}
              {...bind(() => <RaceTooltip race={race} />)}
            >
              <i style={winner ? { background: winner.color } : undefined} />
              <b>{winner?.code ?? ''}</b>
              <small>{race.round}</small>
            </div>
          );
        })}
        <HoverCard card={card} containerRef={containerRef} />
      </div>
      <Legend races={races} />
    </Section>
  );
}
