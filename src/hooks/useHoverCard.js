import { useCallback, useEffect, useRef, useState } from 'react';

const isTouch = (event) => event?.pointerType === 'touch' || event?.pointerType === 'pen';

/**
 * Controla um cartão flutuante posicionado em relação a um contêiner.
 * O contêiner precisa de `position: relative` e de receber `containerRef`.
 *
 * Mouse: o cartão segue o cursor e some ao sair do item.
 * Toque: um toque no item abre o cartão; tocar em qualquer outro lugar fecha.
 * Arrastar para rolar a página não abre nada, porque o navegador cancela o
 * ponteiro (pointercancel) em vez de disparar o pointerup.
 *
 * Use `bind(() => <Conteudo />)` para obter os handlers de cada item.
 */
export function useHoverCard() {
  const containerRef = useRef(null);
  const [card, setCard] = useState(null);

  const show = useCallback((event, content) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setCard({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      content,
      byTouch: isTouch(event),
    });
  }, []);

  const hide = useCallback(() => setCard(null), []);

  // Aberto por toque: o próximo toque em qualquer lugar fecha (e, se for em outro item, ele reabre).
  const openedByTouch = card?.byTouch ?? false;
  useEffect(() => {
    if (!openedByTouch) return undefined;
    document.addEventListener('pointerdown', hide, true);
    return () => document.removeEventListener('pointerdown', hide, true);
  }, [openedByTouch, hide]);

  const bind = useCallback(
    (getContent) => ({
      onPointerMove: (event) => {
        if (!isTouch(event)) show(event, getContent());
      },
      onPointerLeave: (event) => {
        if (!isTouch(event)) hide();
      },
      onPointerUp: (event) => {
        if (isTouch(event)) show(event, getContent());
      },
    }),
    [show, hide],
  );

  return { containerRef, card, show, hide, bind };
}
