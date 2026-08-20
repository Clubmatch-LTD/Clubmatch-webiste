import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_S3_PREFIX } from '@/shared/constant'
import { seoApi } from '@/api/seo/seo.api'
import { clubWebsiteApi } from '@/api/club-website/club-website.api'

const SEO_HEADER_KEY = 'x-page-seo'

import {
  asString,
  withS3Prefix,
  asKeywords,
  toHeaderValue,
  pickFirstString
} from '../utils/seo-utils'

export { asString, withS3Prefix, asKeywords, toHeaderValue, pickFirstString }

/** Internal helper to avoid header injection duplication in middleware fetchers */
function getForwardedHeaders(headers: Headers): Record<string, string> {
  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  const ip =
    headers.get('x-ip') ||
    headers.get('x-forwarded-for') ||
    headers.get('x-real-ip')
  const lang =
    headers.get('x-sLang') ||
    headers.get('accept-language')?.split(',')[0]?.split('-')[0]?.trim()
  const auth = headers.get('authorization')

  if (ip) reqHeaders['x-ip'] = ip
  if (lang) reqHeaders['x-sLang'] = lang
  if (auth) reqHeaders['authorization'] = auth

  return reqHeaders
}

// --- MIDDLEWARE UTILS ---

export function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim()
  return req.headers.get('x-real-ip') || undefined
}

export function getLang(req: NextRequest) {
  const cookieLang = req.cookies.get('lang')?.value
  if (cookieLang) return cookieLang
  const accept = req.headers.get('accept-language')
  if (!accept) return 'en'
  return accept.split(',')[0]?.split('-')[0]?.trim() || 'en'
}

export function convertUrl(pathname: string) {
  if (pathname === '/' || !pathname) return 'home'
  const segments = pathname.replace(/^\/+/, '').split('/').filter(Boolean)
  return segments[segments.length - 1] || 'home'
}

export function getSiteSegmentFromPath(pathname: string) {
  const seg = pathname.replace(/^\/+/, '').split('/')[0] || ''
  if (!seg) return null
  const reserved = new Set([
    'api',
    '_next',
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
    'assets',
    'static'
  ])
  if (reserved.has(seg)) return null
  return seg
}

export function stripSiteSegmentFromPath(pathname: string) {
  const parts = pathname.replace(/^\/+/, '').split('/')
  parts.shift()
  const rest = '/' + parts.join('/')
  return rest === '/' ? '/' : rest.replace(/\/+$/, '') || '/'
}

// --- API FUNCTIONS (MIDDLEWARE ONLY) ---
export async function fetchPublishedSeo({
  sSlug,
  sSiteSegment,
  headers,
  isPreview
}: {
  sSlug: string
  sSiteSegment: string
  headers: Headers
  isPreview?: boolean
}): Promise<any | null> {
  try {
    const base = (NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')
    const query = isPreview ? '?isPreview=true' : ''
    const url = `${base}/user/club-website/seo/${encodeURIComponent(sSiteSegment)}/${encodeURIComponent(sSlug)}${query}`

    const res = await fetch(url, {
      method: 'GET',
      headers: getForwardedHeaders(headers),
      cache: 'no-store'
    })

    if (!res.ok) return null
    const json = await res.json()
    return json?.data ?? json ?? null
  } catch {
    return null
  }
}
export async function fetchPublishedClubWebsiteDesign({
  iClubId,
  headers,
  isPreview
}: {
  iClubId: string
  headers: Headers
  isPreview?: boolean
}): Promise<any | null> {
  try {
    const base = (NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')
    const query = isPreview ? '?isPreview=true' : ''
    const url = `${base}/user/club-website/${encodeURIComponent(iClubId)}/published${query}`

    const res = await fetch(url, {
      method: 'GET',
      headers: getForwardedHeaders(headers),
      cache: 'no-store'
    })

    if (!res.ok) return null
    const json = await res.json()
    const data = json?.data
    if (!data || typeof data !== 'object') return null

    const oDesign = data.oDesign
    const oLogos = oDesign?.oLogos
    const oTheme = oDesign?.oTheme
    const oTypography = oDesign?.oTypography
    const sClubColorLogo = oLogos?.oClubColorLogo?.sFileUrl
    const sClubMonoLogo = oLogos?.oClubMonoLogo?.sFileUrl
    const sFavicon = oLogos?.oFavicon?.sFileUrl
    const oSiteSettings = data.oSiteSettings
    const oLogoSettings = oSiteSettings?.oLogos
    const result: any = {}
    if (oTheme?.sPrimaryColor) result.sPrimaryColor = oTheme.sPrimaryColor
    if (oTypography?.eHeadingFont)
      result.eHeadingFont = oTypography.eHeadingFont
    if (oTypography?.eBodyFont) result.eBodyFont = oTypography.eBodyFont
    if (sClubColorLogo)
      result.sClubColorLogo = withS3Prefix(sClubColorLogo)
    if (sClubMonoLogo) result.sClubMonoLogo = withS3Prefix(sClubMonoLogo)
    if (sFavicon) result.sFavicon = withS3Prefix(sFavicon)
    if (oLogos?.bShowClubLogoInHeader !== undefined) {
      result.bShowClubLogoInHeader = String(!!oLogos.bShowClubLogoInHeader)
    }
    if (Array.isArray(oDesign?.aSponsorship)) {
      result.aSponsorship = oDesign.aSponsorship.map((item: any) => {
        const sWebsiteUrl = asString(item?.sWebsiteUrl)
        return {
          sLogoUrl: withS3Prefix(item?.oSponsorLogo?.sFileUrl),
          sWebsiteUrl: sWebsiteUrl && !/^https?:\/\//i.test(sWebsiteUrl)
            ? `https://${sWebsiteUrl}`
            : sWebsiteUrl
        }
      })
    }

    // Site Settings
    if (oLogoSettings?.bHideLtaFooterLogo !== undefined)
      result.bHideLtaFooterLogo = String(!!oLogoSettings.bHideLtaFooterLogo)
    if (oLogoSettings?.bHideClubmatchFooterLogo !== undefined)
      result.bHideClubmatchFooterLogo = String(
        !!oLogoSettings.bHideClubmatchFooterLogo
      )
    const sGoogleAnalyticsId = asString(oSiteSettings?.oAnalytics?.sGoogleAnalyticsId)
    if (sGoogleAnalyticsId) result.sGoogleAnalyticsId = sGoogleAnalyticsId

    if (oSiteSettings?.bEnableFilesPage !== undefined) {
      result.bEnableFilesPage = String(!!oSiteSettings.bEnableFilesPage)
    }

    if (Array.isArray(oSiteSettings?.aSocialLinks)) {
      result.aSocialLinks = oSiteSettings.aSocialLinks
        .map((item: any) => {
          const sName = asString(item?.sName)
          const sLink = asString(item?.sLink)
          if (!sName || !sLink) return null
          return {
            sName,
            sLink: !/^https?:\/\//i.test(sLink) ? `https://${sLink}` : sLink
          }
        })
        .filter(Boolean)
    }

    const oContact = oSiteSettings?.oContact
    if (oContact && typeof oContact === 'object') {
      result.oContact = {
        sAddress: asString(oContact.sAddress),
        sGoogleMapUrl: asString(oContact.sGoogleMapUrl),
        sCta: asString(oContact.sCta),
        sContactEmail: asString(oContact.sContactEmail),
      }
    }

    return Object.keys(result).length ? result : null
  } catch {
    return null
  }
}

export async function fetchPublishedNavigation({
  iClubId,
  headers,
  isPreview
}: {
  iClubId: string
  headers: Headers
  isPreview?: boolean
}): Promise<any | null> {
  try {
    const base = (NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')
    const query = isPreview ? '?isPreview=true' : ''
    const url = `${base}/user/club-website/${encodeURIComponent(iClubId)}/navigation${query}`

    const res = await fetch(url, {
      method: 'GET',
      headers: getForwardedHeaders(headers),
      cache: 'no-store'
    })

    if (!res.ok) return null
    const json = await res.json()
    return json?.data ?? json ?? null
  } catch {
    return null
  }
}

// --- SEO PAYLOAD CONSTRUCTION ---
export function getSeoPayload(
  seo: any,
  design?: any,
  navigation?: any,
  sSiteSegment?: string,
  isPreview?: boolean
) {
  if (!seo) {
    return {
      nf: true,
      title: 'Not Found',
      description: 'Page not found',
      oDesign: design,
      aMenu: navigation?.aMenu || [],
      sSiteSegment
    }
  }
  const oSeo = (
    seo?.oSeo && typeof seo.oSeo === 'object' ? seo.oSeo : {}
  ) as Record<string, unknown>
  const title =
    asString(seo?.title) ||
    asString(seo?.sTitle) ||
    asString(oSeo?.sPageTitle) ||
    'Clubmatch'
  const description =
    asString(seo?.description) ||
    asString(seo?.sDescription) ||
    asString(oSeo?.sMetaDescription) ||
    'Clubmatch'
  const image = withS3Prefix(
    asString(seo?.image) ||
      asString(seo?.sOgImage) ||
      asString(seo?.ogImage) ||
      asString(oSeo?.sOgImage) ||
      asString(oSeo?.sImage) ||
      design?.sClubColorLogo ||
      design?.sClubMonoLogo
  )
  const keywords = asKeywords(seo?.keywords ?? oSeo?.keywords)
  return {
    ...seo,
    title,
    description,
    keywords,
    image,
    oDesign: design,
    aMenu: navigation?.aMenu || [],
    sSiteSegment,
    isPreview: !!isPreview || !!design?.isPreview || !!seo?.isPreview
  }
}

// --- PAGE LEVEL SEO FUNCTIONS (FOR NEXT.JS PAGES) ---

export async function getPageSeo<
  T = Record<string, unknown>
>(): Promise<T | null> {
  const headersList = await headers()
  const encodedSeo = headersList.get(SEO_HEADER_KEY)
  if (!encodedSeo) return null
  try {
    return JSON.parse(decodeURIComponent(encodedSeo)) as T
  } catch {
    return null
  }
}

export async function getPageMetadata(defaultMetadata: {
  title?: string
  description?: string
}): Promise<Metadata> {
  const seo = await getPageSeo<any>()
  const fallbackTitle = asString(defaultMetadata?.title) || 'Clubmatch'
  const fallbackDescription =
    asString(defaultMetadata?.description) || 'Clubmatch'
  if (!seo || seo?.nf || seo?.notFound) {
    return { title: fallbackTitle, description: fallbackDescription }
  }
  const title = asString(seo?.title) || fallbackTitle
  const description = asString(seo?.description) || fallbackDescription
  const image = asString(seo?.image)
  const keywords = Array.isArray(seo?.keywords) ? seo.keywords : []
  const metadata: Metadata = { title, description }
  if (keywords.length > 0) metadata.keywords = keywords
  if (image) {
    metadata.openGraph = { title, description, images: [image] }
    metadata.twitter = {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  }
  return metadata
}

export async function getCustomPageBySlug(sSlug: string) {
  try {
    const seo = await getPageSeo<any>()
    const iClubId = seo?.iClubId
    if (!iClubId) return null
    const response = await clubWebsiteApi.getPublishedPageBySlug({
      iClubId,
      sSlug,
      isPreview: !!seo?.isPreview
    })
    return response?.data || null
  } catch {
    return null
  }
}

export async function getPublishedWebsite() {
  try {
    const seo = await getPageSeo<any>()
    const iClubId = seo?.iClubId
    if (!iClubId) return null
    const response = await clubWebsiteApi.getPublishedWebsiteByClubId({
      iClubId,
      isPreview: !!seo?.isPreview
    })
    return response?.data || null
  } catch {
    return null
  }
}