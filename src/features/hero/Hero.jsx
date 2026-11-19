import { Flag } from '../../components/ui/Flag';
import { formatNumber } from '../../utils/format';
import { DriverAvatar } from '../drivers/DriverAvatar';
import { NextRaceCard } from './NextRaceCard';
import styles from './Hero.module.css';

function Headline({ summary }) {
  const { leader, runnerUp, gap, pointsLeft, isTitleDecided } = summary;

  return (
    <>
      <h1 className={styles.title}>
        {isTitleDecided
          ? 'O título já tem dono. A briga agora é pelo vice.'
          : 'O título segue em aberto até as últimas voltas.'}
      </h1>
      {leader && runnerUp && (
        <p className={styles.lede}>
          <strong>{leader.name}</strong> soma <strong className="tabular">{formatNumber(leader.points)}</strong> pontos,{' '}
          <strong className="tabular">{formatNumber(gap)}</strong> à frente de <strong>{runnerUp.name}</strong>, e restam{' '}
          <strong className="tabular">{formatNumber(pointsLeft)}</strong> pontos em disputa.
        </p>
      )}
    </>
  );
}

function LeaderBadge({ leader, isChampion }) {
  return (
    <div className={styles.leader} style={{ '--team': leader.color }}>
      <DriverAvatar driver={leader} size={72} />
      <span className={styles.leaderNumber}>{leader.number}</span>
      <div className={styles.leaderMeta}>
        <span>{isChampion ? 'Campeão mundial' : 'Líder do campeonato'}</span>
        <strong><Flag iso={leader.nationalityIso} />{leader.name}</strong>
        <span>{leader.team.name}</span>
      </div>
      <dl className={styles.leaderStats}>
        <div><dt>vitórias</dt><dd>{leader.wins}</dd></div>
        <div><dt>pódios</dt><dd>{leader.podiums}</dd></div>
      </dl>
    </div>
  );
}

export function Hero({ summary }) {
  return (
    <header id="resumo" className={styles.hero}>
      <div className={styles.main}>
        <div className={styles.checker} aria-hidden="true" />
        <p className={styles.season}>
          Temporada de Fórmula 1, após <strong>{summary.completedRaces}</strong> de <strong>{summary.totalRaces}</strong> etapas
        </p>
        <Headline summary={summary} />
        {summary.leader && <LeaderBadge leader={summary.leader} isChampion={summary.isTitleDecided} />}
      </div>
      <NextRaceCard race={summary.nextRace} />
    </header>
  );
}
