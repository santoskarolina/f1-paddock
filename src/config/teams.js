/** Cores de reserva por constructorId da Jolpica (a cor vinda da OpenF1 tem prioridade). */
const TEAM_COLORS = {
  mercedes: '#00d2be',
  ferrari: '#dc0000',
  red_bull: '#3671c6',
  mclaren: '#ff8000',
  rb: '#6c98ff',
  alpine: '#ff87bc',
  haas: '#9aa0a6',
  audi: '#bb0a30',
  sauber: '#52e252',
  williams: '#37bedd',
  aston_martin: '#229971',
  cadillac: '#c8a951',
};

export const FALLBACK_COLOR = '#8a8d99';

export const teamColor = (constructorId) => TEAM_COLORS[constructorId] ?? FALLBACK_COLOR;
