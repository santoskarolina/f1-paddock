import { Flag } from '../../components/ui/Flag';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { formatNumber, formatPercent } from '../../utils/format';
import { DriverAvatar } from '../drivers/DriverAvatar';
import { MAX_ATTRIBUTE } from '../../domain/driverCard';
import styles from './DriverTradingCard.module.css';

/** Quantos losangos aparecem no selo de raridade. */
const RARITY_MARKS = { legendary: 4, epic: 3, rare: 2, common: 1 };

function RarityMark({ rarity }) {
  return (
    <span className={styles.rarity}>
      <span className={styles.marks} aria-hidden="true">{'◆'.repeat(RARITY_MARKS[rarity.id])}</span>
      {rarity.label}
    </span>
  );
}

/** Frente da carta colecionável. Recebe os dados prontos de buildDriverCard. */
export function DriverTradingCard({ card, driver, titleId }) {
  return (
    <div className={`${styles.card} ${styles[card.rarity.id]}`} style={{ '--team': card.color }}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.name}>
            <Flag iso={driver.nationalityIso} />
            {card.name}
          </h2>
          <p className={styles.points}>
            <span>PTS</span>
            <strong className="tabular">{formatNumber(card.points)}</strong>
          </p>
        </header>

        <div className={styles.photo}>
          {card.number && <span className={styles.watermark} aria-hidden="true">{card.number}</span>}
          <DriverAvatar driver={driver} size="100%" className={styles.avatar} />
        </div>

        <p className={styles.strip}>
          <span>{card.teamName}</span>
          {card.number && <span className="tabular">Nº {card.number}</span>}
        </p>

        <ul className={styles.attributes} aria-label="Atributos">
          {card.attributes.map((attribute) => (
            <li key={attribute.id}>
              <span className={styles.attributeLabel}>{attribute.label}</span>
              <strong className="tabular">{attribute.value}</strong>
              <ProgressBar value={attribute.value} max={MAX_ATTRIBUTE} color={card.color} size="sm" />
            </li>
          ))}
        </ul>

        <ul className={styles.moves} aria-label="Golpes">
          {card.moves.map((move) => (
            <li key={move.id}>
              <div>
                <strong className={styles.moveName}>{move.name}</strong>
                <span className={styles.moveText}>{move.description}</span>
              </div>
              <span className={`${styles.moveValue} tabular`}>{formatNumber(move.value)}</span>
            </li>
          ))}
        </ul>

        <p className={styles.flavor}>{card.flavorText}</p>

        <footer className={styles.footer}>
          <RarityMark rarity={card.rarity} />
          {card.titleChance !== null && <span>Título {formatPercent(card.titleChance)}</span>}
          <span className="tabular">{card.cardNumber}</span>
        </footer>
      </div>
      <div className={styles.holo} aria-hidden="true" />
    </div>
  );
}
