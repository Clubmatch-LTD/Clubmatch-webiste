import { Gabarito, Rethink_Sans as RethinkSans, Inter, Manrope, Work_Sans as WorkSans, Nunito_Sans as NunitoSans, Open_Sans as OpenSans, Lato, Merriweather } from 'next/font/google'
import localFont from 'next/font/local'
import { normalizeFontKey } from '@/shared/theme/font-constants'

// preload: false — only families applied on <html> / used in CSS are fetched
export const inter = Inter({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  preload: false
})

export const gabarito = Gabarito({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-gabarito',
  subsets: ['latin'],
  display: 'swap',
  preload: false
})

export const rethinkSans = RethinkSans({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-rethink-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: false
})

export const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
  preload: false
})

export const workSans = WorkSans({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-work-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: false
})

export const nunitoSans = NunitoSans({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: false
})

export const openSans = OpenSans({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-open-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: false
})

export const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
  subsets: ['latin'],
  display: 'swap',
  preload: false
})

export const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  subsets: ['latin'],
  display: 'swap',
  preload: false
})

export const satoshi = localFont({
  src: [
    {
      path: '../assets/font/Satoshi-Light.woff2',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../assets/font/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../assets/font/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../assets/font/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../assets/font/Satoshi-Black.woff2',
      weight: '900',
      style: 'normal'
    }
  ],
  variable: '--font-satoshi',
  display: 'swap',
  preload: false
})

const FONT_BY_KEY: Record<string, { variable: string }> = {
  inter,
  gabarito,
  rethinksans: rethinkSans,
  manrope,
  worksans: workSans,
  nunitosans: nunitoSans,
  opensans: openSans,
  lato,
  merriweather,
  satoshi
}

/** CSS variable classes for only the club's heading/body fonts (avoids loading unused families). */
export function getSelectedFontVariableClasses(
  headingFontKey?: string | null,
  bodyFontKey?: string | null
) {
  return [...new Set([headingFontKey, bodyFontKey].map((key) => normalizeFontKey(key || '')))]
    .map((key) => FONT_BY_KEY[key]?.variable)
    .filter(Boolean)
    .join(' ')
}
