/**
 * Regras da carta colecionável do piloto. Funções puras, sem React nem navegador.
 */

export const MAX_ATTRIBUTE = 99;

export const RARITIES = {
  legendary: { id: 'legendary', label: 'Lendária' },
  epic: { id: 'epic', label: 'Épica' },
  rare: { id: 'rare', label: 'Rara' },
  common: { id: 'common', label: 'Comum' },
};

/** 1º = Lendária, 2º–3º = Épica, 4º–10º = Rara, demais = Comum. */
export function rarityForPosition(position) {
  if (position === 1) return RARITIES.legendary;
  if (position <= 3) return RARITIES.epic;
  if (position <= 10) return RARITIES.rare;
  return RARITIES.common;
}

const pointsPerRace = (driver, racesRun) => driver.points / racesRun;
const podiumRate = (driver, racesRun) => driver.podiums / racesRun;

const ATTRIBUTES = [
  { id: 'pace', label: 'Ritmo', measure: pointsPerRace },
  { id: 'wins', label: 'Vitórias', measure: (d) => d.wins },
  { id: 'podiums', label: 'Pódios', measure: (d) => d.podiums },
  { id: 'consistency', label: 'Consistência', measure: podiumRate },
];

/** Escala de 0 a 99, onde o melhor do grid recebe 99. */
export function normalize(value, best) {
  if (!(best > 0)) return 0;
  return Math.round(Math.min(1, Math.max(0, value / best)) * MAX_ATTRIBUTE);
}

function buildAttributes(driver, allDrivers, racesRun) {
  return ATTRIBUTES.map(({ id, label, measure }) => {
    const best = Math.max(0, ...allDrivers.map((d) => measure(d, racesRun)));
    return { id, label, value: normalize(measure(driver, racesRun), best) };
  });
}

const plural = (count, singular, pluralForm) => `${count} ${count === 1 ? singular : pluralForm}`;

/** Golpes possíveis, na ordem usada para desempatar valores iguais. */
const MOVES = [
  {
    id: 'finalFlag',
    name: 'Bandeirada Final',
    isAvailable: (d) => d.wins > 0,
    value: (d) => d.wins * 25,
    describe: (d) => `Cruza a linha em primeiro: ${plural(d.wins, 'vitória', 'vitórias')} na temporada.`,
  },
  {
    id: 'podiumTrain',
    name: 'Trem do Pódio',
    isAvailable: (d) => d.podiums > 0,
    value: (d) => d.podiums * 15,
    describe: (d) => `Sobe ao pódio sem pedir licença: ${plural(d.podiums, 'pódio', 'pódios')}.`,
  },
  {
    id: 'pointsHunter',
    name: 'Caçador de Pontos',
    isAvailable: () => true,
    value: (d, racesRun) => Math.round(pointsPerRace(d, racesRun)),
    describe: (d, racesRun) =>
      `Soma em média ${pointsPerRace(d, racesRun).toFixed(1).replace('.', ',')} pontos por corrida.`,
  },
  {
    id: 'slipstream',
    name: 'Vácuo na Reta',
    isAvailable: () => true,
    value: (d) => Math.round(d.points / 10),
    describe: (d) => `Cola no carro da frente e acumula ${plural(d.points, 'ponto', 'pontos')} no ano.`,
  },
];

/** Os dois golpes de maior valor; empates seguem a ordem de MOVES, então o resultado é sempre o mesmo. */
export function pickMoves(driver, racesRun, count = 2) {
  return MOVES.map((move, order) => ({ move, order }))
    .filter(({ move }) => move.isAvailable(driver))
    .map(({ move, order }) => ({
      id: move.id,
      name: move.name,
      value: move.value(driver, racesRun),
      description: move.describe(driver, racesRun),
      order,
    }))
    .sort((a, b) => b.value - a.value || a.order - b.order)
    .slice(0, count)
    .map(({ order, ...move }) => move);
}

/** Uma frase de ambientação montada a partir da campanha. */
export function buildFlavorText(driver) {
  const team = `pela equipe ${driver.team.name}`;
  const opening = driver.position === 1 ? 'Líder do campeonato' : `${driver.position}º no campeonato`;

  if (driver.wins > 0) return `${opening} com ${plural(driver.wins, 'vitória', 'vitórias')}, correndo ${team}.`;
  if (driver.podiums > 0) return `${opening} com ${plural(driver.podiums, 'pódio', 'pódios')}, correndo ${team}.`;
  if (driver.points > 0) return `${opening} com ${plural(driver.points, 'ponto', 'pontos')}, correndo ${team}.`;
  return `Ainda em busca do primeiro ponto, correndo ${team}.`;
}

/**
 * Tudo que a carta do piloto precisa mostrar.
 * @param {import('../services/seasonService').Driver} driver
 * @param {{ completedRaces: number, odds?: Map<string, {champion: number, winNext: number}>,
 *   allDrivers: import('../services/seasonService').Driver[] }} context
 */
export function buildDriverCard(driver, { completedRaces, odds, allDrivers }) {
  const racesRun = Math.max(completedRaces, 1);
  const grid = allDrivers.length > 0 ? allDrivers : [driver];
  const driverOdds = odds?.get(driver.code);

  return {
    code: driver.code,
    name: driver.name,
    number: driver.number,
    teamName: driver.team.name,
    color: driver.color,
    points: driver.points,
    rarity: rarityForPosition(driver.position),
    attributes: buildAttributes(driver, grid, racesRun),
    moves: pickMoves(driver, racesRun),
    flavorText: buildFlavorText(driver),
    titleChance: driverOdds?.champion ?? null,
    cardNumber: `${driver.position}/${grid.length}`,
  };
}
