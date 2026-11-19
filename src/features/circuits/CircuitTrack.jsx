import { useId, useMemo } from 'react';
import { projectTrack, toSvgPath } from '../../domain/trackGeometry';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './CircuitTrack.module.css';

/** Metros que o "carro" percorre por segundo na animação (não é a velocidade real). */
const ANIMATION_METERS_PER_SECOND = 900;

/**
 * Desenha o traçado do circuito em SVG.
 * Com `animated`, um ponto na cor escolhida dá voltas pela pista a partir da largada.
 */
export function CircuitTrack({ layout, color = 'var(--accent)', width = 320, height = 220, animated = false, variant = 'full' }) {
  const pathId = `track-${useId().replace(/:/g, '')}`;
  const prefersReducedMotion = usePrefersReducedMotion();

  const points = useMemo(
    () => projectTrack(layout.coordinates, { width, height, padding: variant === 'thumb' ? 4 : 14 }),
    [layout, width, height, variant],
  );
  const path = useMemo(() => toSvgPath(points), [points]);
  const [startX, startY] = points[0];
  const lapSeconds = Math.max(4, layout.lengthMeters / ANIMATION_METERS_PER_SECOND);

  return (
    <svg
      className={`${styles.svg} ${styles[variant]}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Traçado do circuito ${layout.name}`}
      style={{ '--track-color': color }}
    >
      <path className={styles.base} d={path} />
      <path id={pathId} className={styles.line} d={path} />
      <circle className={styles.start} cx={startX} cy={startY} r={variant === 'thumb' ? 2.5 : 5} />
      {animated && !prefersReducedMotion && (
        <circle className={styles.car} r={6}>
          <animateMotion dur={`${lapSeconds}s`} repeatCount="indefinite">
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      )}
    </svg>
  );
}
