import { fetcherClient } from '@/shared/lib/fetcher'
import { NEXT_PUBLIC_SITE_SEGMENT } from '@/shared/constant'

export const seoApi = {
  getPublishedSeo: async (params: { sSlug: string; sSiteSegment?: string; headers?: HeadersInit }) => {
    try {
      const sSiteSegment = params.sSiteSegment || NEXT_PUBLIC_SITE_SEGMENT
      return await fetcherClient.get(
        `/user/club-website/seo/${sSiteSegment}/${params.sSlug}`,
        { headers: params.headers as Record<string, string> }
      )
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Unknown error' }
    }
  },
}

