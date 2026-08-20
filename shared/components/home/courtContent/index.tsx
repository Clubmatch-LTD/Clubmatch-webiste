import MyImage from '@/shared/ui/myImage'
import demo1 from '@/assets/images/demo1.png'
import demo2 from '@/assets/images/demo2.png'
import demo3 from '@/assets/images/demo3.png'
import demo4 from '@/assets/images/demo4.png'
import { withS3Prefix } from '@/shared/utils/seo-utils'

const DEFAULT_SECTION_IMAGES = [demo1, demo2, demo3, demo4]

function CourtContent({ homeData }: { homeData?: any }) {
    const sections = homeData?.aItems || []
    if (sections.length === 0) return null

    return (
        <section>
            {sections.map((item: any, index: number) => (
                <div
                    key={item.sTitle || index}
                    className={`flex items-center even:flex-row-reverse mxs:flex-col mxs:even:flex-col`}
                >
                    <div className='w-1/2 msm:min-h-[400px] mxs:pt-[55%] mxs:w-full relative'>
                        <div className='absolute inset-0 main-bg z-10 opacity-25' />
                        <MyImage
                            src={withS3Prefix(item.oImage?.sFileUrl) || DEFAULT_SECTION_IMAGES[index % DEFAULT_SECTION_IMAGES.length]}
                            alt={item.sTitle}
                            height={1920}
                            width={1080}
                            className='w-full h-full object-cover absolute inset-0'
                        />
                    </div>
                    <div className='w-1/2 py-5 px-24 sm:px-6 mxs:w-full mxs:p-5'>
                        <h3 className='text-[28px]/[36px] mxs:text-xl font-bold heading-font uppercase text-neturalDark'>
                            {item.sTitle}
                        </h3>
                        <div className='h-0.5 w-8 main-bg rounded-sm my-8 sm:my-4 mxs:my-4' />
                        {item?.sDescription?.split('\n')?.filter((line: string) => line?.trim() !== '').map((line: string, index: number) => (
                            <p className='text-neturalMedium text-base font-medium mb-4 last:mb-0 break-words' key={index}>
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}


export default CourtContent
