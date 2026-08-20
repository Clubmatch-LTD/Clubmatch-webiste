'use client'

import { useEffect, useMemo, useRef } from "react"
import Button from "@/shared/ui/button"
import { asString, resolveVideoSource } from "@/shared/utils/seo-utils"

function withAutoplayParams(url: string) {
    const videoId = url.match(/embed\/([^?&/]+)/)?.[1]
    const params = new URLSearchParams({
        autoplay: '1',
        mute: '1',
        playsinline: '1',
        rel: '0',
        controls: '0',
        modestbranding: '1',
        fs: '0',
        disablekb: '1',
        iv_load_policy: '3',
        cc_load_policy: '0',
        loop: '1',
    })
    if (videoId) params.set('playlist', videoId)
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${params.toString()}`
}

function VideoSection({ homeData }: { homeData?: any }) {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const sTitle = homeData?.sTitle || "We're proud to be the best"
    const sLearnMoreUrl = asString(homeData?.sLearnMoreUrl)
    const { embedUrl, directUrl } = resolveVideoSource(homeData)
    const iframeSrc = useMemo(
        () => (embedUrl ? withAutoplayParams(embedUrl) : null),
        [embedUrl]
    )

    useEffect(() => {
        const el = videoRef.current
        if (!el || !directUrl) return

        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0]
                if (!entry) return

                if (entry.isIntersecting) {
                    void el.play().catch(() => {})
                } else {
                    el.pause()
                }
            },
            { threshold: 0.35 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [directUrl])

    return (
        <section className="main-bg pt-[128px] mxs:pt-10 main-2-shape relative">
            <div className="max-w-[1120px] flex msm:items-end justify-between mx-auto pb-24 mxsm:pb-8 px-3 mxs:flex-col mxs:text-center mxs:gap-8">
                <h2 className="text-[60px]/[80px] mxs:text-3xl text-white heading-font font-extrabold uppercase msm:max-w-[500px]">
                    {sTitle}
                </h2>
                {sLearnMoreUrl && (
                    <Button href={sLearnMoreUrl} target="_blank" variant='lightWhite' className="mxs:mx-auto">
                        Learn more
                    </Button>
                )}
            </div>
            <div
                className="w-full mxs:pt-[55%] msm:h-[777px] relative z-10 mx-auto rounded-t-[48px] bg-black after:absolute after:left-0 after:bottom-0 after:bg-video-gradient after:w-full after:h-[200px] mxs:after:h-20 overflow-hidden"
            >
                {iframeSrc ? (
                    <>
                        <iframe
                            src={iframeSrc}
                            title={sTitle}
                            className="w-[115%] h-[115%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
                            allow="autoplay; encrypted-media"
                            tabIndex={-1}
                        />
                        <div className="absolute inset-0 z-[1]" aria-hidden />
                    </>
                ) : (
                    <video
                        ref={videoRef}
                        className="w-full h-full absolute inset-0 object-cover rounded-t-[48px] mxs:rounded-t-2xl pointer-events-none"
                        muted
                        playsInline
                        loop
                        controls={false}
                        preload="auto"
                        src={directUrl || undefined}
                    />
                )}
            </div>
        </section>
    )
}

export default VideoSection
