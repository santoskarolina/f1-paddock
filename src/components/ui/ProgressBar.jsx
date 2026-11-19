import { useEffect, useState } from 'react';
import styles from './ProgressBar.module.css';

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** Barra horizontal que cresce a partir de zero na primeira renderização. */
export function ProgressBar({ value, max, color, size = 'md' }) {
  const [isRevealed, setIsRevealed] = useState(prefersReducedMotion);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className={`${styles.track} ${styles[size]}`} aria-hidden="true">
      <div className={styles.fill} style={{ width: isRevealed ? `${percent}%` : 0, background: color }} />
    </div>
  );
}
