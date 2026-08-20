'use client'

import MyImage from '@/shared/ui/myImage'
import logo from '@/assets/images/lta-logo-white.png'
import logo2 from '@/assets/images/wstc-logo.svg'
import Link from 'next/link'
import clubMatch from '@/assets/images/club-logo.svg'
import sponsorDefault from '@/assets/images/sponsor.png'
import Button from '@/shared/ui/button'
import Badge from '@/shared/ui/badge'
import footerBg from '@/assets/images/footer-icon.png'
import LocationSection from '@/shared/components/home/locationSection'

type Sponsor = {
  sLogoUrl: string
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

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { sName: 'Facebook', sLink: 'https://www.facebook.com/' },
  { sName: 'Instagram', sLink: 'https://www.instagram.com/' },
]

function Footer({ 
  logo: siteLogo,
  hideLtaLogo,
  hideClubmatchLogo,
  contact,
  socialLinks,
  sponsors
}: { 
  logo?: string,
  hideLtaLogo?: boolean,
  hideClubmatchLogo?: boolean,
  contact?: Contact,
  socialLinks?: SocialLink[],
  sponsors?: Sponsor[]
  }) {
  const sCta = contact?.sCta || 'Questions? Suggestions? Anything else you want to say?'
  const sContactEmail = contact?.sContactEmail || 'info@clubmatch.co.uk'
  const ctaParts = sCta.trim().split(/\?\s+/)
  const sCtaSubtitle = ctaParts.length > 1 ? ctaParts.pop() : ''
  const sCtaTitle = ctaParts.length ? `${ctaParts.join('? ')}?` : sCta
  const resolvedSocialLinks = socialLinks?.length ? socialLinks : DEFAULT_SOCIAL_LINKS

  return (
    <>
      <LocationSection locationData={contact} />
      <footer className='relative before:absolute before:inset-0 before:bg-footer-gradient before:w-full before:h-full before:opacity-25 pb-[72px] mxs:pb-10 overflow-hidden px-3'>
        <div className='max-w-[1296px] mx-auto relative z-10'>
          <div className='text-center'>
            <h3 className='font-extrabold text-[56px]/[72px] mxs:text-2xl text-neturalDark heading-font'>
              {sCtaTitle}
              {sCtaSubtitle && (
                <span className='font-medium block'>{sCtaSubtitle}</span>
              )}
            </h3>
            {sContactEmail && (
              <Button href={`mailto:${sContactEmail}`} variant='primary' className='mt-[72px] mx-auto px-8 mxs:px-5 mxs:mt-5'>
                Contact us
              </Button>
            )}
          </div>
          <div className='text-center mb-8 mt-[128px] mxs:mt-10'>
            {!!sponsors?.length && (
              <div className='flex flex-wrap items-center justify-center gap-10 mxs:gap-6 mb-10 mxs:mb-8'>
                {sponsors.map((sponsor, index) => (
                  <a
                    key={index}
                    href={sponsor.sWebsiteUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='opacity-80 hover:opacity-100 transition-opacity'
                  >
                    <MyImage
                      src={sponsor.sLogoUrl || sponsorDefault}
                      alt={`Sponsor ${index + 1}`}
                      height={16} width={77}
                      className='w-[77px] h-4 object-cover'
                    />
                  </a>
                ))}
              </div>
            )}
            <MyImage src={siteLogo || logo2} alt='logo' height={48} width={122} className='mx-auto w-[122px] h-12 object-contain' />
            <div className='flex flex-wrap items-center justify-center gap-3 mt-8'>
              {resolvedSocialLinks.map((item) => (
                <Badge key={item?.sName} href={item?.sLink}>
                  {item?.sName}
                </Badge>
              ))}
            </div>
            {!hideClubmatchLogo && (
              <div className='flex items-center justify-center gap-1 text-[#4F595980] text-sm mt-8 fon-medium'>
                Powered by <MyImage src={clubMatch} alt='logo' height={16} width={77} className='w-[77px] h-4 object-cover' />
              </div>
            )}
            <button
              type='button'
              onClick={scrollToTopSmooth}
              className='text-sm font-extrabold text-[#4F595980] mt-8 cursor-pointer hover:text-neturalMedium transition-colors'
            >
              Scroll to top
            </button>
          </div>
          <div className='flex mxs:flex-col gap-5 mxs:justify-center msm:items-center justify-between pt-7 msm:justify-between border-t border-neturalDark/10'>
            <p className='text-[#4F595980] font-medium text-xs mxs:text-center'>© Copyright 2026 | All rights reserved </p>
            {!hideLtaLogo && (
              <div>
                <MyImage
                  src={logo}
                  alt='logo'
                  height={24}
                  width={70}
                  className='w-[70px] h-6 object-cover mx-auto'
                />
              </div>
            )}
            <div className='gap-6 flex items-center mxs:justify-center'>
              <Link href="" className='text-[#4F595980] font-medium text-xs'>⚙ Cookie Settings</Link>
              <Link href="" className='text-[#4F595980] font-medium text-xs'>Privacy Policy</Link>
              <Link href="" className='text-[#4F595980] font-medium text-xs'>Legal</Link>
            </div>
          </div>
        </div>
        <MyImage src={footerBg} alt='footer bg' height={704} width={1296} className='absolute -bottom-40 right-0 w-full h-full object-cover opacity-60' />
      </footer>
    </>
  )
}

export default Footer
