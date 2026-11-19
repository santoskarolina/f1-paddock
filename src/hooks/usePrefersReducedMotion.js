import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() => window.matchMedia?.(QUERY).matches ?? false);

  useEffect(() => {
    const media = window.matchMedia?.(QUERY);
    if (!media) return undefined;
    const update = () => setPrefersReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return prefersReduced;
}
