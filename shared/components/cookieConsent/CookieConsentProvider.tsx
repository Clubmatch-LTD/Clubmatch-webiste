'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  ALL_CONSENT_CATEGORIES,
  DEFAULT_CONSENT_CATEGORIES,
  allowsAnalytics,
  allowsMediaEmbeds,
  readStoredConsent,
  writeStoredConsent,
  type CookieConsentCategories,
  type CookieConsentState
} from '@/shared/lib/cookieConsent'

type CookieConsentContextValue = {
  ready: boolean
  decided: boolean
  categories: CookieConsentCategories
  bannerOpen: boolean
  chooseOpen: boolean
  analyticsAllowed: boolean
  mediaAllowed: boolean
  openBanner: () => void
  setChooseOpen: (open: boolean) => void
  acceptAll: () => void
  rejectAll: () => void
  acceptSelection: (categories: CookieConsentCategories) => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
)

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }
  return ctx
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [decided, setDecided] = useState(false)
  const [categories, setCategories] = useState<CookieConsentCategories>(
    DEFAULT_CONSENT_CATEGORIES
  )
  const [bannerOpen, setBannerOpen] = useState(false)
  const [chooseOpen, setChooseOpen] = useState(false)

  useEffect(() => {
    const stored = readStoredConsent()
    if (stored?.decided) {
      setDecided(true)
      setCategories(stored.categories)
      setBannerOpen(false)
    } else {
      setBannerOpen(true)
    }
    setReady(true)
  }, [])

  const persist = useCallback((next: CookieConsentState) => {
    writeStoredConsent(next)
    setDecided(next.decided)
    setCategories(next.categories)
    setBannerOpen(false)
    setChooseOpen(false)
  }, [])

  const acceptAll = useCallback(() => {
    persist({ decided: true, categories: ALL_CONSENT_CATEGORIES })
  }, [persist])

  const rejectAll = useCallback(() => {
    persist({ decided: true, categories: DEFAULT_CONSENT_CATEGORIES })
  }, [persist])

  const acceptSelection = useCallback(
    (nextCategories: CookieConsentCategories) => {
      persist({ decided: true, categories: nextCategories })
    },
    [persist]
  )

  const openBanner = useCallback(() => {
    setBannerOpen(true)
  }, [])

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      ready,
      decided,
      categories,
      bannerOpen,
      chooseOpen,
      analyticsAllowed: decided && allowsAnalytics(categories),
      mediaAllowed: decided && allowsMediaEmbeds(categories),
      openBanner,
      setChooseOpen,
      acceptAll,
      rejectAll,
      acceptSelection
    }),
    [
      ready,
      decided,
      categories,
      bannerOpen,
      chooseOpen,
      openBanner,
      acceptAll,
      rejectAll,
      acceptSelection
    ]
  )

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}
