import { getPageSeo, getCustomPageBySlug } from '@/shared/lib/seo'
import FilesPage from '@/shared/components/filesPage'
import { notFound } from 'next/navigation'

async function Page() {
    const [publishedSeo, filesData] = await Promise.all([
        getPageSeo<any>(),
        getCustomPageBySlug('files')
    ])
    if (!publishedSeo || publishedSeo.nf || publishedSeo.notFound) {
        notFound()
    }
    if (publishedSeo?.oDesign?.bEnableFilesPage === 'false') {
        notFound()
    }

    return (
        <FilesPage
            publishedSeo={publishedSeo}
            filesData={filesData}
        />
    )
}

export default Page
