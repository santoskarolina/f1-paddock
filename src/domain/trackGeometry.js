/**
 * Projeta coordenadas [lon, lat] de um traçado em pontos de tela que cabem em width × height.
 * Usa projeção equirretangular corrigida pela latitude média: suficiente para a escala de um circuito.
 */
export function projectTrack(coordinates, { width, height, padding = 8 }) {
  const meanLat = coordinates.reduce((sum, [, lat]) => sum + lat, 0) / coordinates.length;
  const lonScale = Math.cos((meanLat * Math.PI) / 180);
  const planar = coordinates.map(([lon, lat]) => [lon * lonScale, -lat]);

  const xs = planar.map(([x]) => x);
  const ys = planar.map(([, y]) => y);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const scale = Math.min((width - 2 * padding) / spanX, (height - 2 * padding) / spanY);
  const offsetX = (width - spanX * scale) / 2;
  const offsetY = (height - spanY * scale) / 2;

  return planar.map(([x, y]) => [offsetX + (x - minX) * scale, offsetY + (y - minY) * scale]);
}

export function toSvgPath(points, { closed = true } = {}) {
  const [first, ...rest] = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`);
  return `M${first}${rest.map((p) => `L${p}`).join('')}${closed ? 'Z' : ''}`;
}
