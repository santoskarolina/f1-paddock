import { JOLPICA_BASE_URL, SEASON } from '../config/constants';
import { fetchJson } from './http';

const endpoint = (path) => `${JOLPICA_BASE_URL}/${SEASON}/${path}`;

export async function getDriverStandings(signal) {
  const { MRData } = await fetchJson(endpoint('driverstandings.json'), { signal });
  return MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
}

export async function getConstructorStandings(signal) {
  const { MRData } = await fetchJson(endpoint('constructorstandings.json'), { signal });
  return MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
}

export async function getSchedule(signal) {
  const { MRData } = await fetchJson(endpoint('races.json?limit=100'), { signal });
  return MRData.RaceTable.Races;
}

/** Todas as corridas da temporada, cada uma só com o piloto na posição pedida. */
export async function getResultsAtPosition(position, signal) {
  const { MRData } = await fetchJson(endpoint(`results/${position}.json?limit=100`), { signal });
  return MRData.RaceTable.Races;
}
