import { RACE_POINTS, SIMULATION, SPRINT_POINTS } from '../config/constants';

/** Gerador pseudoaleatório (mulberry32) com semente, para resultados reproduzíveis. */
function createRandom(seed) {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gumbelNoise = (random) => -Math.log(-Math.log(Math.max(random(), 1e-12)));

/**
 * Sorteia uma ordem de chegada proporcional à força de cada piloto
 * (modelo de Plackett-Luce, pelo truque de Gumbel).
 */
function drawFinishingOrder(logStrengths, random) {
  const scores = logStrengths.map((w) => w + gumbelNoise(random));
  return scores.map((_, i) => i).sort((a, b) => scores[b] - scores[a]);
}

function awardPoints(totals, finishingOrder, table) {
  table.forEach((points, place) => {
    const driverIndex = finishingOrder[place];
    if (driverIndex !== undefined) totals[driverIndex] += points;
  });
}

const rankIndexes = (totals) => totals.map((_, i) => i).sort((a, b) => totals[b] - totals[a]);

/**
 * Simula as etapas restantes e devolve, por sigla do piloto, as probabilidades em %.
 * @returns {Map<string, {champion: number, runnerUp: number, winNext: number, podiumNext: number}>}
 */
export function simulateChampionship({
  drivers,
  completedRaces,
  remainingRaces,
  remainingSprints,
  config = SIMULATION,
}) {
  const { iterations, strengthExponent, strengthFloor, seed } = config;
  const random = createRandom(seed);
  const racesRun = Math.max(completedRaces, 1);

  const logStrengths = drivers.map((d) => strengthExponent * Math.log(d.points / racesRun + strengthFloor));
  const tally = drivers.map(() => ({ champion: 0, runnerUp: 0, winNext: 0, podiumNext: 0 }));

  for (let run = 0; run < iterations; run += 1) {
    const totals = drivers.map((d) => d.points);

    for (let race = 0; race < remainingRaces; race += 1) {
      const order = drawFinishingOrder(logStrengths, random);
      if (race === 0) {
        tally[order[0]].winNext += 1;
        order.slice(0, 3).forEach((i) => { tally[i].podiumNext += 1; });
      }
      awardPoints(totals, order, RACE_POINTS);
    }

    for (let sprint = 0; sprint < remainingSprints; sprint += 1) {
      awardPoints(totals, drawFinishingOrder(logStrengths, random), SPRINT_POINTS);
    }

    const [first, second] = rankIndexes(totals);
    if (first !== undefined) tally[first].champion += 1;
    if (second !== undefined) tally[second].runnerUp += 1;
  }

  const toPercent = (count) => (count / iterations) * 100;

  return new Map(
    drivers.map((d, i) => [
      d.code,
      {
        champion: toPercent(tally[i].champion),
        runnerUp: toPercent(tally[i].runnerUp),
        winNext: toPercent(tally[i].winNext),
        podiumNext: toPercent(tally[i].podiumNext),
      },
    ]),
  );
}
