import { useCallback, useEffect, useState } from 'react';
import { CURRENT_SEASON, FIRST_SEASON } from '../config/constants';

const PARAM = 'temporada';

/** Lê o ano da URL (?temporada=2024); se faltar ou for inválido, usa a temporada atual. */
function readSeasonFromUrl() {
  const value = Number(new URLSearchParams(window.location.search).get(PARAM));
  return Number.isInteger(value) && value >= FIRST_SEASON && value <= CURRENT_SEASON ? value : CURRENT_SEASON;
}

/**
 * Temporada escolhida, guardada na URL para que o link possa ser compartilhado
 * e para que o botão "voltar" do navegador volte à temporada anterior.
 */
export function useSelectedSeason() {
  const [season, setSeasonState] = useState(readSeasonFromUrl);

  useEffect(() => {
    const syncFromUrl = () => setSeasonState(readSeasonFromUrl());
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const setSeason = useCallback((next) => {
    const url = new URL(window.location.href);
    if (next === CURRENT_SEASON) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, String(next));
    url.hash = '';
    window.history.pushState(null, '', url);
    setSeasonState(next);
  }, []);

  return [season, setSeason];
}
