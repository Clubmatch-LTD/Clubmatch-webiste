import { getPageSeo, getCustomPageBySlug } from '@/shared/lib/seo'
import MembershipPage from '@/shared/components/membershipPage'
import { notFound } from 'next/navigation'

async function Page() {
    const [publishedSeo, membershipData] = await Promise.all([
        getPageSeo<any>(),
        getCustomPageBySlug('membership')
    ])
    if (!publishedSeo || publishedSeo.nf || publishedSeo.notFound) {
        notFound()
    }

    return (
        <MembershipPage 
            publishedSeo={publishedSeo} 
            membershipData={membershipData}
        />
    )
}

export default Page

