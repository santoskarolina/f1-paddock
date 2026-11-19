import styles from './RaceCarLoader.module.css';

function Wheel({ cx, r }) {
  return (
    <g className={styles.wheel}>
      <circle cx={cx} cy={42} r={r} className={styles.tyre} />
      <circle cx={cx} cy={42} r={r * 0.55} className={styles.rim} />
      <path d={`M${cx - r * 0.55} 42 H${cx + r * 0.55} M${cx} ${42 - r * 0.55} V${42 + r * 0.55}`} className={styles.spokes} />
    </g>
  );
}

/** Carro de corrida genérico (desenho original) andando numa pista, para a tela de carregamento. */
export function RaceCarLoader() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.car}>
        <span className={styles.streak} />
        <span className={styles.streak} />
        <span className={styles.streak} />
        <svg viewBox="0 0 200 58" className={styles.svg}>
          {/* asa traseira */}
          <rect x="6" y="12" width="24" height="7" rx="1.5" className={styles.wing} />
          <rect x="16" y="19" width="4" height="15" className={styles.dark} />
          {/* carroceria: traseira, entrada de ar, cockpit e bico */}
          <path
            d="M18 44 L20 33 L58 30 L74 20 L96 19 L104 28 L150 31 L184 37 L194 41 L194 44 Z"
            className={styles.body}
          />
          <path d="M60 36 H140" className={styles.stripe} />
          {/* capacete e halo */}
          <circle cx="100" cy="23" r="6" className={styles.helmet} />
          <path d="M86 27 Q100 13 116 28" className={styles.halo} />
          {/* asa dianteira */}
          <rect x="170" y="44" width="28" height="4" rx="1" className={styles.wing} />
          <Wheel cx={46} r={13} />
          <Wheel cx={156} r={11} />
        </svg>
      </div>
      <div className={styles.road} />
      <div className={styles.kerb} />
    </div>
  );
}
