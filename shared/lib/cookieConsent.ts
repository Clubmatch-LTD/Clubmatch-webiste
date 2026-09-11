export const COOKIE_CONSENT_STORAGE_KEY = 'clubmatch-cookie-consent-v1'

export type CookieConsentCategories = {
  functionality: boolean
  adStorage: boolean
  adPersonalisation: boolean
  securityStorage: boolean
  analyticsStorage: boolean
  adUserData: boolean
  personalisationStorage: boolean
}

export type CookieConsentState = {
  decided: boolean
  categories: CookieConsentCategories
}

export const DEFAULT_CONSENT_CATEGORIES: CookieConsentCategories = {
  functionality: false,
  adStorage: false,
  adPersonalisation: false,
  securityStorage: false,
  analyticsStorage: false,
  adUserData: false,
  personalisationStorage: false
}

export const ALL_CONSENT_CATEGORIES: CookieConsentCategories = {
  functionality: true,
  adStorage: true,
  adPersonalisation: true,
  securityStorage: true,
  analyticsStorage: true,
  adUserData: true,
  personalisationStorage: true
}

export const COOKIE_CATEGORY_COLUMNS: {
  key: keyof CookieConsentCategories
  label: string
}[][] = [
  [
    { key: 'functionality', label: 'Functionality' },
    { key: 'adStorage', label: 'Ad Storage' },
    { key: 'adPersonalisation', label: 'Ad Personalisation' },
    { key: 'securityStorage', label: 'Security Storage' }
  ],
  [
    { key: 'analyticsStorage', label: 'Analytics Storage' },
    { key: 'adUserData', label: 'Ad User Data' },
    { key: 'personalisationStorage', label: 'Personalisation Storage' }
  ]
]

export const COOKIE_CATEGORY_OPTIONS = COOKIE_CATEGORY_COLUMNS.flat()

export function allowsAnalytics(categories: CookieConsentCategories) {
  return !!categories.analyticsStorage
}

/** YouTube / third-party media embeds need marketing or personalisation consent. */
export function allowsMediaEmbeds(categories: CookieConsentCategories) {
  return !!(
    categories.adStorage ||
    categories.adPersonalisation ||
    categories.personalisationStorage
  )
}

export function readStoredConsent(): CookieConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CookieConsentState
    if (!parsed || typeof parsed.decided !== 'boolean' || !parsed.categories) {
      return null
    }
    return {
      decided: parsed.decided,
      categories: { ...DEFAULT_CONSENT_CATEGORIES, ...parsed.categories }
    }
  } catch {
    return null
  }
}

export function writeStoredConsent(state: CookieConsentState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(state))
}
