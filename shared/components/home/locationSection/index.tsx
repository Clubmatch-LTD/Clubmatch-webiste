function LocationSection({ locationData }: { locationData?: any }) {
  const sAddress = locationData?.sAddress?.trim() || ''
  let sGoogleMapUrl = locationData?.sGoogleMapUrl?.trim() || ''
  if (sGoogleMapUrl && !sGoogleMapUrl.startsWith('http')) {
    sGoogleMapUrl = `https://${sGoogleMapUrl.replace(/,/g, '.')}`
  }

  if (!sAddress && !sGoogleMapUrl) return null

  return (
    <section className="w-full max-w-[928px] py-[128px] mxs:py-10 mx-auto text-center">
      <h2 className="font-bold text-4xl/[48px] mxs:text-2xl text-neturalDark heading-font uppercase">
        How to find us
      </h2>
      {sAddress ? (
        <p className="text-lg text-neturalMedium font-medium mxs:text-base mxs:mt-2 whitespace-pre-line">
          {sAddress}
        </p>
      ) : null}
      {sGoogleMapUrl ? (
        <div className="rounded-2xl mxs:rounded-none overflow-hidden w-full mt-[72px] mxs:mt-5 aspect-[16/9]">
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
      ) : null}
    </section>
  )
}

export default LocationSection
