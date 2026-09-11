import MyImage from '@/shared/ui/myImage'
import ClubMatch from '@/assets/images/club-2.png'
import { withS3Prefix } from '@/shared/utils/seo-utils'

function SubBanner({
  title,
  description,
  bgImage
}: {
  title?: string
  description?: string
  bgImage?: string | null
}) {
  const finalBg = withS3Prefix(bgImage)
  const heading = title?.trim() || ''
  const subtitle = description?.trim() || ''

  return (
    <section className="main-bg pt-[200px] pb-16 mxs:pt-28 mxs:pb-10 flex flex-col gap-8 items-center main-shape bg-black relative min-h-[720px] mxs:min-h-[400px] overflow-hidden after:absolute after:inset-0 after:bg-black/40 after:z-10">
      {finalBg && (
        <MyImage
          src={finalBg}
          className="w-full h-full max-h-[100vh] object-cover object-top absolute top-0 left-0"
          alt="background"
          height={1920}
          width={1080}
          priority
        />
      )}
      <div className="absolute inset-0 main-bg z-10 w-full h-full opacity-25" />
      <div className="relative z-20 flex-1 flex flex-col justify-center text-center w-full px-16 mxsm:px-3">
        {heading ? (
          <h1 className="text-white font-extrabold text-[96px]/[88px] sm:text-[64px]/[72px] mxs:text-4xl heading-font shadow-1 break-words max-w-[1100px] mx-auto">
            {heading}
          </h1>
        ) : null}
        {subtitle ? (
          <p className="text-[32px]/[32px] text-white/80 mt-4 mxs:mt-2 mxs:text-xl heading-font font-medium shadow-1 break-words max-w-[960px] mx-auto">
            {subtitle}
          </p>
        ) : null}
      </div>
      <MyImage
        src={ClubMatch}
        alt="club match"
        height={32}
        width={154}
        className="w-[154px] h-8 mx-auto object-cover relative z-20 shrink-0"
      />
    </section>
  )
}

export default SubBanner
