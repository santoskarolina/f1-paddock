const NATIONALITY_TO_ISO = {
  American: 'US', Argentine: 'AR', Argentinian: 'AR', Australian: 'AU', Austrian: 'AT',
  Belgian: 'BE', Brazilian: 'BR', British: 'GB', Canadian: 'CA', Chinese: 'CN',
  Danish: 'DK', Dutch: 'NL', Finnish: 'FI', French: 'FR', German: 'DE',
  Italian: 'IT', Japanese: 'JP', Mexican: 'MX', Monegasque: 'MC', 'New Zealander': 'NZ',
  Polish: 'PL', Spanish: 'ES', Swiss: 'CH', Thai: 'TH',
};

const COUNTRY_TO_ISO = {
  Australia: 'AU', Austria: 'AT', Azerbaijan: 'AZ', Bahrain: 'BH', Belgium: 'BE',
  Brazil: 'BR', Canada: 'CA', China: 'CN', Hungary: 'HU', Italy: 'IT', Japan: 'JP',
  Malaysia: 'MY', Mexico: 'MX', Monaco: 'MC', Netherlands: 'NL', Qatar: 'QA',
  'Saudi Arabia': 'SA', Singapore: 'SG', Spain: 'ES', UAE: 'AE', UK: 'GB',
  USA: 'US', 'United States': 'US',
};

export const nationalityToIso = (nationality) => NATIONALITY_TO_ISO[nationality] ?? null;
export const countryToIso = (country) => COUNTRY_TO_ISO[country] ?? null;

/** Converte "BR" em 🇧🇷 usando os indicadores regionais do Unicode. */
export function isoToFlag(iso) {
  if (!iso || iso.length !== 2) return '';
  const REGIONAL_INDICATOR_OFFSET = 127397;
  return String.fromCodePoint(...[...iso.toUpperCase()].map((c) => REGIONAL_INDICATOR_OFFSET + c.charCodeAt(0)));
}
