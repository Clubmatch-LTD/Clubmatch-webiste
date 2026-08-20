import { NEXT_PUBLIC_S3_PREFIX } from '@/shared/constant'

export function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

export function withS3Prefix(path: unknown): string | null {
  const sPath = asString(path)
  if (!sPath) return null
  if (sPath.startsWith('http') || sPath.startsWith('//') || sPath.startsWith('data:')) {
    return sPath
  }
  return `${NEXT_PUBLIC_S3_PREFIX.replace(/\/+$/, '')}/${sPath.replace(/^\/+/, '')}`
}

export function asKeywords(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean) as string[]
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function toHeaderValue(value: unknown): string {
  return encodeURIComponent(JSON.stringify(value))
}

export function formatFileSize(nBytes: unknown): string {
  const size = typeof nBytes === 'number' ? nBytes : Number(nBytes)
  if (!size || Number.isNaN(size) || size <= 0) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  const rounded = unitIndex === 0 ? Math.round(value) : Math.round(value * 10) / 10
  return `${rounded} ${units[unitIndex]}`
}

export function pickFirstString(
  source: unknown,
  keys: string[]
): string | undefined {
  if (!source || typeof source !== 'object') return undefined
  const obj = source as Record<string, unknown>
  for (const key of keys) {
    const value = obj[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

export function getVideoEmbedUrl(url: unknown): string | null {
  const value = asString(url)
  if (!value) return null
  if (value.includes('youtube.com/embed/')) return value
  if (value.includes('player.vimeo.com/video/')) return value
  const youtubeShortMatch = value.match(/youtu\.be\/([^?&/]+)/)
  if (youtubeShortMatch) {
    return `https://www.youtube.com/embed/${youtubeShortMatch[1]}`
  }
  if (value.includes('youtube.com')) {
    const watchMatch = value.match(/[?&]v=([^&]+)/)
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
  }
  const vimeoMatch = value.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return null
}

export function isDirectVideoFile(url: unknown): boolean {
  const value = asString(url)
  if (!value) return false
  return /\.(mp4|webm|ogg)(\?|$)/i.test(value)
}

const DEFAULT_VIDEO_URL = 'https://www.youtube.com/watch?v=WTD4nLBzbHY'

export function resolveVideoSource(payload?: {
  sVideoUrl?: string
  oVideo?: { sFileUrl?: string }
}) {
  const linkUrl = asString(payload?.sVideoUrl)
  const legacyFileUrl = withS3Prefix(payload?.oVideo?.sFileUrl)
  const url = linkUrl || legacyFileUrl || DEFAULT_VIDEO_URL
  const embedUrl = getVideoEmbedUrl(url)

  return {
    embedUrl,
    directUrl: embedUrl ? null : url,
  }
}
