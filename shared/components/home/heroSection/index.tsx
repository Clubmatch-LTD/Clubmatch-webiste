import Image from 'next/image'
import MyImage from '@/shared/ui/myImage'
import RichTextContent from '@/shared/ui/richTextContent'
import court from '@/assets/images/court.jpg'
import ClubMatch from '@/assets/images/club-match.png'
import { withS3Prefix } from '@/shared/utils/seo-utils'

const HERO_SIZES = '(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1400px'

function HeroSection({
  homeData,
  bgImage,
  sClubLogo,
  clubName
}: {
  homeData?: any
  bgImage?: string | null
  sClubLogo?: string | null
  clubName?: string | null
}) {
  const headerTitle = homeData?.oHeader?.sTitle?.trim() || clubName?.trim() || ''
  const headerSubTitle = homeData?.oHeader?.sSubtitle?.trim() || ''
  const headerBg = withS3Prefix(bgImage) || court
  const clubLogo = withS3Prefix(sClubLogo)
  const introModule = homeData?.aModules?.find((m: any) => m.sKey === 'intro')
  const introPayload = introModule?.oPayload || {}
  const introsTitle = introPayload.sTitle?.trim() || ''
  const introSubTitle = introPayload.sSubtitle?.trim() || ''
  const introData = introPayload.sDescription?.trim() || ''
  const showIntro = !!(introsTitle || introSubTitle || introData)
  const titleParts = headerTitle ? headerTitle.split(' ') : []
  const firstPart = titleParts[0] || ''
  const restParts = titleParts.slice(1).join(' ')

  return (
    <section className="pt-[130px] mxs:pt-20 pb-16 mxs:pb-8 main-bg main-shape relative">
      <div className="px-16 mxsm:px-3">
        <div className="min-h-[calc(100vh-160px)] p-16 flex flex-col justify-between gap-5 rounded-2xl overflow-hidden relative after:absolute after:inset-0 after:bg-black/40 after:z-10 after:rounded-2xl after:w-full after:h-full">
          <Image
            src={headerBg}
            alt="court"
            fill
            priority
            fetchPriority="high"
            sizes={HERO_SIZES}
            className="object-cover object-top"
          />
          <div className="absolute inset-0 main-bg z-10 rounded-2xl w-full h-full opacity-25" />
          <div />
          <div className="relative z-20 text-center">
            {clubLogo ? (
              <MyImage
                src={clubLogo}
                alt="logo"
                height={500}
                width={500}
                className="w-[241px] h-24 mxs:w-[160px] mxs:h-16 mx-auto object-cover"
              />
            ) : null}
            {headerTitle ? (
              <h1
                className={`text-white font-extrabold mxs:mt-4 text-[96px]/[88px] sm:text-[64px]/[72px] mxs:text-4xl heading-font shadow-1 ${clubLogo ? 'mt-8' : 'mt-0'}`}
              >
                {firstPart} {restParts ? <span className="font-normal">{restParts}</span> : null}
              </h1>
            ) : null}
            {headerSubTitle ? (
              <p className="text-[32px]/[32px] text-white/80 mt-4 mxs:text-xl heading-font font-medium shadow-1 break-words max-w-[960px] mx-auto">
                {headerSubTitle}
              </p>
            ) : null}
          </div>
          <MyImage
            src={ClubMatch}
            alt="club match"
            height={32}
            width={154}
            className="w-[154px] h-8 mx-auto object-cover relative z-20"
          />
        </div>

        {showIntro ? (
          <div className="max-w-[1184px] mx-auto mt-16 mxs:mt-5 relative z-10">
            {(introsTitle || introSubTitle) && (
              <h2 className="text-4xl/[48px] mxs:text-2xl text-center heading-font text-white">
                {introsTitle ? <span className="font-semibold block">{introsTitle}</span> : null}
                {introSubTitle ? <span className="font-normal block">{introSubTitle}</span> : null}
              </h2>
            )}
            {(introsTitle || introSubTitle) && introData ? (
              <div className="h-0.5 w-8 bg-white rounded-sm my-8 mxs:my-4 mx-auto opacity-50" />
            ) : null}
            {introData ? (
              <RichTextContent
                content={introData}
                variant="inverse"
                className="text-center max-w-[960px] mx-auto space-y-5 mxs:space-y-3"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default HeroSection
