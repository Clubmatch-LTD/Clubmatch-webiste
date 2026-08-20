import Home from "@/shared/components/home"
import { getCustomPageBySlug, getPageSeo,  } from '@/shared/lib/seo'
import { notFound } from 'next/navigation'

async function Page() {
    const [publishedSeo, homeData] = await Promise.all([
        getPageSeo<any>(),
        getCustomPageBySlug('home')
    ])
    if (!publishedSeo || publishedSeo.nf || publishedSeo.notFound) {
        notFound()
    }
    return (
        <>
            <Home 
                publishedSeo={publishedSeo} 
                homeData={homeData}
            />
        </>
    )
}



export default Page
