import NotFoundPage from '@/shared/components/notFoundPage'
import { getPageSeo } from '@/shared/lib/seo'

export default async function NotFound() {
    const seo = await getPageSeo<any>()
    const homeHref = seo?.sSiteSegment ? `/${seo.sSiteSegment}` : '/'
    return <NotFoundPage homeHref={homeHref} />
}
