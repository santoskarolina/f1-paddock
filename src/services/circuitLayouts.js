/**
 * Traçados dos circuitos (GeoJSON do projeto bacinger/f1-circuits, licença MIT).
 * O arquivo é carregado sob demanda para não pesar no bundle inicial.
 */

const MAX_MATCH_DISTANCE_KM = 5;
const EARTH_RADIUS_KM = 6371;

/**
 * @typedef {{ id: string, name: string, location: string, opened: number, firstGp: number,
 *   lengthMeters: number, altitudeMeters: number, coordinates: [number, number][] }} CircuitLayout
 */

const toRadians = (deg) => (deg * Math.PI) / 180;

function distanceKm(a, b) {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function centroid(coordinates) {
  const sum = coordinates.reduce((acc, [lon, lat]) => ({ lon: acc.lon + lon, lat: acc.lat + lat }), { lon: 0, lat: 0 });
  return { lon: sum.lon / coordinates.length, lat: sum.lat / coordinates.length };
}

let layoutsPromise = null;

/** @returns {Promise<Array<CircuitLayout & { center: {lat: number, lon: number} }>>} */
export function loadCircuitLayouts() {
  layoutsPromise ??= import('../data/circuits.json').then(({ default: layouts }) =>
    layouts.map((layout) => ({ ...layout, center: centroid(layout.coordinates) })),
  );
  return layoutsPromise;
}

/**
 * Encontra o traçado mais próximo das coordenadas do circuito.
 * Casar por posição evita depender de IDs diferentes entre as fontes.
 */
export function findLayout(layouts, location) {
  if (!location) return null;

  let best = null;
  let bestDistance = Infinity;
  for (const layout of layouts) {
    const distance = distanceKm(location, layout.center);
    if (distance < bestDistance) {
      best = layout;
      bestDistance = distance;
    }
  }
  return bestDistance <= MAX_MATCH_DISTANCE_KM ? best : null;
}
