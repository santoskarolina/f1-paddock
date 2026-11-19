import { OPENF1_BASE_URL } from '../config/constants';
import { fetchJson } from './http';

/**
 * Foto e cor oficial de cada piloto da sessão mais recente, indexadas pela sigla (VER, ANT...).
 * @returns {Promise<Map<string, {headshotUrl: string|null, teamColor: string|null}>>}
 */
export async function getDriverProfiles(signal) {
  const drivers = await fetchJson(`${OPENF1_BASE_URL}/drivers?session_key=latest`, { signal });
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
