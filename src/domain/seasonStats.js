import { RACE_POINTS, SPRINT_POINTS } from '../config/constants';

export function summarizeSeason({ drivers, teams, races }) {
  const completed = races.filter((r) => r.status === 'done');
  const pending = races.filter((r) => r.status !== 'done');
  const pendingSprints = pending.filter((r) => r.hasSprint).length;
  const pointsLeft = pending.length * RACE_POINTS[0] + pendingSprints * SPRINT_POINTS[0];

  const [leader, runnerUp] = drivers;
  const gap = leader && runnerUp ? leader.points - runnerUp.points : 0;
  const winners = new Set(completed.map((r) => r.podium[0]?.code).filter(Boolean));
  const topTeam = [...teams].sort((a, b) => b.wins - a.wins)[0] ?? null;

  return {
    completedRaces: completed.length,
    totalRaces: races.length,
    remainingRaces: pending.length,
    remainingSprints: pendingSprints,
    pointsLeft,
    leader,
    runnerUp,
    gap,
    isTitleDecided: gap > pointsLeft,
    distinctWinners: winners.size,
    topTeam,
    nextRace: races.find((r) => r.status === 'next') ?? null,
  };
}

/** Os dois pilotos com mais pontos de cada equipe, na ordem do mundial de construtores. */
export function buildTeammateDuels(drivers, teams) {
  return teams
    .map((team) => ({
      team,
      drivers: drivers
        .filter((d) => d.team.id === team.id)
        .sort((a, b) => b.points - a.points)
        .slice(0, 2),
    }))
    .filter((duel) => duel.drivers.length > 0);
}

export const gapToLeader = (items, item) => (items[0]?.points ?? 0) - item.points;
