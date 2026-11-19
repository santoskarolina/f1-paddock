import { useCallback, useRef } from 'react';

const RESTING = { '--rx': '0deg', '--ry': '0deg', '--mx': '50%', '--my': '30%', '--hover': '0' };

function applyVars(element, vars) {
  Object.entries(vars).forEach(([name, value]) => element.style.setProperty(name, value));
}

/**
 * Inclinação 3D e reflexo que seguem o cursor.
 * Escreve variáveis CSS direto no elemento (sem re-renderizar o React):
 * --rx/--ry (rotação), --mx/--my (posição do reflexo) e --hover (0 ou 1).
 * Só reage a mouse e caneta: em toque, a carta fica parada com o brilho estático.
 */
export function useTiltEffect({ maxTilt = 12, disabled = false } = {}) {
  const ref = useRef(null);

  const onPointerMove = useCallback(
    (event) => {
      const element = ref.current;
      if (disabled || !element || event.pointerType === 'touch') return;

      const rect = element.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

      applyVars(element, {
        '--rx': `${((0.5 - y) * 2 * maxTilt).toFixed(2)}deg`,
        '--ry': `${((x - 0.5) * 2 * maxTilt).toFixed(2)}deg`,
        '--mx': `${(x * 100).toFixed(1)}%`,
        '--my': `${(y * 100).toFixed(1)}%`,
        '--hover': '1',
      });
    },
    [disabled, maxTilt],
  );

  const onPointerLeave = useCallback(() => {
    if (ref.current) applyVars(ref.current, RESTING);
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
