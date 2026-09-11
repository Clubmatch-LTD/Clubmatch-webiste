import { NextRequest, NextResponse } from 'next/server'
import { NEXT_PUBLIC_SITE_SEGMENT } from '@/shared/constant'
import {
  getClientIp,
  getLang,
  convertUrl,
  getSiteSegmentFromPath,
  stripSiteSegmentFromPath,
  toHeaderValue,
  fetchPublishedSeo,
  fetchPublishedClubWebsiteDesign,
  fetchPublishedNavigation,
  getSeoPayload,
  asString
} from '@/shared/lib/seo'
import {
  AUTH_TOKEN_COOKIE,
  findMenuItemBySlug,
  hasAuthToken,
  isMembersOnly,
  userCanAccessClub
} from '@/shared/lib/membersOnly'

const SEO_HEADER_KEY = 'x-page-seo'
const PRIVATE_NO_STORE = 'private, no-store'
const PUBLIC_SHORT = 'public, max-age=120'

function shouldRedirectShortSegment(
  pathSegment: string | null,
  fullSegment: string | null,
  shortSegment: string | null
) {
  if (!pathSegment || !fullSegment || !shortSegment) return false
  const path = pathSegment.toLowerCase()
  const full = fullSegment.toLowerCase()
  const short = shortSegment.toLowerCase()
  return path === short && path !== full
}

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers)

  if (!requestHeaders.has('x-ip')) {
    const ip = getClientIp(req)
    if (ip) requestHeaders.set('x-ip', ip)
  }
  if (!requestHeaders.has('x-sLang')) {
    requestHeaders.set('x-sLang', getLang(req))
  }

  const authToken = req.cookies.get(AUTH_TOKEN_COOKIE)?.value
  if (!requestHeaders.has('authorization') && hasAuthToken(authToken)) {
    requestHeaders.set('authorization', authToken!.trim())
  }

  const pathname = req.nextUrl.pathname

  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${NEXT_PUBLIC_SITE_SEGMENT}`, req.url)
    )
  }

  const pathSegment = getSiteSegmentFromPath(pathname)
  const sSiteSegment = pathSegment || NEXT_PUBLIC_SITE_SEGMENT
  const effectivePathname = pathSegment
    ? stripSiteSegmentFromPath(pathname)
    : pathname
  const sSlug = convertUrl(effectivePathname)
  const isPreview = req.nextUrl.searchParams.get('isPreview') === 'true'

  requestHeaders.set('x-club-request-url', req.nextUrl.href)

  try {
    let rawSeo = await fetchPublishedSeo({
      sSlug,
      sSiteSegment,
      headers: requestHeaders,
      isPreview
    })

    // Resolve full/short segments even when the page slug is missing,
    // so /ttt/... can permanently redirect to /tappable-tennis-test/...
    let addressSeo = rawSeo
    if (!addressSeo?.oSiteSettings?.oAddress && pathSegment) {
      addressSeo = await fetchPublishedSeo({
        sSlug: 'home',
        sSiteSegment: pathSegment,
        headers: requestHeaders,
        isPreview
      })
    }

    const fullSegment = asString(
      addressSeo?.oSiteSettings?.oAddress?.sUrlSegment
    )
    const shortSegment = asString(
      addressSeo?.oSiteSettings?.oAddress?.sShortUrlSegment
    )

    if (shouldRedirectShortSegment(pathSegment, fullSegment, shortSegment)) {
      const rest = stripSiteSegmentFromPath(pathname)
      const destPath = rest === '/' ? `/${fullSegment}` : `/${fullSegment}${rest}`
      return NextResponse.redirect(
        new URL(destPath + req.nextUrl.search, req.url),
        308
      )
    }

    const clubId = (rawSeo?.iClubId || addressSeo?.iClubId) as string | undefined
    const [designData, navigation] = await Promise.all([
      clubId
        ? fetchPublishedClubWebsiteDesign({
            iClubId: clubId,
            headers: requestHeaders,
            isPreview
          })
        : Promise.resolve(null),
      clubId
        ? fetchPublishedNavigation({
            iClubId: clubId,
            headers: requestHeaders,
            isPreview
          })
        : Promise.resolve(null)
    ])

    // Members-only: guests / non-members get the same nf + private response as an unknown page.
    // Authorised members never get a public Cache-Control.
    const currentPage = findMenuItemBySlug(navigation?.aMenu, sSlug)
    const pageIsMembersOnly = isMembersOnly(currentPage?.bMembersOnly)
    let cacheControl =
      isPreview || !rawSeo ? PRIVATE_NO_STORE : PUBLIC_SHORT

    if (pageIsMembersOnly) {
      cacheControl = PRIVATE_NO_STORE
      const canAccess = await userCanAccessClub(authToken, clubId)
      if (!canAccess) {
        rawSeo = null
      }
    }

    const seoPayload = getSeoPayload(
      rawSeo,
      rawSeo ? designData : null,
      rawSeo ? navigation : null,
      fullSegment || sSiteSegment,
      isPreview
    )
    const headerValue = toHeaderValue(seoPayload || { nf: true })
    requestHeaders.set(SEO_HEADER_KEY, headerValue)

    const responseInit = { request: { headers: requestHeaders } }
    const response = pathSegment
      ? NextResponse.rewrite(
          new URL(effectivePathname + req.nextUrl.search, req.url),
          responseInit
        )
      : NextResponse.next(responseInit)

    response.headers.set(SEO_HEADER_KEY, headerValue)
    response.headers.set('Cache-Control', cacheControl)

    return response
  } catch (error) {
    console.error('Middleware Error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
}
