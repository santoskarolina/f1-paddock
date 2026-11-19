import { useCallback, useEffect, useMemo, useState } from 'react';
import { summarizeSeason } from '../domain/seasonStats';
import { loadSeason } from '../services/seasonService';

const LOADING = { status: 'loading', data: null, error: null };

/** Carrega a temporada pedida e recarrega sempre que o ano muda. */
export function useSeason(season) {
  const [state, setState] = useState(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState(LOADING);

    loadSeason(season, controller.signal)
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error) => {
        if (!controller.signal.aborted) setState({ status: 'error', data: null, error });
      });

    return () => controller.abort();
  }, [season, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const summary = useMemo(() => (state.data ? summarizeSeason(state.data) : null), [state.data]);

  return { ...state, summary, reload };
}
