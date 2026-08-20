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
  getSeoPayload
} from '@/shared/lib/seo'

const SEO_HEADER_KEY = 'x-page-seo'

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers)

  // 1. Inject common headers
  if (!requestHeaders.has('x-ip')) {
    const ip = getClientIp(req)
    if (ip) requestHeaders.set('x-ip', ip)
  }
  if (!requestHeaders.has('x-sLang')) {
    requestHeaders.set('x-sLang', getLang(req))
  }
  if (!requestHeaders.has('authorization')) {
    const token = req.cookies.get('token')?.value
    if (token) requestHeaders.set('authorization', token)
  }

  const pathname = req.nextUrl.pathname

  // 2. Root Redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${NEXT_PUBLIC_SITE_SEGMENT}`, req.url))
  }

  // 3. Resolve Paths
  const pathSegment = getSiteSegmentFromPath(pathname)
  const sSiteSegment = pathSegment || NEXT_PUBLIC_SITE_SEGMENT
  const effectivePathname = pathSegment ? stripSiteSegmentFromPath(pathname) : pathname
  const sSlug = convertUrl(effectivePathname)
  const isPreview = req.nextUrl.searchParams.get('isPreview') === 'true'

  try {
    // 4. Fetch Core Data
    const rawSeo = await fetchPublishedSeo({ sSlug, sSiteSegment, headers: requestHeaders, isPreview })
    
    const clubId = rawSeo?.iClubId
    let designData = null

    if (clubId) {
      designData = await fetchPublishedClubWebsiteDesign({ iClubId: clubId, headers: requestHeaders, isPreview })
    }

    // 5. Construct and Inject SEO Payload
    const seoPayload = getSeoPayload(rawSeo, designData, null, sSiteSegment, isPreview)
    const headerValue = toHeaderValue(seoPayload || { nf: true })
    
    requestHeaders.set(SEO_HEADER_KEY, headerValue)

    // 6. Create Response with injected headers
    const responseInit = { request: { headers: requestHeaders } }
    const response = pathSegment
      ? NextResponse.rewrite(new URL(effectivePathname + req.nextUrl.search, req.url), responseInit)
      : NextResponse.next(responseInit)

    // Also set on the response for client-side access if needed
    response.headers.set(SEO_HEADER_KEY, headerValue)

    // 7. Cache Control
    response.headers.set('Cache-Control', (rawSeo && !isPreview) ? 'public, max-age=120' : 'no-cache')

    return response

  } catch (error) {
    console.error('Middleware Error:', error)
    return NextResponse.next()
  }
}


export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)']
}
