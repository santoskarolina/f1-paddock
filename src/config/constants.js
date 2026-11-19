export const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1';
export const OPENF1_BASE_URL = 'https://api.openf1.org/v1';

/** "current" sempre aponta para a temporada em andamento. */
export const SEASON = 'current';

export const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
export const SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1];

export const CACHE_TTL_MS = 10 * 60 * 1000;

export const SIMULATION = {
  iterations: 10_000,
  /** Quanto maior, mais o favorito domina cada corrida simulada. */
  strengthExponent: 3,
  /** Piso de força para que ninguém tenha chance exatamente zero. */
  strengthFloor: 0.3,
  /** Semente fixa: os números não "pulam" a cada renderização. */
  seed: 2026,
};
