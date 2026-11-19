import { Section } from '../../components/ui/Section';
import { ProbabilityList } from './ProbabilityList';

export function ProbabilityPanel({ drivers, odds, summary }) {
  const nextRaceName = summary.nextRace?.name;

  return (
    <Section
      id="probabilidades"
      title="Probabilidades"
      description="Estimativas de um modelo que simula milhares de vezes as etapas restantes com base no ritmo de pontos da temporada."
    >
      {summary.isTitleDecided ? (
        <ProbabilityList title="Chance de terminar como vice-campeão" drivers={drivers} odds={odds} metric="runnerUp" limit={6} />
      ) : (
        <ProbabilityList title="Chance de ser campeão" drivers={drivers} odds={odds} metric="champion" limit={6} />
      )}
      {nextRaceName && (
        <ProbabilityList title={`Chance de vencer: ${nextRaceName}`} drivers={drivers} odds={odds} metric="winNext" limit={8} />
      )}
    </Section>
  );
}
