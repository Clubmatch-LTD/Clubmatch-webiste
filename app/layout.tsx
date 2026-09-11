import type { Metadata } from "next";
import { getPageMetadata, getPageSeo } from '@/shared/lib/seo'
import "../assets/scss/global.scss";
import { FONT_VAR_BY_KEY, normalizeFontKey } from '@/shared/theme/font-constants'
import { getSelectedFontVariableClasses } from '@/app/fonts'
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
  const headingFont =
    FONT_VAR_BY_KEY[normalizeFontKey(headingFontKey)] ||
    'system-ui, sans-serif'
  const bodyFont =
    FONT_VAR_BY_KEY[normalizeFontKey(bodyFontKey)] ||
    'system-ui, sans-serif'
  const fontVariableClasses = getSelectedFontVariableClasses(
    headingFontKey,
    bodyFontKey
  )
  const favicon = oDesign.sFavicon || '/favicon.ico'
  const sGoogleAnalyticsId = oDesign.sGoogleAnalyticsId

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontVariableClasses} h-full antialiased`}
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
        <Preloader />
        <Providers googleAnalyticsId={sGoogleAnalyticsId}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
