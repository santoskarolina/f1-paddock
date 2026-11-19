import { useEffect } from 'react';
import { NavBar } from './components/layout/NavBar';
import { StatusMessage } from './components/ui/StatusMessage';
import { SeasonDashboard } from './features/dashboard/SeasonDashboard';
import { RaceCarLoader } from './features/loading/RaceCarLoader';
import { SeasonPicker } from './features/seasonPicker/SeasonPicker';
import { useSeason } from './hooks/useSeason';
import { useSelectedSeason } from './hooks/useSelectedSeason';

const NAV_LINKS = [
  { id: 'resumo', label: 'Resumo' },
  { id: 'classificacao', label: 'Classificação' },
  { id: 'probabilidades', label: 'Probabilidades' },
  { id: 'pilotos', label: 'Pilotos' },
  { id: 'equipes', label: 'Equipes' },
  { id: 'calendario', label: 'Calendário' },
];

function Content({ season, status, data, summary, error, reload }) {
  if (status === 'loading') {
    return (
      <StatusMessage
        visual={<RaceCarLoader />}
        title={`Carregando a temporada ${season}…`}
        detail="Buscando classificação, calendário e resultados."
      />
    );
  }

  if (status === 'error') {
    return (
      <StatusMessage
        title="Não foi possível carregar os dados"
        detail={error.message}
        actionLabel="Tentar de novo"
        onAction={reload}
      />
    );
  }

  if (data.drivers.length === 0) {
    return (
      <StatusMessage
        title={`A temporada ${season} ainda não tem resultados`}
        detail="Escolha outra temporada no seletor do topo."
      />
    );
  }

  return <SeasonDashboard season={data} summary={summary} />;
}

export default function App() {
  const [season, setSeason] = useSelectedSeason();
  const seasonState = useSeason(season);

  useEffect(() => {
    document.title = `Paddock Stats`;
  }, [season]);

  return (
    <>
      <NavBar links={NAV_LINKS}>
        <SeasonPicker season={season} onChange={setSeason} disabled={seasonState.status === 'loading'} />
      </NavBar>
      <Content season={season} {...seasonState} />
    </>
  );
}
