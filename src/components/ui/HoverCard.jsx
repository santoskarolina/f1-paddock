import { useLayoutEffect, useRef, useState } from 'react';
import styles from './HoverCard.module.css';

const OFFSET = 14;

/** Cartão flutuante que troca de lado quando encostaria na borda do contêiner. */
export function HoverCard({ card, containerRef }) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState(null);

  useLayoutEffect(() => {
    if (!card || !cardRef.current || !containerRef.current) return;

    const { offsetWidth: width, offsetHeight: height } = cardRef.current;
    const { clientWidth: maxWidth, clientHeight: maxHeight } = containerRef.current;

    const fitsRight = card.x + OFFSET + width <= maxWidth;
    const fitsBelow = card.y + OFFSET + height <= maxHeight || card.y - height - OFFSET < 0;

    setPosition({
      left: fitsRight ? card.x + OFFSET : Math.max(0, card.x - width - OFFSET),
      top: fitsBelow ? card.y + OFFSET : card.y - height - OFFSET,
    });
  }, [card, containerRef]);

  if (!card) return null;

  return (
    <div ref={cardRef} className={styles.card} role="tooltip" style={position ?? { visibility: 'hidden' }}>
      {card.content}
    </div>
  );
}
