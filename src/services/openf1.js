import { CURRENT_SEASON, OPENF1_BASE_URL, OPENF1_FIRST_SEASON } from '../config/constants';
import { fetchJson } from './http';

/** Sessão de corrida mais recente da temporada (a última do ano, se ela já terminou). */
async function lastRaceSessionKey(season, signal) {
  if (season === CURRENT_SEASON) return 'latest';
  const sessions = await fetchJson(`${OPENF1_BASE_URL}/sessions?year=${season}&session_type=Race`, { signal });
  const last = [...sessions].sort((a, b) => a.date_start.localeCompare(b.date_start)).at(-1);
  return last?.session_key ?? null;
}

/**
 * Foto e cor oficial de cada piloto na última corrida da temporada, indexadas pela sigla (VER, ANT...).
 * Antes de 2023 a OpenF1 não tem dados: o mapa volta vazio e o site usa as cores de reserva.
 * @returns {Promise<Map<string, {headshotUrl: string|null, teamColor: string|null}>>}
 */
export async function getDriverProfiles(season, signal) {
  if (season < OPENF1_FIRST_SEASON) return new Map();

  const sessionKey = await lastRaceSessionKey(season, signal);
  if (!sessionKey) return new Map();

  const drivers = await fetchJson(`${OPENF1_BASE_URL}/drivers?session_key=${sessionKey}`, { signal });
  return new Map(
    drivers.map((d) => [
      d.name_acronym,
      {
        headshotUrl: d.headshot_url ?? null,
        teamColor: d.team_colour ? `#${d.team_colour}` : null,
      },
    ]),
  );
}
