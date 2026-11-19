import { useEffect, useRef } from 'react';
import { Flag } from '../../components/ui/Flag';
import { formatDateTime, formatNumber } from '../../utils/format';
import { CircuitTrack } from '../circuits/CircuitTrack';
import { DriverAvatar } from '../drivers/DriverAvatar';
import { Countdown } from '../hero/Countdown';
import styles from './RaceDetail.module.css';

const PLACE_LABELS = ['Vencedor', '2º lugar', '3º lugar'];

function CircuitFacts({ race }) {
  const { layout } = race;
  const facts = [
    { label: 'Circuito', value: layout?.name ?? race.circuit },
    { label: 'Cidade', value: race.locality },
    layout?.lengthMeters && { label: 'Extensão', value: `${(layout.lengthMeters / 1000).toFixed(3).replace('.', ',')} km` },
    layout?.firstGp && { label: 'Primeiro GP de F1', value: layout.firstGp },
    Number.isFinite(layout?.altitudeMeters) && { label: 'Altitude', value: `${formatNumber(layout.altitudeMeters)} m` },
  ].filter(Boolean);

  return (
    <dl className={styles.facts}>
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Podium({ podium, driversByCode }) {
  return (
    <ol className={styles.podium}>
      {podium.map((entry, index) => {
        const driver = driversByCode.get(entry.code) ?? { ...entry, number: null, headshotUrl: null };
        return (
          <li key={entry.code} className={styles.step} style={{ '--team': entry.color }}>
            <DriverAvatar driver={driver} size={index === 0 ? 96 : 72} />
            <span className={styles.place}>{PLACE_LABELS[index]}</span>
            <strong className={styles.driver}>{entry.name}</strong>
          </li>
        );
      })}
    </ol>
  );
}

/** Ficha da corrida em uma janela modal: traçado animado, dados do circuito e pódio com fotos. */
export function RaceDetail({ race, driversByCode, onClose, onPrevious, onNext }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (race && !dialog.open) dialog.showModal();
    if (!race && dialog.open) dialog.close();
  }, [race]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') onPrevious?.();
    if (event.key === 'ArrowRight') onNext?.();
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) onClose();
  };

  const trackColor = race?.podium[0]?.color ?? 'var(--accent)';

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      aria-labelledby="race-detail-title"
    >
      {race && (
        <article className={styles.content} style={{ '--team': trackColor }}>
          <header className={styles.header}>
            <div>
              <p className={styles.kicker}>Etapa {race.round}{race.hasSprint && ' · fim de semana com sprint'}</p>
              <h2 id="race-detail-title" className={styles.title}><Flag iso={race.countryIso} />{race.name}</h2>
              <p className={styles.kicker}>{formatDateTime(race.startsAt)}</p>
            </div>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">×</button>
          </header>

          <div className={styles.body}>
            <div className={styles.track}>
              {race.layout ? (
                <CircuitTrack layout={race.layout} color={trackColor} width={420} height={300} animated />
              ) : (
                <p className={styles.empty}>Traçado indisponível para este circuito.</p>
              )}
            </div>
            <div className={styles.side}>
              <CircuitFacts race={race} />
              {race.status === 'done' && <Podium podium={race.podium} driversByCode={driversByCode} />}
              {race.status === 'next' && <Countdown target={race.startsAt} />}
              {race.status === 'upcoming' && <p className={styles.empty}>Corrida ainda não disputada.</p>}
            </div>
          </div>

          <footer className={styles.footer}>
            <button type="button" onClick={onPrevious} disabled={!onPrevious}>← Etapa anterior</button>
            <button type="button" onClick={onNext} disabled={!onNext}>Próxima etapa →</button>
          </footer>
        </article>
      )}
    </dialog>
  );
}
