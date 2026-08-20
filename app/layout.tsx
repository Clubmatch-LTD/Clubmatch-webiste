import type { Metadata } from "next";
import Script from "next/script";
import { getPageMetadata, getPageSeo } from '@/shared/lib/seo'
import "../assets/scss/global.scss";
import { FONT_VAR_BY_KEY, normalizeFontKey } from '@/shared/theme/font-constants'
import { gabarito, rethinkSans, satoshi, inter, manrope, workSans, nunitoSans, openSans, lato, merriweather } from '@/app/fonts'
import Preloader from "@/shared/ui/loaders/Preloader";
import Providers from "./providers";

const defaultMetadata = {
  title: 'Clubmatch',
  description: 'Clubmatch',
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(defaultMetadata)
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = await getPageSeo<any>()
  const oDesign = seo?.oDesign || {}
  const primaryColor = oDesign.sPrimaryColor || '#5a8408'
  const headingFontKey = oDesign.eHeadingFont || ''
  const bodyFontKey = oDesign.eBodyFont || ''
  const headingFont = FONT_VAR_BY_KEY[normalizeFontKey(headingFontKey)] || ''
  const bodyFont = FONT_VAR_BY_KEY[normalizeFontKey(bodyFontKey)] || ''
  const favicon = oDesign.sFavicon || '/favicon.ico'
  const sGoogleAnalyticsId = oDesign.sGoogleAnalyticsId

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${gabarito.variable} ${rethinkSans.variable} ${satoshi.variable} ${inter.variable} ${manrope.variable} ${workSans.variable} ${nunitoSans.variable} ${openSans.variable} ${lato.variable} ${merriweather.variable} h-full antialiased`}
    >
      <head suppressHydrationWarning>
        <link rel="icon" href={favicon} sizes="any" />
        <style>{`
          :root {
            --primary-color: ${primaryColor};
            --heading-font: ${headingFont};
            --body-font: ${bodyFont};
          }
          body { font-family: var(--body-font); }
          .heading-font { font-family: var(--heading-font); }
          .main-bg { background-color: var(--primary-color); }
          .text-main{color: var(--primary-color);}
          .text-hover:hover{color: var(--primary-color);}
        `}</style>
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {sGoogleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${sGoogleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${sGoogleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        <Preloader />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
