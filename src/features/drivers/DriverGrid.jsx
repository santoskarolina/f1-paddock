import { useCallback, useMemo, useState } from 'react';
import { Section } from '../../components/ui/Section';
import { buildDriverCard } from '../../domain/driverCard';
import { DriverCardDialog } from '../driverCard/DriverCardDialog';
import { DriverCard } from './DriverCard';
import styles from './DriverGrid.module.css';

const ALL_TEAMS = '';

export function DriverGrid({ drivers, teams, odds, summary }) {
  const [teamId, setTeamId] = useState(ALL_TEAMS);
  const [selectedId, setSelectedId] = useState(null);

  const visibleDrivers = useMemo(
    () => (teamId === ALL_TEAMS ? drivers : drivers.filter((d) => d.team.id === teamId)),
    [drivers, teamId],
  );

  const selectedIndex = visibleDrivers.findIndex((d) => d.id === selectedId);
  const selectedDriver = visibleDrivers[selectedIndex] ?? null;

  const card = useMemo(
    () =>
      selectedDriver &&
      buildDriverCard(selectedDriver, { completedRaces: summary.completedRaces, odds, allDrivers: drivers }),
    [selectedDriver, summary.completedRaces, odds, drivers],
  );

  const close = useCallback(() => setSelectedId(null), []);
  const goTo = (index) => (visibleDrivers[index] ? () => setSelectedId(visibleDrivers[index].id) : undefined);

  const filter = (
    <label className={styles.filter}>
      Equipe
      <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
        <option value={ALL_TEAMS}>Todas as equipes</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>
    </label>
  );

  return (
    <Section
      id="pilotos"
      title="O grid"
      description="Todos os pilotos da temporada. Clique num piloto para abrir a carta colecionável dele."
      aside={filter}
    >
      <div className={styles.grid}>
        {visibleDrivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} onSelect={setSelectedId} />
        ))}
      </div>
      <DriverCardDialog
        driver={selectedDriver}
        card={card}
        onClose={close}
        onPrevious={goTo(selectedIndex - 1)}
        onNext={goTo(selectedIndex + 1)}
      />
    </Section>
  );
}
