export const FONT_VAR_BY_KEY: Record<string, string> = {
  satoshi: 'var(--font-satoshi)',
  gabarito: 'var(--font-gabarito)',
  rethinksans: 'var(--font-rethink-sans)',
  inter: 'var(--font-inter)',
  manrope: 'var(--font-manrope)',
  worksans: 'var(--font-work-sans)',
  nunitosans: 'var(--font-nunito-sans)',
  opensans: 'var(--font-open-sans)',
  lato: 'var(--font-lato)',
  merriweather: 'var(--font-merriweather)'
}

export function normalizeFontKey(v: string) {
  return v.toLowerCase().replace(/[\s_-]+/g, '')
}

// Tailwind expects arrays of font-family values.
export const TAILWIND_FONT_FAMILY: Record<string, string[]> = {
  gabarito: [FONT_VAR_BY_KEY.gabarito],
  satoshi: [FONT_VAR_BY_KEY.satoshi],
  rethinkSans: [FONT_VAR_BY_KEY.rethinksans],
  inter: [FONT_VAR_BY_KEY.inter],
  manrope: [FONT_VAR_BY_KEY.manrope],
  workSans: [FONT_VAR_BY_KEY.worksans],
  nunitoSans: [FONT_VAR_BY_KEY.nunitosans],
  openSans: [FONT_VAR_BY_KEY.opensans],
  lato: [FONT_VAR_BY_KEY.lato],
  merriweather: [FONT_VAR_BY_KEY.merriweather]
}
