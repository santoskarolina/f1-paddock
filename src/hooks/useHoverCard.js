import { useCallback, useRef, useState } from 'react';

/**
 * Controla um cartão flutuante posicionado em relação a um contêiner.
 * O contêiner precisa de `position: relative` e de receber `containerRef`.
 */
export function useHoverCard() {
  const containerRef = useRef(null);
  const [card, setCard] = useState(null);

  const show = useCallback((event, content) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setCard({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, content });
  }, []);

  const hide = useCallback(() => setCard(null), []);

  return { containerRef, card, show, hide };
}
