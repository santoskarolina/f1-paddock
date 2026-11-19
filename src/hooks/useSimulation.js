import { useMemo } from 'react';
import { simulateChampionship } from '../domain/simulation';

export function useSimulation(drivers, summary) {
  const { completedRaces, remainingRaces, remainingSprints } = summary;

  return useMemo(
    () => simulateChampionship({ drivers, completedRaces, remainingRaces, remainingSprints }),
    [drivers, completedRaces, remainingRaces, remainingSprints],
  );
}
