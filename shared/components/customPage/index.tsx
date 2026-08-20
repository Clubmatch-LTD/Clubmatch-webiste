import SubBanner from '@/shared/components/subBanner'
import CourtContent from '@/shared/components/home/courtContent'
import VideoSection from '@/shared/components/home/videoSection'
import EmptyState from '@/shared/components/emptyState'

type PublishedSeo = Record<string, unknown>

function CustomPage({
    publishedSeo,
    pageData
}: {
    publishedSeo?: PublishedSeo
    pageData?: any
}) {
    const oPage = pageData?.oPage || pageData || {}
    const oHeader = oPage?.oHeader || {}
    const aModules = oPage?.aModules || []

    const introModule = aModules.find((m: any) => m.sKey === 'intro')
    const sectionsModule = aModules.find((m: any) => m.sKey === 'sections')
    const videoModule = aModules.find((m: any) => m.sKey === 'video')

    const intro = introModule?.oPayload || {}
    const hasIntro = introModule?.bEnabled !== false && !!(intro?.sTitle || intro?.sSubtitle || intro?.sDescription)
    const hasSections = sectionsModule?.bEnabled !== false && (sectionsModule?.oPayload?.aItems?.length > 0)
    const videoPayload = videoModule?.oPayload
    const hasVideo = videoModule?.bEnabled !== false && !!(
        videoPayload?.sVideoUrl?.trim() ||
        videoPayload?.sLearnMoreUrl?.trim() ||
        videoPayload?.sTitle?.trim()
    )

    const hasContent = hasIntro || hasSections || hasVideo

    return (
        <>
            <SubBanner
                title={oHeader?.sTitle || (publishedSeo?.title as string)}
                description={oHeader?.sSubtitle || (publishedSeo?.sClubName as string) || 'Woburn Sands Tennis Club'}
                bgImage={oHeader?.oHeaderImage?.sFileUrl}
            />
            {hasIntro && (
                <div className="max-w-[720px] mx-auto px-3 py-[128px] mxs:py-10 text-center">
                    {intro.sTitle && (
                        <h2 className="text-4xl mxs:text-2xl font-bold heading-font text-neturalDark uppercase">
                            {intro.sTitle}
                        </h2>
                    )}
                    {intro.sSubtitle && (
                        <p className="text-lg text-neturalMedium font-medium mt-2 mxs:text-base">
                            {intro.sSubtitle}
                        </p>
                    )}
                    {intro?.sDescription?.split('\n')?.filter((line: string) => line?.trim() !== '').map((line: string, idx: number) => (
                        <p className="text-neturalMedium text-base font-medium mt-4 break-words" key={idx}>
                            {line}
                        </p>
                    ))}
                </div>
            )}

            {hasSections && <CourtContent homeData={sectionsModule.oPayload} />}
            {hasVideo && <VideoSection homeData={videoPayload} />}

            {!hasContent && (
                <div className="max-w-[944px] mx-auto px-3 py-[128px] mxs:py-10">
                    <EmptyState description="No content is currently available for this page." />
                </div>
            )}
        </>
    )
}

export default CustomPage
