function LocationSection({ locationData }: { locationData?: any }) {
    const sAddress = locationData?.sAddress || 'Woburn Sands. 9 Club Lane, Woburn Sands, MILTON KEYNES, Bedfordshire, MK17 8FA'
    let sGoogleMapUrl = locationData?.sGoogleMapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2455.6960295079375!2d-0.6480492229790153!3d52.01241667193252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48765336fa8cd93f%3A0x697bb51c4eb2d753!2s9%20Club%20Ln%2C%20Woburn%20Sands%2C%20Milton%20Keynes%20MK17%208FA%2C%20UK!5e0!3m2!1sen!2sin!4v1777366660202!5m2!1sen!2sin"
    if (locationData?.sGoogleMapUrl && !sGoogleMapUrl.startsWith('http')) {
        sGoogleMapUrl = `https://${sGoogleMapUrl.replace(/,/g, '.')}`
    }

    return (
        <section className='w-full max-w-[928px] py-[128px] mxs:py-10 mx-auto text-center'>
            <h2 className='font-bold text-4xl/[48px] mxs:text-2xl text-neturalDark heading-font uppercase'>
                How to find us
            </h2>
            <p className='text-lg text-neturalMedium font-medium mxs:text-base mxs:mt-2 whitespace-pre-line'>
                {sAddress}
            </p>
            <div className='rounded-2xl mxs:rounded-none overflow-hidden w-full mt-[72px] mxs:mt-5 aspect-[16/9]'>
                <iframe
                    src={sGoogleMapUrl}
                    width="100%"
                    height="100%"
                    className="block w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </section>
    )
}

export default LocationSection
