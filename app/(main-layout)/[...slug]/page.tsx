import { getPageSeo, getCustomPageBySlug } from '@/shared/lib/seo'
import CustomPage from '@/shared/components/customPage'
import { notFound } from 'next/navigation'

async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params
    const sSlug = slug[slug.length - 1]
    const publishedSeo = await getPageSeo<any>()
    // Check before loading page body so members-only deny never embeds content.
    if (!publishedSeo || publishedSeo.nf || publishedSeo.notFound) {
        notFound()
    }
    const pageData = await getCustomPageBySlug(sSlug)

    return (
        <CustomPage publishedSeo={publishedSeo} pageData={pageData} />
    )
}

export default Page
