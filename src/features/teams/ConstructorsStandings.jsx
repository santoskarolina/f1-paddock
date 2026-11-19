import { HoverCard } from '../../components/ui/HoverCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Section } from '../../components/ui/Section';
import { gapToLeader } from '../../domain/seasonStats';
import { useHoverCard } from '../../hooks/useHoverCard';
import { formatGap, formatNumber } from '../../utils/format';
import styles from './ConstructorsStandings.module.css';

const TEAM_PHOTO = {
  'mercedes': 'public/teams/mercedes.svg',
  'ferrari': 'public/teams/ferrari.avif',
  'red_bull': 'public/teams/red_bull.png',
  'mclaren': 'public/teams/mclaren.png',
  'rb': 'public/teams/rb.png',
  'alpine': 'public/teams/alpine.png',
  'haas': 'public/teams/haas.png',
  'audi': 'public/teams/audi.png',
  'williams': 'public/teams/williams.png',
  'aston_martin': 'public/teams/aston_martin.png',
  'cadillac': 'public/teams/cadillac.png'
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
