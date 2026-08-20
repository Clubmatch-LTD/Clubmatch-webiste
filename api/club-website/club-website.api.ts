import { fetcherClient } from '@/shared/lib/fetcher'

export type PublishedClubWebsite = {
  bSitePublished?: boolean
  nSitePublishedAt?: number
  oDesign?: {
    oTheme?: {
      sPrimaryColor?: string
    }
    oTypography?: {
      eHeadingFont?: string
      eBodyFont?: string
    }
    oLogos?: {
      bShowClubLogoInHeader?: boolean
      oClubColorLogo?: { sFileUrl: string }
      oClubMonoLogo?: { sFileUrl: string }
      oFavicon?: { sFileUrl: string }
    }
    aSponsorship?: Array<{
      oSponsorLogo?: { sFileUrl: string }
      sWebsiteUrl?: string
    }>
  }
  oSiteSettings?: {
    oAnalytics?: {
      sGoogleAnalyticsId?: string
    }
    oContact?: {
      sAddress?: string
      sGoogleMapUrl?: string
      sCta?: string
      sContactEmail?: string
    }
    bEnableFilesPage?: boolean
    aSocialLinks?: Array<{
      sName?: string
      sLink?: string
    }>
    oLogos?: {
      bHideLtaFooterLogo?: boolean
      bHideClubmatchFooterLogo?: boolean
    }
  }
}


export const clubWebsiteApi = {
  getPublishedWebsiteByClubId: async (params: { iClubId: string; isPreview?: boolean; headers?: HeadersInit }) => {
    try {
      const query = params.isPreview ? '?isPreview=true' : ''
      return await fetcherClient.get(`/user/club-website/${params.iClubId}/published${query}`, {
        cache: 'no-store',
        headers: params.headers as Record<string, string>,
      })
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Unknown error' }
    }
  },
  getPublishedPageBySlug: async (params: { iClubId: string; sSlug: string; isPreview?: boolean; headers?: HeadersInit }) => {
    try {
      const query = params.isPreview ? '?isPreview=true' : ''
      return await fetcherClient.get(`/user/club-website/${params.iClubId}/page/${params.sSlug}${query}`, {
        cache: 'no-store',
        headers: params.headers as Record<string, string>,
      })
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Unknown error' }
    }
  },
  getCourtsByClubId: async (params: { iClubId: string; isPreview?: boolean; headers?: HeadersInit }) => {
    try {
      const query = params.isPreview ? '?isPreview=true' : ''
      return await fetcherClient.get(`/user/club-website/${params.iClubId}/courts${query}`, {
        cache: 'no-store',
        headers: params.headers as Record<string, string>,
      })
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Unknown error' }
    }
  },
  getCourtAvailabilityByClubId: async (params: {
    iClubId: string
    iCourtId: string
    isPreview?: boolean
    headers?: HeadersInit
  }) => {
    try {
      const query = params.isPreview
        ? `?iCourtId=${params.iCourtId}&isPreview=true`
        : `?iCourtId=${params.iCourtId}`
      return await fetcherClient.get(`/user/club-website/${params.iClubId}/court-availability${query}`, {
        cache: 'no-store',
        headers: params.headers as Record<string, string>,
      })
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Unknown error' }
    }
  },
  getMembershipPlansByClubId: async (params: {
    iClubId: string
    nSkip?: number
    nLimit?: number
    isPreview?: boolean
    headers?: HeadersInit
  }) => {
    try {
      const nSkip = params.nSkip ?? 0
      const nLimit = params.nLimit ?? 10
      const query = params.isPreview
        ? `?nSkip=${nSkip}&nLimit=${nLimit}&isPreview=true`
        : `?nSkip=${nSkip}&nLimit=${nLimit}`
      return await fetcherClient.get(`/user/club-website/${params.iClubId}/membership-plans${query}`, {
        cache: 'no-store',
        headers: params.headers as Record<string, string>,
      })
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Unknown error' }
    }
  },
}
