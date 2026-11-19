import { useMemo, useState } from 'react';
import { Section } from '../../components/ui/Section';
import { DriverCard } from './DriverCard';
import styles from './DriverGrid.module.css';

const ALL_TEAMS = '';

export function DriverGrid({ drivers, teams }) {
  const [teamId, setTeamId] = useState(ALL_TEAMS);

  const visibleDrivers = useMemo(
    () => (teamId === ALL_TEAMS ? drivers : drivers.filter((d) => d.team.id === teamId)),
    [drivers, teamId],
  );

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
    <Section id="pilotos" title="O grid" description="Todos os pilotos da temporada, com foto, posição e campanha." aside={filter}>
      <div className={styles.grid}>
        {visibleDrivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>
    </Section>
  );
}
