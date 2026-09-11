'use client'

import { useEffect, useState } from 'react'
import { NEXT_PUBLIC_PRIVACY_LINK } from '@/shared/constant'
import {
  COOKIE_CATEGORY_COLUMNS,
  type CookieConsentCategories
} from '@/shared/lib/cookieConsent'
import { useCookieConsent } from './CookieConsentProvider'

function ExternalArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="inline-block ml-1 align-[-1px]"
    >
      <path
        d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CookieBanner() {
  const {
    bannerOpen,
    chooseOpen,
    categories,
    setChooseOpen,
    acceptAll,
    rejectAll,
    acceptSelection
  } = useCookieConsent()

  const [draft, setDraft] = useState<CookieConsentCategories>(categories)

  useEffect(() => {
    if (bannerOpen) setDraft(categories)
  }, [bannerOpen, categories])

  if (!bannerOpen) return null

  const toggleCategory = (key: keyof CookieConsentCategories) => {
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex justify-end pointer-events-none mxs:inset-x-3 mxs:bottom-3">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        className="pointer-events-auto w-full max-w-[520px] rounded-[20px] overflow-hidden text-white main-bg shadow-[0_16px_48px_rgba(0,0,0,0.28)]"
      >
        <div className="p-7 mxs:p-5">
          <h2
            id="cookie-settings-title"
            className="text-[28px]/[34px] mxs:text-2xl font-bold heading-font"
          >
            Cookie Settings
          </h2>
          <p className="mt-3 text-[15px] mxs:text-sm leading-relaxed text-white font-medium">
            We use cookies to provide you with the best possible experience. They
            also allow us to analyse user behaviour in order to constantly improve
            the website for you.{' '}
            <a
              href={NEXT_PUBLIC_PRIVACY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-90"
            >
              See our privacy policy
              <ExternalArrowIcon />
            </a>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={rejectAll}
              className="rounded-full border border-white px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              Reject all
            </button>
            <button
              type="button"
              onClick={() => setChooseOpen(!chooseOpen)}
              className="rounded-full border border-white px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              aria-expanded={chooseOpen}
            >
              I want to choose
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[color:var(--primary-color)] hover:bg-white/90 transition-colors"
            >
              Accept all
            </button>
          </div>
        </div>

        {chooseOpen ? (
          <div className="bg-black/30 px-7 py-6 mxs:px-5">
            <h3 className="text-xl font-bold heading-font mb-5">I want to choose</h3>
            <div className="grid grid-cols-2 mxs:grid-cols-1 gap-x-10 gap-y-4">
              {COOKIE_CATEGORY_COLUMNS.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                  {column.map(({ key, label }) => {
                    const checked = draft[key]
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleCategory(key)}
                        className="flex items-center gap-3 text-left text-sm font-medium text-white"
                      >
                        <span
                          className={`w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center shrink-0 ${
                            checked ? 'bg-[color:var(--primary-color)]' : 'bg-transparent'
                          }`}
                          aria-hidden
                        >
                          {checked ? (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path
                                d="M2.5 6.2L4.8 8.5L9.5 3.5"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </span>
                        <span>{label}</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => acceptSelection(draft)}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[color:var(--primary-color)] hover:bg-white/90 transition-colors"
              >
                Accept selection
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CookieBanner
