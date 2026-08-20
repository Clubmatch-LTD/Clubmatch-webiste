import { getPageSeo, getCustomPageBySlug } from '@/shared/lib/seo'
import CustomPage from '@/shared/components/customPage'
import { notFound } from 'next/navigation'

async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params
    const sSlug = slug[slug.length - 1]
    const [publishedSeo, pageData] = await Promise.all([
        getPageSeo<any>(),
        getCustomPageBySlug(sSlug)
    ])
    if (!publishedSeo || publishedSeo.nf || publishedSeo.notFound) {
        notFound()
    }

    return (
        <CustomPage publishedSeo={publishedSeo} pageData={pageData} />
    )
}

export default Page
