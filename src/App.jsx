import { NavBar } from './components/layout/NavBar';
import { StatusMessage } from './components/ui/StatusMessage';
import { SeasonDashboard } from './features/dashboard/SeasonDashboard';
import { useSeason } from './hooks/useSeason';

const NAV_LINKS = [
  { id: 'resumo', label: 'Resumo' },
  { id: 'classificacao', label: 'Classificação' },
  { id: 'probabilidades', label: 'Probabilidades' },
  { id: 'pilotos', label: 'Pilotos' },
  { id: 'equipes', label: 'Equipes' },
  { id: 'calendario', label: 'Calendário' },
];

function Content() {
  const { status, data, summary, error, reload } = useSeason();

  if (status === 'loading') {
    return <StatusMessage title="Carregando a temporada…" detail="Buscando classificação, calendário e resultados." />;
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

  return <SeasonDashboard season={data} summary={summary} />;
}

export default function App() {
  return (
    <>
      <NavBar links={NAV_LINKS} />
      <Content />
    </>
  );
}
