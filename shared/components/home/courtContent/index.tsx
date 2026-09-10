import MyImage from '@/shared/ui/myImage'
import RichTextContent from '@/shared/ui/richTextContent'
import { withS3Prefix } from '@/shared/utils/seo-utils'

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

        return (
          <div
            key={item.sId || item._id || title || index}
            className="flex items-center even:flex-row-reverse mxs:flex-col mxs:even:flex-col"
          >
            {imageUrl ? (
              <div className="w-1/2 msm:min-h-[400px] mxs:pt-[55%] mxs:w-full relative">
                <div className="absolute inset-0 main-bg z-10 opacity-25" />
                <MyImage
                  src={imageUrl}
                  alt={title || 'Section'}
                  height={1920}
                  width={1080}
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
            ) : null}
            {(title || description) && (
              <div
                className={`${imageUrl ? 'w-1/2' : 'w-full max-w-[960px] mx-auto'} py-5 px-24 sm:px-6 mxs:w-full mxs:p-5`}
              >
                {title ? (
                  <h3 className="text-[28px]/[36px] mxs:text-xl font-bold heading-font uppercase text-neturalDark">
                    {title}
                  </h3>
                ) : null}
                {title && description ? (
                  <div className="h-0.5 w-8 main-bg rounded-sm my-8 sm:my-4 mxs:my-4" />
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
