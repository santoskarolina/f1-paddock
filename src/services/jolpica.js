import { CACHE_TTL_MS, CURRENT_SEASON, JOLPICA_BASE_URL, PAST_SEASON_CACHE_TTL_MS } from '../config/constants';
import { fetchJson } from './http';

const endpoint = (season, path) => `${JOLPICA_BASE_URL}/${season}/${path}`;
const ttlFor = (season) => (season < CURRENT_SEASON ? PAST_SEASON_CACHE_TTL_MS : CACHE_TTL_MS);
const get = (season, path, signal) => fetchJson(endpoint(season, path), { signal, ttl: ttlFor(season) });

// limit=100: o padrão da API é 30 itens, o que cortaria o fim da tabela em temporadas com muitos pilotos.

export async function getDriverStandings(season, signal) {
  const { MRData } = await get(season, 'driverstandings.json?limit=100', signal);
  return MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
}

export async function getConstructorStandings(season, signal) {
  const { MRData } = await get(season, 'constructorstandings.json?limit=100', signal);
  return MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
}

export async function getSchedule(season, signal) {
  const { MRData } = await get(season, 'races.json?limit=100', signal);
  return MRData.RaceTable.Races;
}

/** Todas as corridas da temporada, cada uma só com o piloto na posição pedida. */
export async function getResultsAtPosition(season, position, signal) {
  const { MRData } = await get(season, `results/${position}.json?limit=100`, signal);
  return MRData.RaceTable.Races;
}
