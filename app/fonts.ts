import { Gabarito, Rethink_Sans as RethinkSans, Inter, Manrope, Work_Sans as WorkSans, Nunito_Sans as NunitoSans, Open_Sans as OpenSans, Lato, Merriweather } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  subsets: ['latin']
})

export const gabarito = Gabarito({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-gabarito',
  subsets: ['latin']
})

export const rethinkSans = RethinkSans({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-rethink-sans',
  subsets: ['latin']
})

export const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  subsets: ['latin']
})

export const workSans = WorkSans({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-work-sans',
  subsets: ['latin']
})

export const nunitoSans = NunitoSans({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito-sans',
  subsets: ['latin']
})

export const openSans = OpenSans({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-open-sans',
  subsets: ['latin']
})

export const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
  subsets: ['latin']
})

export const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  subsets: ['latin']
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
  display: 'swap'
})
