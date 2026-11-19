import { teamColor } from '../config/teams';
import { countryToIso, nationalityToIso } from '../utils/flags';
import { findLayout, loadCircuitLayouts } from './circuitLayouts';
import { getConstructorStandings, getDriverStandings, getResultsAtPosition, getSchedule } from './jolpica';
import { getDriverProfiles } from './openf1';

const PODIUM_POSITIONS = [1, 2, 3];

/**
 * @typedef {{ id: string, code: string, number: string|null, name: string, nationalityIso: string|null,
 *   position: number, points: number, wins: number, podiums: number,
 *   team: { id: string, name: string }, color: string, headshotUrl: string|null }} Driver
 * @typedef {{ id: string, name: string, position: number, points: number, wins: number,
 *   podiums: number, color: string }} Team
 * @typedef {{ code: string, name: string, color: string }} PodiumEntry
 * @typedef {{ round: number, name: string, circuit: string, locality: string, countryIso: string|null,
 *   location: {lat: number, lon: number}|null, layout: import('./circuitLayouts').CircuitLayout|null,
 *   startsAt: Date, hasSprint: boolean, podium: PodiumEntry[], status: 'done'|'next'|'upcoming' }} Race
 */

const driverCode = (driver) => driver.code ?? driver.familyName.slice(0, 3).toUpperCase();
const fullName = (driver) => `${driver.givenName} ${driver.familyName}`;
const toDate = (date, time) => new Date(`${date}T${time ?? '12:00:00Z'}`);

function toLocation({ lat, long }) {
  const location = { lat: Number(lat), lon: Number(long) };
  return Number.isFinite(location.lat) && Number.isFinite(location.lon) ? location : null;
}

function increment(counter, key) {
  counter.set(key, (counter.get(key) ?? 0) + 1);
}

/** Pódio de cada etapa e contagem de pódios por piloto e por equipe. */
function indexPodiums(resultsByPosition) {
  const byRound = new Map();
  const byDriver = new Map();
  const byTeam = new Map();

  resultsByPosition.forEach((races, place) => {
    races.forEach((race) => {
      const result = race.Results?.[0];
      if (!result) return;

      const round = Number(race.round);
      const podium = byRound.get(round) ?? [];
      podium[place] = { driver: result.Driver, teamId: result.Constructor.constructorId };
      byRound.set(round, podium);

      increment(byDriver, result.Driver.driverId);
      increment(byTeam, result.Constructor.constructorId);
    });
  });

  return { byRound, byDriver, byTeam };
}

function mapDrivers(standings, podiumsByDriver, profiles) {
  return standings.map((entry) => {
    const driver = entry.Driver;
    const team = entry.Constructors.at(-1) ?? { constructorId: 'unknown', name: '—' };
    const code = driverCode(driver);
    const profile = profiles.get(code);

    return {
      id: driver.driverId,
      code,
      number: driver.permanentNumber ?? null,
      name: fullName(driver),
      nationalityIso: nationalityToIso(driver.nationality),
      position: Number(entry.position ?? entry.positionText),
      points: Number(entry.points),
      wins: Number(entry.wins),
      podiums: podiumsByDriver.get(driver.driverId) ?? 0,
      team: { id: team.constructorId, name: team.name },
      color: profile?.teamColor ?? teamColor(team.constructorId),
      headshotUrl: profile?.headshotUrl ?? null,
    };
  });
}

function mapTeams(standings, podiumsByTeam, drivers) {
  return standings.map((entry) => {
    const { constructorId, name } = entry.Constructor;
    const driverColor = drivers.find((d) => d.team.id === constructorId)?.color;

    return {
      id: constructorId,
      name,
      position: Number(entry.position ?? entry.positionText),
      points: Number(entry.points),
      wins: Number(entry.wins),
      podiums: podiumsByTeam.get(constructorId) ?? 0,
      color: driverColor ?? teamColor(constructorId),
    };
  });
}

function raceStatus(round, lastCompletedRound) {
  if (round <= lastCompletedRound) return 'done';
  if (round === lastCompletedRound + 1) return 'next';
  return 'upcoming';
}

function mapRaces(schedule, podiumsByRound, drivers, layouts) {
  const driversById = new Map(drivers.map((d) => [d.id, d]));
  const lastCompletedRound = Math.max(0, ...podiumsByRound.keys());

  const toPodiumEntry = (slot) =>
    slot && {
      code: driverCode(slot.driver),
      name: fullName(slot.driver),
      color: driversById.get(slot.driver.driverId)?.color ?? teamColor(slot.teamId),
    };

  return schedule.map((race) => {
    const round = Number(race.round);
    const location = toLocation(race.Circuit.Location);
    return {
      round,
      name: race.raceName,
      circuit: race.Circuit.circuitName,
      locality: race.Circuit.Location.locality,
      countryIso: countryToIso(race.Circuit.Location.country),
      location,
      layout: findLayout(layouts, location),
      startsAt: toDate(race.date, race.time),
      hasSprint: Boolean(race.Sprint),
      podium: (podiumsByRound.get(round) ?? []).map(toPodiumEntry).filter(Boolean),
      status: raceStatus(round, lastCompletedRound),
    };
  });
}

/**
 * Carrega e normaliza a temporada atual.
 * As chamadas à Jolpica são sequenciais porque a API limita rajadas de requisições.
 * A OpenF1 é opcional: se ela falhar, o site funciona sem fotos.
 * @returns {Promise<{ drivers: Driver[], teams: Team[], races: Race[] }>}
 */
export async function loadSeason(signal) {
  const driverStandings = await getDriverStandings(signal);
  const constructorStandings = await getConstructorStandings(signal);
  const schedule = await getSchedule(signal);

  const resultsByPosition = [];
  for (const position of PODIUM_POSITIONS) {
    resultsByPosition.push(await getResultsAtPosition(position, signal));
  }

  const profiles = await getDriverProfiles(signal).catch(() => new Map());
  const layouts = await loadCircuitLayouts().catch(() => []);
  const podiums = indexPodiums(resultsByPosition);

  const drivers = mapDrivers(driverStandings, podiums.byDriver, profiles);
  const teams = mapTeams(constructorStandings, podiums.byTeam, drivers);
  const races = mapRaces(schedule, podiums.byRound, drivers, layouts);

  return { drivers, teams, races };
}
