import { useCountdown } from '../../hooks/useCountdown';
import styles from './Countdown.module.css';

const pad = (value) => String(value).padStart(2, '0');

export function Countdown({ target }) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(target);

  if (isOver) return <p className={styles.live}>Fim de semana em andamento</p>;

  const units = [
    { label: 'dias', value: days },
    { label: 'horas', value: hours },
    { label: 'min', value: minutes },
    { label: 'seg', value: seconds },
  ];

  return (
    <div className={styles.clock} role="timer" aria-label={`Faltam ${days} dias e ${hours} horas`}>
      {units.map((unit) => (
        <div key={unit.label} className={styles.unit}>
          <span className={`${styles.value} tabular`}>{pad(unit.value)}</span>
          <span className={styles.label}>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
