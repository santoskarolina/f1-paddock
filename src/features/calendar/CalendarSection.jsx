import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { Section } from '../../components/ui/Section';
import { RaceCalendar } from './RaceCalendar';
import { RaceDetail } from './RaceDetail';
import styles from './CalendarSection.module.css';

// O mapa (e o contorno dos continentes) só é baixado quando a seção é renderizada.
const RaceMap = lazy(() => import('./RaceMap'));

export function CalendarSection({ races, drivers }) {
  const [selectedRound, setSelectedRound] = useState(null);

  const driversByCode = useMemo(() => new Map(drivers.map((d) => [d.code, d])), [drivers]);
  const selectedIndex = races.findIndex((race) => race.round === selectedRound);
  const selectedRace = races[selectedIndex] ?? null;

  const close = useCallback(() => setSelectedRound(null), []);
  const goTo = (index) => (races[index] ? () => setSelectedRound(races[index].round) : undefined);

  return (
    <Section
      id="calendario"
      title="Calendário e circuitos"
      description="Clique numa etapa, no mapa ou na lista, para ver o traçado animado, os dados do circuito e o pódio."
    >
      <Suspense fallback={<div className={styles.mapPlaceholder} />}>
        <RaceMap races={races} selectedRound={selectedRound} onSelect={setSelectedRound} />
      </Suspense>
      <RaceCalendar races={races} selectedRound={selectedRound} onSelect={setSelectedRound} />
      <RaceDetail
        race={selectedRace}
        driversByCode={driversByCode}
        onClose={close}
        onPrevious={goTo(selectedIndex - 1)}
        onNext={goTo(selectedIndex + 1)}
      />
    </Section>
  );
}
