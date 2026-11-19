import { HoverCard } from '../../components/ui/HoverCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Section } from '../../components/ui/Section';
import { gapToLeader } from '../../domain/seasonStats';
import { useHoverCard } from '../../hooks/useHoverCard';
import { formatGap, formatNumber } from '../../utils/format';
import styles from './ConstructorsStandings.module.css';

const TEAM_PHOTO = {
  'mercedes': '/teams/mercedes.svg',
  'ferrari': '/teams/ferrari.avif',
  'red_bull': '/teams/red_bull.png',
  'mclaren': '/teams/mclaren.png',
  'rb': '/teams/rb.png',
  'alpine': '/teams/alpine.png',
  'haas': '/teams/haas.png',
  'audi': '/teams/audi.png',
  'williams': '/teams/williams.png',
  'aston_martin': '/teams/aston_martin.png',
  'cadillac': '/teams/cadillac.png'
}

function TeamTooltip({ team }) {
  return (
    <div className={styles.tooltip} style={{ '--team': team.color }}>
      <strong>{team.name}</strong>
      <span>{formatNumber(team.points)} pontos</span>
      <span>{team.wins} vitórias, {team.podiums} pódios</span>
    </div>
  );
}

export function ConstructorsStandings({ teams }) {
  const { containerRef, card, show, hide } = useHoverCard();
  const max = Math.max(1, ...teams.map((t) => t.points));

  return (
    <Section id="equipes" title="Mundial de construtores" description="Pontos somados pelos carros de cada equipe.">
      <div ref={containerRef} className={styles.wrapper}>
        <ol className={styles.list}>
          {teams.map((team) => (
            <li
              key={team.id}
              className={styles.row}
              onPointerMove={(e) => show(e, <TeamTooltip team={team} />)}
              onPointerLeave={hide}
            >
              <span className={styles.rank}>{team.position}</span>
              <span className={styles.tick} style={{ background: team.color }} />
              <div className={styles.logo}>
                {TEAM_PHOTO[team.id] && <img src={TEAM_PHOTO[team.id]} alt="" loading="lazy" />}
              </div>
              <span className={styles.name}>{team.name}</span>
              <ProgressBar value={team.points} max={max} color={team.color} />
              <span className={`${styles.value} tabular`}>{formatNumber(team.points)}</span>
              <span className={`${styles.gap} tabular`}>{formatGap(gapToLeader(teams, team))}</span>
            </li>
          ))}
        </ol>
        <HoverCard card={card} containerRef={containerRef} />
      </div>
    </Section>
  );
}
