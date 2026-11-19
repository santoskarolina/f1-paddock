import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useTiltEffect } from '../../hooks/useTiltEffect';
import { CardBack } from './CardBack';
import { DriverTradingCard } from './DriverTradingCard';
import { downloadCardImage } from './downloadCard';
import styles from './DriverCardDialog.module.css';

const TITLE_ID = 'driver-card-title';

function FlippableCard({ driver, card, reducedMotion }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [download, setDownload] = useState('idle'); // idle | working | error
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const tilt = useTiltEffect({ maxTilt: 12, disabled: reducedMotion });
  const flip = () => setIsFlipped((value) => !value);

  const handleDownload = async () => {
    const face = isFlipped ? 'verso' : 'frente';
    const node = (isFlipped ? backRef : frontRef).current?.firstElementChild;
    if (!node) return;

    setDownload('working');
    try {
      await downloadCardImage(node, `carta-${driver.code.toLowerCase()}-${face}.png`);
      setDownload('idle');
    } catch {
      setDownload('error');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flip();
    }
  };

  return (
    <>
      <div
        ref={tilt.ref}
        className={`${styles.tilt} ${reducedMotion ? styles.still : styles.deal}`}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
      >
        <div
          className={`${styles.flipper} ${isFlipped ? styles.flipped : ''}`}
          role="group"
          aria-roledescription="carta"
          aria-labelledby={TITLE_ID}
          tabIndex={0}
          onClick={flip}
          onKeyDown={handleKeyDown}
        >
          <div ref={frontRef} className={styles.front} aria-hidden={isFlipped}>
            <DriverTradingCard card={card} driver={driver} titleId={TITLE_ID} />
          </div>
          <div ref={backRef} className={styles.back} aria-hidden={!isFlipped}>
            <CardBack driver={driver} />
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.actionButton} onClick={flip}>
          {isFlipped ? 'Ver a frente' : 'Virar a carta'}
        </button>
        <button
          type="button"
          className={styles.actionButton}
          onClick={handleDownload}
          disabled={download === 'working'}
        >
          {download === 'working' ? 'Gerando imagem…' : `Baixar ${isFlipped ? 'verso' : 'carta'}`}
        </button>
      </div>
      {download === 'error' && (
        <p className={styles.error} role="alert">Não foi possível gerar a imagem. Tente de novo.</p>
      )}
    </>
  );
}

export function DriverCardDialog({ driver, card, onClose, onPrevious, onNext }) {
  const dialogRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (driver && !dialog.open) dialog.showModal();
    if (!driver && dialog.open) dialog.close();
  }, [driver]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') onPrevious?.();
    if (event.key === 'ArrowRight') onNext?.();
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      aria-labelledby={TITLE_ID}
    >
      {driver && card && (
        <div className={styles.content} style={{ '--team': card.color }}>
          <header className={styles.header}>
            <p className={styles.kicker}>Carta colecionável · {card.rarity.label}</p>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">×</button>
          </header>

          {/* A key remonta a carta ao trocar de piloto: volta para a frente e repete a entrada. */}
          <div className={styles.stage}>
            <FlippableCard key={driver.id} driver={driver} card={card} reducedMotion={reducedMotion} />
          </div>
        </div>
      )}
    </dialog>
  );
}
