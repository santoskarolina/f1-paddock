const LOCALE = 'pt-BR';

const integer = new Intl.NumberFormat(LOCALE);
const shortDay = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: 'short' });
const longDateTime = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit',
});

export const formatNumber = (value) => integer.format(value);
export const formatDay = (date) => shortDay.format(date);
export const formatDateTime = (date) => longDateTime.format(date);

export function formatPercent(value) {
  if (value > 0 && value < 1) return '<1%';
  return `${Math.round(value)}%`;
}

export const formatGap = (gap) => (gap === 0 ? 'líder' : `−${formatNumber(gap)}`);
