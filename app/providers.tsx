/* eslint-disable react/no-children-prop */
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'
import CookieBanner from '@/shared/components/cookieConsent/CookieBanner'
import { CookieConsentProvider } from '@/shared/components/cookieConsent/CookieConsentProvider'
import GoogleAnalytics from '@/shared/components/cookieConsent/GoogleAnalytics'

export default function Providers({
  children,
  googleAnalyticsId
}: {
  children: React.ReactNode
  googleAnalyticsId?: string | null
}) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <CookieConsentProvider>
        <NextTopLoader
          color="var(--primary-color)"
          height={4}
          showSpinner={false}
          shadow="0 0 8px var(--primary-color)"
          zIndex={100}
        />
        {googleAnalyticsId ? (
          <GoogleAnalytics measurementId={googleAnalyticsId} />
        ) : null}
        {children}
        <CookieBanner />
      </CookieConsentProvider>
    </QueryClientProvider>
  )
}
