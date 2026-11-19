import styles from './CardBack.module.css';

/** Verso da carta: padrão geométrico na cor da equipe, com o número do piloto no centro. */
export function CardBack({ driver }) {
  return (
    <div className={styles.back} style={{ '--team': driver.color }}>
      <div className={styles.pattern}>
        <div className={styles.emblem}>
          <span className={styles.number}>{driver.number ?? driver.code}</span>
          <span className={styles.label}>Paddock</span>
        </div>
      </div>
    </div>
  );
}
