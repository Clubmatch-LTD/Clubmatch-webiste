'use server'

import { clubWebsiteApi } from '@/api/club-website/club-website.api'

/** Server-only: fetch courts so the browser never calls the HTTP API (avoids mixed content). */
export async function getCourtsByClubIdAction(params: {
  iClubId: string
  isPreview?: boolean
}) {
  return clubWebsiteApi.getCourtsByClubId(params)
}

export async function getCourtAvailabilityByClubIdAction(params: {
  iClubId: string
  iCourtId: string
  isPreview?: boolean
}) {
  return clubWebsiteApi.getCourtAvailabilityByClubId(params)
}

export async function getMembershipPlansByClubIdAction(params: {
  iClubId: string
  nSkip?: number
  nLimit?: number
  isPreview?: boolean
}) {
  return clubWebsiteApi.getMembershipPlansByClubId(params)
}
