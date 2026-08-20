import React from 'react'
import HeroSection from '@/shared/components/home/heroSection'
import CourtContent from '@/shared/components/home/courtContent'
import VideoSection from '@/shared/components/home/videoSection'


type PublishedSeo = Record<string, unknown>
type Design = {
    sClubColorLogo?: string
    sClubMonoLogo?: string
}

function Home({ 
    publishedSeo, 
    homeData,
}: { 
    publishedSeo?: PublishedSeo,
    homeData?: any,
}) {
    const oPage = homeData?.oPage || homeData || {}
    const aModules = oPage?.aModules || []
    const oDesign = (publishedSeo?.oDesign || {}) as Design
    const sClubLogo = oDesign.sClubMonoLogo || oDesign.sClubColorLogo

    return (
        <>
            <HeroSection
                key="intro"
                homeData={oPage}
                bgImage={oPage?.oHeader?.oHeaderImage?.sFileUrl}
                sClubLogo={sClubLogo}
            />
            {aModules.map((module: any) => {
                if (!module.bEnabled) return null
                switch (module.sKey) {
                    case 'sections':
                        return <CourtContent key="sections" homeData={module.oPayload} />
                    case 'video':
                        return <VideoSection key="video" homeData={module.oPayload} />
                    default:
                        return null
                }
            })}
        </>
    )
}

export default Home
