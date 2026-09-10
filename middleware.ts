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
  getSeoPayload
} from '@/shared/lib/seo'
import { AUTH_TOKEN_COOKIE, hasAuthToken } from '@/shared/lib/membersOnly'

const SEO_HEADER_KEY = 'x-page-seo'

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
    const rawSeo = await fetchPublishedSeo({
      sSlug,
      sSiteSegment,
      headers: requestHeaders,
      isPreview
    })

    const clubId = rawSeo?.iClubId
    const designData = clubId
      ? await fetchPublishedClubWebsiteDesign({
          iClubId: clubId,
          headers: requestHeaders,
          isPreview
        })
      : null

    const seoPayload = getSeoPayload(
      rawSeo,
      designData,
      null,
      sSiteSegment,
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
    response.headers.set(
      'Cache-Control',
      isPreview || !rawSeo ? 'private, no-store' : 'public, max-age=120'
    )

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
