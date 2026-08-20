import type { Config } from "tailwindcss";
import { TAILWIND_FONT_FAMILY } from "./shared/theme/font-constants";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: TAILWIND_FONT_FAMILY,
    screens: {
      xxl: { min: '1900px' },
      xl: { min: '1400px', max: '1700px' },
      lg: { min: '1200px', max: '1399px' },
      md: { min: '992px', max: '1199px' },
      sm: { min: '768px', max: '991px' },
      ssm: { min: '992px' },
      mxsm: { max: '991px' },
      msm: { min: '768px' },
      mxs: { max: '767px' },
      xs: { min: '576px', max: '767px' },
      xxs: { max: '575px' }
    },
    colors: {
      black: {
        DEFAULT: '#000000'
      },
      primary: {
        DEFAULT: '#9BCA3E',
        50: '#F5FFE2',
        100: '#E9FFBD',
        150: '#ECF9D2',
        200: '#D1FF75',
        300: '#B5E357',
        400: '#9AC83D',
        450: '#80AE22',
        500: '#6F9E11',
        550: '#659508',
        600: '#4F7700',
        700: '#3C5A00',
        800: '#283D00',
        900: '#172200',
        950: '#0C1200',
        980: '#899F5D'
      },
      light: {
        75: '#EFF9F9',
        100: '#EAF4F4',
        150: '#E1E1E1',
        200: '#DBE5E5',
        300: '#BFC9C9',
        400: '#A4AEAE',
        450: '#8A9494'
      },
      neutral: {
        black: '#000000',
        dark: '#4F5959',
        medium: '#869698',
        light: '#B2BBBD',
        white: '#ffffff'
      },
      dark: {
        950: '#071111',
        900: '#141E1E',
        800: '#293333',
        700: '#404A4A',
        600: '#576161',
        550: '#707A7A',
        passthrough: '#BEC9C9'
      },
      danger: {
        DEFAULT: '#EB3B5A',
        100: '#FFEAEE',
        250: '#FFC3CD',
        400: '#FF8499',
        600: '#BF0F2E',
        750: '#96001A',
        900: '#55000F'
      },
      neutralLight: '#B2BBBD',
      neturalDark: '#4F5959',
      neturalMedium: '#869698',
      white: '#FFFFFF',
      currentcolor: 'currentcolor',
      transparent: 'transparent',
      light200: '#E2E2E2',
      danger100: '#ffeaee',
      primary500: '#E9FFBD'
    },
    boxShadow: {
      box: '0px 32px 64px 0px rgba(55, 82, 0, 0.12)'
    },
    extend: {
      backgroundImage: {
        'gradient-overlay':
          'linear-gradient(90deg,rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 7%, rgba(0, 0, 0, 0.98) 13%, rgba(0, 0, 0, 0.96) 20%, rgba(0, 0, 0, 0.93) 27%, rgba(0, 0, 0, 0.88) 33%, rgba(0, 0, 0, 0.83) 40%, rgba(0, 0, 0, 0.78) 47%, rgba(0, 0, 0, 0.72) 53%, rgba(0, 0, 0, 0.67) 60%, rgba(0, 0, 0, 0.62) 67%, rgba(0, 0, 0, 0.57) 73%, rgba(0, 0, 0, 0.54) 80%, rgba(0, 0, 0, 0.52) 87%, rgba(0, 0, 0, 0.5) 93%, rgba(0, 0, 0, 0.5) 100%)',
        'gradient-active':
          'linear-gradient(90deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.98) 7%, rgba(255, 255, 255, 0.96) 13%, rgba(255, 255, 255, 0.93) 20%, rgba(255, 255, 255, 0.88) 27%, rgba(255, 255, 255, 0.83) 33%, rgba(255, 255, 255, 0.78) 40%, rgba(255, 255, 255, 0.72) 47%, rgba(255, 255, 255, 0.67) 53%, rgba(255, 255, 255, 0.62) 60%, rgba(255, 255, 255, 0.57) 67%, rgba(255, 255, 255, 0.54) 73%, rgba(255, 255, 255, 0.52) 80%, rgba(255, 255, 255, 0.5) 87%, rgba(255, 255, 255, 0.5) 93%, rgba(255, 255, 255, 0.5) 100%)',
        'footer-gradient':
          'linear-gradient(180deg,rgba(236, 249, 210, 0) 0%, rgba(236, 249, 210, 0.01) 7%, rgba(236, 249, 210, 0.04) 13%, rgba(236, 249, 210, 0.08) 20%, rgba(236, 249, 210, 0.15) 27%, rgba(236, 249, 210, 0.23) 33%, rgba(236, 249, 210, 0.33) 40%, rgba(236, 249, 210, 0.44) 47%, rgba(236, 249, 210, 0.56) 53%, rgba(236, 249, 210, 0.67) 60%, rgba(236, 249, 210, 0.77) 67%, rgba(236, 249, 210, 0.86) 73%, rgba(236, 249, 210, 0.92) 80%, rgba(236, 249, 210, 0.96) 87%, rgba(236, 249, 210, 0.99) 93%, rgba(236, 249, 210, 1) 100%)',
        'video-gradient':
          ' linear-gradient(180deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.01) 7%, rgba(255, 255, 255, 0.04) 13%, rgba(255, 255, 255, 0.08) 20%, rgba(255, 255, 255, 0.15) 27%, rgba(255, 255, 255, 0.23) 33%, rgba(255, 255, 255, 0.33) 40%, rgba(255, 255, 255, 0.44) 47%, rgba(255, 255, 255, 0.56) 53%, rgba(255, 255, 255, 0.67) 60%, rgba(255, 255, 255, 0.77) 67%, rgba(255, 255, 255, 0.86) 73%, rgba(255, 255, 255, 0.92) 80%, rgba(255, 255, 255, 0.96) 87%, rgba(255, 255, 255, 0.99) 93%, rgba(255, 255, 255, 1) 100%)'
      },
      keyframes: {
        cmFadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        cmRingPulse: {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '100%': { transform: 'scale(1.55)', opacity: '0' }
        },
        cmIconSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        cmFadeUp: 'cmFadeUp 0.7s ease-out both',
        cmRingPulse: 'cmRingPulse 2.2s ease-out infinite',
        cmIconSpin: 'cmIconSpin 8s linear infinite'
      }
    }
  },
  plugins: []
}

export default config;

