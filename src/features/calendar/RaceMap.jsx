import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { useMemo } from 'react';
import { feature } from 'topojson-client';
import worldTopology from 'world-atlas/land-110m.json';
import { Flag } from '../../components/ui/Flag';
import { HoverCard } from '../../components/ui/HoverCard';
import { useElementWidth } from '../../hooks/useElementWidth';
import { useHoverCard } from '../../hooks/useHoverCard';
import { formatDay } from '../../utils/format';
import styles from './RaceMap.module.css';

const LAND = feature(worldTopology, worldTopology.objects.land);
const SPHERE = { type: 'Sphere' };
const GRATICULE = geoGraticule10();
const ASPECT_RATIO = 0.52;

function MarkerTooltip({ race }) {
  const winner = race.podium[0];
  return (
    <div className={styles.tooltip}>
      <strong><Flag iso={race.countryIso} />{race.name}</strong>
      <span>Etapa {race.round}, {formatDay(race.startsAt)}</span>
      <span>{winner ? `Vencedor: ${winner.name}` : 'Clique para ver o circuito'}</span>
    </div>
  );
}

/** Mapa-múndi com as etapas na ordem do calendário. Clicar num ponto abre os detalhes da corrida. */
export default function RaceMap({ races, selectedRound, onSelect }) {
  const { ref, width } = useElementWidth();
  const { containerRef, card, show, hide } = useHoverCard();
  const height = Math.round(width * ASPECT_RATIO);

  const { path, markers, route } = useMemo(() => {
    const projection = geoNaturalEarth1().fitSize([width, height], SPHERE);
    const located = races.filter((race) => race.location);
    return {
      path: geoPath(projection),
      markers: located.map((race) => ({ race, point: projection([race.location.lon, race.location.lat]) })),
      route: { type: 'LineString', coordinates: located.map(({ location }) => [location.lon, location.lat]) },
    };
  }, [races, width, height]);

  return (
    <div
      ref={(node) => { ref.current = node; containerRef.current = node; }}
      className={styles.wrapper}
    >
      {width > 0 && (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Mapa das etapas da temporada">
          <path className={styles.sphere} d={path(SPHERE)} />
          <path className={styles.graticule} d={path(GRATICULE)} />
          <path className={styles.land} d={path(LAND)} />
          <path className={styles.route} d={path(route)} />
          {markers.map(({ race, point: [x, y] }) => (
            <g
              key={race.round}
              className={`${styles.marker} ${styles[race.status]}`}
              transform={`translate(${x},${y})`}
              style={{ '--team': race.podium[0]?.color ?? 'var(--accent)' }}
              role="button"
              tabIndex={0}
              aria-label={`${race.name}, etapa ${race.round}`}
              aria-pressed={race.round === selectedRound}
              onClick={() => onSelect(race.round)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(race.round)}
              onPointerMove={(e) => show(e, <MarkerTooltip race={race} />)}
              onPointerLeave={hide}
            >
              {race.status === 'next' && <circle className={styles.pulse} r={8} />}
              <circle className={styles.dot} r={race.round === selectedRound ? 7 : 5} />
            </g>
          ))}
        </svg>
      )}
      <HoverCard card={card} containerRef={containerRef} />
    </div>
  );
}
