import { useSimulation } from '../../hooks/useSimulation';
import { CalendarSection } from '../calendar/CalendarSection';
import { DriverGrid } from '../drivers/DriverGrid';
import { Hero } from '../hero/Hero';
import { SeasonTiles } from '../hero/SeasonTiles';
import { ProbabilityPanel } from '../probabilities/ProbabilityPanel';
import { SeasonStrip } from '../season/SeasonStrip';
import { TimingTower } from '../standings/TimingTower';
import { ConstructorsStandings } from '../teams/ConstructorsStandings';
import { TeammateDuels } from '../teams/TeammateDuels';
import { MethodNote } from './MethodNote';
import styles from './SeasonDashboard.module.css';

export function SeasonDashboard({ season, summary }) {
  const { drivers, teams, races } = season;
  const odds = useSimulation(drivers, summary);

  return (
    <main className={styles.page}>
      <Hero summary={summary} />
      <SeasonTiles summary={summary} />
      <SeasonStrip races={races} />

      <div className={styles.split}>
        <TimingTower drivers={drivers} odds={odds} />
        <ProbabilityPanel drivers={drivers} odds={odds} summary={summary} />
      </div>

      <DriverGrid drivers={drivers} teams={teams} odds={odds} summary={summary} />

      <div className={styles.split}>
        <ConstructorsStandings teams={teams} />
        <TeammateDuels drivers={drivers} teams={teams} odds={odds} />
      </div>

      <CalendarSection races={races} drivers={drivers} />
      <MethodNote />
    </main>
  );
}
