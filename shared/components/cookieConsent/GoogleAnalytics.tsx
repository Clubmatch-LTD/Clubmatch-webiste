'use client'

import Script from 'next/script'
import { useCookieConsent } from '@/shared/components/cookieConsent/CookieConsentProvider'

function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const { analyticsAllowed } = useCookieConsent()

  if (!measurementId || !analyticsAllowed) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  )
}

export default GoogleAnalytics
