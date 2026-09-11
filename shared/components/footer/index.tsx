'use client'

import MyImage from '@/shared/ui/myImage'
import logo from '@/assets/images/lta-logo-white.png'
import Link from 'next/link'
import clubMatch from '@/assets/images/club-logo.svg'
import Button from '@/shared/ui/button'
import Badge from '@/shared/ui/badge'
import footerBg from '@/assets/images/footer-icon.png'
import LocationSection from '@/shared/components/home/locationSection'
import { NEXT_PUBLIC_PRIVACY_LINK, NEXT_PUBLIC_TERMS_LINK } from '@/shared/constant'
import { useCookieConsent } from '@/shared/components/cookieConsent/CookieConsentProvider'

type Sponsor = {
  sLogoUrl?: string | null
  sWebsiteUrl?: string
}

function scrollToTopSmooth() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

type SocialLink = {
  sName: string
  sLink: string
}

type Contact = {
  sAddress?: string | null
  sGoogleMapUrl?: string | null
  sCta?: string | null
  sContactEmail?: string | null
}

function Footer({
  logo: siteLogo,
  hideLtaLogo,
  hideClubmatchLogo,
  contact,
  socialLinks,
  sponsors
}: {
  logo?: string
  hideLtaLogo?: boolean
  hideClubmatchLogo?: boolean
  contact?: Contact
  socialLinks?: SocialLink[]
  sponsors?: Sponsor[]
}) {
  const sCta = contact?.sCta?.trim() || ''
  const sContactEmail = contact?.sContactEmail?.trim() || ''
  const ctaParts = sCta ? sCta.split(/\?\s+/) : []
  const sCtaSubtitle = ctaParts.length > 1 ? ctaParts.pop() : ''
  const sCtaTitle = ctaParts.length ? `${ctaParts.join('? ')}?` : sCta
  const resolvedSocialLinks = (socialLinks || []).filter((item) => item?.sName?.trim() && item?.sLink?.trim())
  const resolvedSponsors = (sponsors || []).filter((sponsor) => !!sponsor?.sLogoUrl?.trim())
  const showContactBlock = !!(sCta || sContactEmail)
  const { openBanner } = useCookieConsent()

  return (
    <>
      <LocationSection locationData={contact} />
      <footer className="relative before:absolute before:inset-0 before:bg-footer-gradient before:w-full before:h-full before:opacity-25 pb-[72px] mxs:pb-10 overflow-hidden px-3">
        <div className="max-w-[1296px] mx-auto relative z-10">
          {showContactBlock ? (
            <div className="text-center">
              {sCtaTitle ? (
                <h3 className="font-extrabold text-[56px]/[72px] mxs:text-2xl text-neturalDark heading-font">
                  {sCtaTitle}
                  {sCtaSubtitle ? <span className="font-medium block">{sCtaSubtitle}</span> : null}
                </h3>
              ) : null}
              {sContactEmail ? (
                <Button
                  href={`mailto:${sContactEmail}`}
                  variant="primary"
                  className={`mx-auto px-8 mxs:px-5 ${sCtaTitle ? 'mt-[72px] mxs:mt-5' : 'mt-0'}`}
                >
                  Contact us
                </Button>
              ) : null}
            </div>
          ) : null}
          <div className={`text-center mb-8 ${showContactBlock ? 'mt-[128px] mxs:mt-10' : 'mt-16 mxs:mt-10'}`}>
            {resolvedSponsors.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 mxs:gap-x-6 mxs:gap-y-6 mb-10 mxs:mb-8">
                {resolvedSponsors.map((sponsor, index) => {
                  const logoImage = (
                    <MyImage
                      src={sponsor.sLogoUrl!}
                      alt={`Sponsor ${index + 1}`}
                      height={100}
                      width={220}
                      className="min-w-[100px] max-w-[220px] max-h-[100px] object-contain"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  )
                  const websiteUrl = sponsor.sWebsiteUrl?.trim()

                  return websiteUrl ? (
                    <a
                      key={index}
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {logoImage}
                    </a>
                  ) : (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center shrink-0 opacity-80"
                    >
                      {logoImage}
                    </span>
                  )
                })}
              </div>
            ) : null}
            {siteLogo ? (
              <MyImage
                src={siteLogo}
                alt="logo"
                height={48}
                width={122}
                className="mx-auto w-[122px] h-12 object-contain"
              />
            ) : null}
            {resolvedSocialLinks.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                {resolvedSocialLinks.map((item) => (
                  <Badge key={item?.sName} href={item?.sLink}>
                    {item?.sName}
                  </Badge>
                ))}
              </div>
            ) : null}
            {!hideClubmatchLogo && (
              <div className="flex items-center justify-center gap-1 text-[#4F595980] text-sm mt-8 fon-medium">
                Powered by{' '}
                <MyImage src={clubMatch} alt="logo" height={16} width={77} className="w-[77px] h-4 object-cover" />
              </div>
            )}
            <button
              type="button"
              onClick={scrollToTopSmooth}
              className="text-sm font-extrabold text-[#4F595980] mt-8 cursor-pointer hover:text-neturalMedium transition-colors"
            >
              Scroll to top
            </button>
          </div>
          <div className="flex mxs:flex-col gap-5 mxs:justify-center msm:items-center justify-between pt-7 msm:justify-between border-t border-neturalDark/10">
            <p className="text-[#4F595980] font-medium text-xs mxs:text-center">© Copyright 2026 | All rights reserved </p>
            {!hideLtaLogo && (
              <div>
                <MyImage
                  src={logo}
                  alt="logo"
                  height={24}
                  width={70}
                  className="w-[70px] h-6 object-cover mx-auto"
                />
              </div>
            )}
            <div className="gap-6 flex items-center mxs:justify-center">
              <button
                type="button"
                onClick={() => openBanner()}
                className="text-[#4F595980] font-medium text-xs hover:text-neturalMedium transition-colors"
              >
                ⚙ Cookie Settings
              </button>
              <Link
                href={NEXT_PUBLIC_PRIVACY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4F595980] font-medium text-xs"
              >
                Privacy Policy
              </Link>
              <Link
                href={NEXT_PUBLIC_TERMS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4F595980] font-medium text-xs"
              >
                Legal
              </Link>
            </div>
          </div>
        </div>
        <MyImage
          src={footerBg}
          alt="footer bg"
          height={704}
          width={1296}
          className="absolute -bottom-40 right-0 w-full h-full object-cover opacity-60"
        />
      </footer>
    </>
  )
}

export default Footer
