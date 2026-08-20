import MyImage from '@/shared/ui/myImage'
import court from '@/assets/images/court.jpg'
import logo from '@/assets/images/wstc.svg'
import ClubMatch from '@/assets/images/club-match.png'
import { withS3Prefix } from '@/shared/utils/seo-utils'

function HeroSection({ 
    homeData,
    bgImage,
    sClubLogo
}: { 
    homeData?: any,
    bgImage?: string | null,
    sClubLogo?: string | null
    }) {
    const headerTitle = homeData?.oHeader?.sTitle || 'Woburn Sands'
    const headerSubTitle = homeData?.oHeader?.sSubtitle || 'Tennis Club'
    const headerBg = withS3Prefix(bgImage) || court
    const clubLogo = withS3Prefix(sClubLogo) || logo
    const introsTitle = homeData?.aModules[0]?.oPayload?.sTitle || 'Woburn Sands'
    const introSubTitle = homeData?.aModules[0]?.oPayload?.sSubtitle || 'Tennis Club'
    const introData = homeData?.aModules?.[0]?.oPayload?.sDescription
    const titleParts = headerTitle.split(' ')
    const firstPart = titleParts[0]
    const restParts = titleParts.slice(1).join(' ')

    return (
        <section className='pt-[130px] mxs:pt-20 pb-16 mxs:pb-8 main-bg main-shape relative'>
            <div className='px-16 mxsm:px-3'>
                <div className='min-h-[calc(100vh-160px)] p-16 flex flex-col justify-between gap-5 rounded-2xl overflow-hidden relative after:absolute after:inset-0 after:bg-black/40 after:z-10 after:rounded-2xl after:w-full after:h-full'>
                    <MyImage
                        src={headerBg}
                        className='w-full h-full object-cover absolute inset-0'
                        alt='court'
                        height={1920}
                        width={1080}
                        priority
                    />
                    <div className='absolute inset-0 main-bg z-10 rounded-2xl w-full h-full opacity-25' />
                    <div />
                    <div className='relative z-20 text-center'>
                        <MyImage 
                            src={clubLogo} 
                            alt='logo' 
                            height={500} 
                            width={500} 
                            className='w-[241px] h-24 mxs:w-[160px] mxs:h-16 mx-auto object-cover' 
                        />
                        <h1 className='text-white font-extrabold mt-8 mxs:mt-4 text-[96px]/[88px] sm:text-[64px]/[72px] mxs:text-4xl heading-font shadow-1'>
                            {firstPart} <span className='font-normal'>{restParts}</span>
                        </h1>
                        <p className='text-[32px]/[32px] text-white/80 mt-4 mxs:text-xl heading-font font-medium shadow-1'>{headerSubTitle}</p>
                    </div>
                    <MyImage src={ClubMatch} alt='club match' height={32} width={154} className='w-[154px] h-8 mx-auto object-cover relative z-20' />
                </div>


                <div className='max-w-[1184px] mx-auto mt-16 mxs:mt-5'>
                    <h2 className='text-4xl/[48px] mxs:text-2xl text-center heading-font text-white'>
                        <span className='font-semibold block'>{introsTitle}</span>
                        <span className='font-normal block'>{introSubTitle}</span>
                    </h2>
                    <div className='h-0.5 w-8 bg-white rounded-sm my-8 mxs:my-4 mx-auto opacity-50' />
                    
                    <div className='text-center text-base text-white/75 font-medium space-y-5 mxs:space-y-3 max-w-[960px] mx-auto'>
                        {introData?.split('\n')?.filter((line: string) => line.trim() !== '').map((line: string, index: number) => (
                            <p className="text-center text-base text-white/75 font-medium break-words" key={index}>{line}</p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}


export default HeroSection
