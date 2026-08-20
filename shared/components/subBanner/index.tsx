import MyImage from "@/shared/ui/myImage"
import ClubMatch from '@/assets/images/club-2.png'
import { withS3Prefix } from "@/shared/utils/seo-utils"

function SubBanner({ 
    title, 
    description,
    bgImage
}: { 
    title?: string, 
    description?: string,
    bgImage?: string | null
}) {
    const finalBg = withS3Prefix(bgImage)

    return (
        <section className="main-bg py-[128px] mxs:py-10 flex flex-col justify-between gap-5 items-center main-shape bg-black relative min-h-[720px] mxs:min-h-[400px] overflow-hidden after:absolute after:inset-0 after:bg-black/40 after:z-10">
            {finalBg && (
                <MyImage
                    src={finalBg}
                    className='w-full h-full object-cover absolute inset-0'
                    alt='background'
                    height={1920}
                    width={1080}
                    priority
                />
            )}
            <div className='absolute inset-0 main-bg z-10 w-full h-full opacity-25' />
            <div/>
            <div className='relative z-20 text-center'>
                <h1 className='text-white font-extrabold text-[96px]/[88px] sm:text-[64px]/[72px] mxs:text-4xl heading-font shadow-1'>{title || 'Booking'}</h1>
                <p className='text-[32px]/[32px] text-white/80 mt-4 mxs:mt-2 mxs:text-xl heading-font font-medium shadow-1'>{description || 'Woburn Sands Tennis Club'}</p>
            </div>
            <MyImage src={ClubMatch} alt='club match' height={32} width={154} className='w-[154px] h-8 mx-auto object-cover relative z-20' />
        </section>
    )
}


export default SubBanner
