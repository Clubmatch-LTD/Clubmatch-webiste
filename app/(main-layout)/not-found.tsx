import NotFoundPage from '@/shared/components/notFoundPage'
import { getPageSeo } from '@/shared/lib/seo'
import { formatUrlSegmentName } from '@/shared/utils/seo-utils'

export default async function NotFound() {
  const seo = await getPageSeo<any>()
  const oDesign = seo?.oDesign || {}
  const homeHref = seo?.sSiteSegment ? `/${seo.sSiteSegment}` : '/'
  const logo = oDesign.sClubColorLogo || oDesign.sClubMonoLogo || null
  const clubName =
    (seo?.sClubName as string) ||
    formatUrlSegmentName(seo?.sSiteSegment) ||
    null
  return <NotFoundPage homeHref={homeHref} logo={logo} clubName={clubName} />
}
