import MyImage from '@/shared/ui/myImage'
import RichTextContent from '@/shared/ui/richTextContent'
import { withS3Prefix } from '@/shared/utils/seo-utils'
import Placeholder from '@/assets/images/placeholder.svg'

function CourtContent({ homeData }: { homeData?: any }) {
  const sections = (homeData?.aItems || []).filter(
    (item: any) =>
      item?.sTitle?.trim() || item?.sDescription?.trim() || item?.oImage?.sFileUrl
  )
  if (sections.length === 0) return null

  return (
    <section>
      {sections.map((item: any, index: number) => {
        const title = item.sTitle?.trim() || ''
        const description = item.sDescription?.trim() || ''
        const imageUrl = withS3Prefix(item.oImage?.sFileUrl)
        const hasText = !!(title || description)

        return (
          <div
            key={item.sId || item._id || title || index}
            className="flex items-stretch even:flex-row-reverse mxs:flex-col mxs:even:flex-col"
          >
            <div
              className={`w-1/2 relative mxs:pt-[55%] mxs:w-full ${
                hasText ? '' : 'msm:min-h-[400px]'
              }`}
            >
              <div className="absolute inset-0 main-bg z-10 opacity-25" />
              <MyImage
                src={imageUrl || Placeholder}
                alt={title || 'Section'}
                height={1920}
                width={1080}
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
            {hasText && (
              <div className="w-1/2 py-[128px] px-[128px] mxs:w-full mxs:p-5">
                {title ? (
                  <h3 className="text-[28px]/[36px] mxs:text-xl font-bold heading-font uppercase text-neturalDark">
                    {title}
                  </h3>
                ) : null}
                {title && description ? (
                  <div className="h-0.5 w-8 main-bg rounded-sm my-8 mxs:my-4" />
                ) : null}
                {description ? (
                  <RichTextContent content={description} className="text-neturalMedium" />
                ) : null}
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

export default CourtContent
