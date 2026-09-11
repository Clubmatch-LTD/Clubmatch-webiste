import SubBanner from '@/shared/components/subBanner'
import CourtContent from '@/shared/components/home/courtContent'
import VideoSection from '@/shared/components/home/videoSection'
import EmptyState from '@/shared/components/emptyState'
import RichTextContent from '@/shared/ui/richTextContent'

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
    const hasSections =
      sectionsModule?.bEnabled !== false &&
      (sectionsModule?.oPayload?.aItems || []).some(
        (item: any) => item?.sTitle?.trim() || item?.sDescription?.trim() || item?.oImage?.sFileUrl
      )
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
                title={oHeader?.sTitle || (publishedSeo?.sClubName as string)}
                description={oHeader?.sSubtitle}
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
                    {intro?.sDescription && (
                        <RichTextContent
                            content={intro.sDescription}
                            className="text-neturalMedium mt-4"
                        />
                    )}
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
