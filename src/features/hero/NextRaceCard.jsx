import { Flag } from '../../components/ui/Flag';
import { formatDateTime } from '../../utils/format';
import { CircuitTrack } from '../circuits/CircuitTrack';
import { Countdown } from './Countdown';
import styles from './NextRaceCard.module.css';

export function NextRaceCard({ race }) {
  if (!race) {
    return (
      <aside className={styles.card}>
        <h2 className={styles.kicker}>Próxima corrida</h2>
        <p className={styles.name}>Temporada encerrada</p>
      </aside>
    );
  }

  return (
    <aside className={styles.card} aria-labelledby="proxima-corrida">
      <h2 id="proxima-corrida" className={styles.kicker}>Próxima corrida</h2>
      <div>
        <p className={styles.name}><Flag iso={race.countryIso} />{race.name}</p>
        <p className={styles.meta}>Etapa {race.round}, {race.circuit}</p>
        <p className={styles.meta}>Largada {formatDateTime(race.startsAt)} (seu horário)</p>
      </div>
      {race.layout && (
        <div className={styles.track}>
          <CircuitTrack layout={race.layout} width={300} height={150} animated />
        </div>
      )}
      <Countdown target={race.startsAt} />
    </aside>
  );
}
