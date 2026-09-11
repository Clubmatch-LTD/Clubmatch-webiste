'use client'

import Button from '@/shared/ui/button'
import {
  asString,
  getYouTubePosterUrl,
  getYouTubeVideoId,
  resolveVideoSource,
  toYouTubeNoCookieEmbed,
} from '@/shared/utils/seo-utils'
import { useCookieConsent } from '@/shared/components/cookieConsent/CookieConsentProvider'

function VideoSection({ homeData }: { homeData?: any }) {
  const { mediaAllowed, openBanner, setChooseOpen } = useCookieConsent()

  const sTitle = asString(homeData?.sTitle)
  const sLearnMoreUrl = asString(homeData?.sLearnMoreUrl)
  const { embedUrl, directUrl } = resolveVideoSource(homeData)
  const hasVideo = !!(embedUrl || directUrl)
  const youtubeId = embedUrl ? getYouTubeVideoId(embedUrl) : null
  const posterUrl = youtubeId ? getYouTubePosterUrl(youtubeId) : null
  const needsMediaConsent = !!embedUrl
  const canPlayEmbed = !needsMediaConsent || mediaAllowed

  const iframeSrc =
    canPlayEmbed && embedUrl
      ? embedUrl.includes('youtube')
        ? toYouTubeNoCookieEmbed(embedUrl)
        : embedUrl
      : null

  if (!sTitle && !sLearnMoreUrl && !hasVideo) return null

  const openCookieChoices = () => {
    setChooseOpen(true)
    openBanner()
  }

  return (
    <section className="main-bg pt-[128px] mxs:pt-10 main-2-shape relative">
      {(sTitle || sLearnMoreUrl) && (
        <div className="max-w-[1120px] flex msm:items-end justify-between mx-auto pb-24 mxsm:pb-8 px-3 mxs:flex-col mxs:text-center mxs:gap-8">
          {sTitle ? (
            <h2 className="text-[60px]/[80px] mxs:text-3xl text-white heading-font font-extrabold uppercase msm:max-w-[500px]">
              {sTitle}
            </h2>
          ) : (
            <div />
          )}
          {sLearnMoreUrl ? (
            <Button href={sLearnMoreUrl} target="_blank" variant="lightWhite" className="mxs:mx-auto">
              Learn more
            </Button>
          ) : null}
        </div>
      )}
      {hasVideo ? (
        <div className="w-full mxs:pt-[55%] msm:h-[777px] relative z-10 mx-auto rounded-t-[48px] bg-black after:absolute after:left-0 after:bottom-0 after:bg-video-gradient after:w-full after:h-[200px] mxs:after:h-20 overflow-hidden">
          {iframeSrc ? (
            <iframe
              src={iframeSrc}
              title={sTitle || 'Video'}
              className="w-full h-full absolute inset-0 border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : directUrl ? (
            <video
              className="w-full h-full absolute inset-0 object-cover rounded-t-[48px] mxs:rounded-t-2xl"
              controls
              playsInline
              preload="metadata"
              src={directUrl}
            />
          ) : needsMediaConsent ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
              {posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={posterUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              ) : null}
              <div className="relative z-[1]">
                <p className="text-white font-medium mb-4 max-w-md">
                  This video needs cookie consent before it can load.
                </p>
                <button
                  type="button"
                  onClick={openCookieChoices}
                  className="rounded-full bg-white/20 backdrop-blur-sm text-white font-bold text-sm py-3 px-6 hover:bg-white hover:text-[color:var(--primary-color)] transition-colors"
                >
                  Open cookie settings
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export default VideoSection
