'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import IconPlay from '@/shared/icon/play'
import IconPause from '@/shared/icon/pause'
import IconVolume from '@/shared/icon/volume'
import IconVolumeMute from '@/shared/icon/volumeMute'
import { getYouTubeVideoId, toYouTubeNoCookieEmbed } from '@/shared/utils/seo-utils'

type YtPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  getPlayerState: () => number
  destroy: () => void
}

type YtNamespace = {
  Player: new (
    element: HTMLElement | string,
    config: Record<string, unknown>
  ) => YtPlayer
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number }
}

declare global {
  interface Window {
    YT?: YtNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let ytApiPromise: Promise<YtNamespace> | null = null

function loadYouTubeApi() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (ytApiPromise) return ytApiPromise

  ytApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      if (window.YT) resolve(window.YT)
    }
    if (!document.querySelector('script[data-cm-youtube-api]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.dataset.cmYoutubeApi = 'true'
      document.body.appendChild(script)
    }
  })

  return ytApiPromise
}

type CustomVideoPlayerProps = {
  embedUrl?: string | null
  directUrl?: string | null
  posterUrl?: string | null
  title?: string
}

function ControlButton({
  label,
  onClick,
  children,
  size = 'md',
}: {
  label: string
  onClick: () => void
  children: ReactNode
  size?: 'md' | 'lg'
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[
        'flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 transition-colors hover:bg-white hover:text-[color:var(--primary-color)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
        size === 'lg' ? 'w-20 h-20 mxs:w-16 mxs:h-16' : 'w-11 h-11',
      ].join(' ')}
    >
      <span className={size === 'lg' ? 'w-8 h-8 mxs:w-6 mxs:h-6' : 'w-5 h-5'}>{children}</span>
    </button>
  )
}

export default function CustomVideoPlayer({
  embedUrl,
  directUrl,
  posterUrl,
  title = 'Video',
}: CustomVideoPlayerProps) {
  const youtubeId = embedUrl ? getYouTubeVideoId(embedUrl) : null
  const isYouTube = !!youtubeId
  const isDirect = !!directUrl && !isYouTube

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const ytContainerRef = useRef<HTMLDivElement | null>(null)
  const ytPlayerRef = useRef<YtPlayer | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const [ytReady, setYtReady] = useState(false)

  const destroyYtPlayer = useCallback(() => {
    try {
      ytPlayerRef.current?.destroy()
    } catch {
      // ignore
    }
    ytPlayerRef.current = null
    setYtReady(false)
  }, [])

  useEffect(() => {
    if (!isYouTube || !youtubeId || !hasStarted) return

    let cancelled = false

    loadYouTubeApi().then((YT) => {
      if (cancelled || !ytContainerRef.current) return
      destroyYtPlayer()

      ytPlayerRef.current = new YT.Player(ytContainerRef.current, {
        videoId: youtubeId,
        host: 'https://www.youtube-nocookie.com',
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          disablekb: 1,
          iv_load_policy: 3,
          playsinline: 1,
          loop: 1,
          playlist: youtubeId,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: { target: YtPlayer }) => {
            if (cancelled) return
            setYtReady(true)
            setIsMuted(true)
            event.target.mute()
            event.target.playVideo()
            setIsPlaying(true)
          },
          onStateChange: (event: { data: number }) => {
            if (cancelled) return
            if (event.data === YT.PlayerState.PLAYING) setIsPlaying(true)
            if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              setIsPlaying(false)
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      destroyYtPlayer()
    }
  }, [isYouTube, youtubeId, hasStarted, destroyYtPlayer])

  const playDirect = useCallback(async () => {
    const el = videoRef.current
    if (!el) return
    try {
      await el.play()
      setIsPlaying(true)
      setHasStarted(true)
    } catch {
      setIsPlaying(false)
    }
  }, [])

  const pauseDirect = useCallback(() => {
    videoRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (isYouTube) {
      if (!hasStarted) {
        setHasStarted(true)
        return
      }
      const player = ytPlayerRef.current
      if (!player || !ytReady) return
      if (isPlaying) {
        player.pauseVideo()
        setIsPlaying(false)
      } else {
        player.playVideo()
        setIsPlaying(true)
      }
      return
    }

    if (isDirect) {
      if (isPlaying) pauseDirect()
      else void playDirect()
    }
  }, [isYouTube, isDirect, hasStarted, ytReady, isPlaying, playDirect, pauseDirect])

  const toggleMute = useCallback(() => {
    if (isYouTube) {
      const player = ytPlayerRef.current
      if (!player || !ytReady) {
        setIsMuted((m) => !m)
        return
      }
      if (isMuted) {
        player.unMute()
        setIsMuted(false)
      } else {
        player.mute()
        setIsMuted(true)
      }
      return
    }

    const el = videoRef.current
    if (!el) return
    el.muted = !el.muted
    setIsMuted(el.muted)
  }, [isYouTube, ytReady, isMuted])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !isDirect) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
    }
  }, [isDirect, directUrl])

  if (!isYouTube && !isDirect) {
    // Non-YouTube embed fallback (e.g. Vimeo): hide chrome as much as possible
    if (!embedUrl) return null
    const src = embedUrl.includes('youtube') ? toYouTubeNoCookieEmbed(embedUrl) : embedUrl
    return (
      <iframe
        src={`${src}${src.includes('?') ? '&' : '?'}autoplay=0&muted=1`}
        title={title}
        className="w-full h-full absolute inset-0 border-0"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    )
  }

  const showPoster = !hasStarted || (isYouTube && !ytReady)

  return (
    <div className="absolute inset-0 bg-black">
      {isDirect ? (
        <video
          ref={videoRef}
          className="w-full h-full absolute inset-0 object-cover"
          playsInline
          loop
          muted={isMuted}
          controls={false}
          preload="metadata"
          poster={posterUrl || undefined}
          src={directUrl || undefined}
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          <div
            ref={ytContainerRef}
            className="w-[115%] h-[115%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
          />
        </div>
      )}

      {showPoster && posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : null}

      {/* Capture clicks; YouTube iframe stays non-interactive underneath */}
      <div className="absolute inset-0 z-[1]" onClick={togglePlay} role="presentation" />

      {!hasStarted || !isPlaying ? (
        <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <ControlButton label={isPlaying ? 'Pause video' : 'Play video'} onClick={togglePlay} size="lg">
              {isPlaying ? <IconPause /> : <IconPlay />}
            </ControlButton>
          </div>
        </div>
      ) : null}

      {hasStarted ? (
        <div className="absolute top-6 right-6 mxs:top-4 mxs:right-4 z-[5] flex items-center gap-3">
          <ControlButton label={isPlaying ? 'Pause video' : 'Play video'} onClick={togglePlay}>
            {isPlaying ? <IconPause /> : <IconPlay />}
          </ControlButton>
          <ControlButton label={isMuted ? 'Unmute video' : 'Mute video'} onClick={toggleMute}>
            {isMuted ? <IconVolumeMute /> : <IconVolume />}
          </ControlButton>
        </div>
      ) : null}
    </div>
  )
}
