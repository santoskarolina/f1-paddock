import { Flag } from '../../components/ui/Flag';
import { formatDateTime, formatDay } from '../../utils/format';
import { CircuitTrack } from '../circuits/CircuitTrack';
import { Countdown } from './Countdown';
import styles from './NextRaceCard.module.css';

const PLACES = ['1º', '2º', '3º'];

/** Temporada encerrada: no lugar da próxima corrida, mostra a última, com traçado e pódio. */
export function FinalRaceCard({ race }) {
  return (
    <aside className={styles.card} aria-labelledby="ultima-corrida">
      <h2 id="ultima-corrida" className={styles.kicker}>Última corrida da temporada</h2>
      <div>
        <p className={styles.name}><Flag iso={race.countryIso} />{race.name}</p>
        <p className={styles.meta}>Etapa {race.round}, {race.circuit}, {formatDay(race.startsAt)}</p>
      </div>
      {race.layout && (
        <div className={styles.track}>
          <CircuitTrack layout={race.layout} color={race.podium[0]?.color} width={300} height={150} />
        </div>
      )}
      {race.podium.length > 0 && (
        <ol className={styles.podium}>
          {race.podium.map((entry, index) => (
            <li key={entry.code} style={{ '--team': entry.color }}>
              <span className={styles.place}>{PLACES[index]}</span>
              <strong>{entry.name}</strong>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

export function NextRaceCard({ race }) {
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
