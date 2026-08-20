import { fetcherClient } from '@/shared/lib/fetcher'

export type MenuItem = {
  sSlug: string
  sLabel: string
  nOrder: number
  bMembersOnly?: boolean
  aChildren?: MenuItem[]
}

export type ClubNavigation = {
  bSitePublished: boolean
  nSitePublishedAt: number
  aMenu: MenuItem[]
}

export const navigationApi = {
  getNavigationByClubId: async (params: { iClubId: string; headers?: HeadersInit }) => {
    try {
      return await fetcherClient.get(`/user/club-website/${params.iClubId}/navigation`, {
        cache: 'no-store',
        headers: params.headers as Record<string, string>,
      })
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Unknown error' }
    }
  },
}
