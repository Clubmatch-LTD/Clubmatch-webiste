import BookingPage from "@/shared/components/booking"
import { getPageSeo, getCustomPageBySlug } from '@/shared/lib/seo'
import { notFound } from 'next/navigation'

async function Page() {
    const [publishedSeo, bookingData] = await Promise.all([
        getPageSeo<any>(),
        getCustomPageBySlug('bookings')
    ])
    if (!publishedSeo || publishedSeo.nf || publishedSeo.notFound) {
        notFound()
    }

    return (
        <BookingPage 
            publishedSeo={publishedSeo} 
            bookingData={bookingData} 
        />
    )
}

export default Page

