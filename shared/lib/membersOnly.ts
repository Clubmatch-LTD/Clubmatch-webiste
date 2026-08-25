import { NEXT_PUBLIC_API_URL } from '@/shared/constant'

export type NavMenuItem = {
  sSlug?: string
  sLabel?: string
  bMembersOnly?: boolean
  aChildren?: NavMenuItem[]
}

export const AUTH_TOKEN_COOKIE = 'token'

export function hasAuthToken(token?: string | null) {
  return !!token?.trim()
}

export function isMembersOnly(value: unknown) {
  return value === true || value === 'true' || value === 1 || value === '1'
}

export function findMenuItemBySlug(
  items: NavMenuItem[] | null | undefined,
  sSlug: string
): NavMenuItem | null {
  if (!items?.length || !sSlug) return null
  const target = sSlug.toLowerCase()
  for (const item of items) {
    if ((item.sSlug || '').toLowerCase() === target) return item
    const child = findMenuItemBySlug(item.aChildren, sSlug)
    if (child) return child
  }
  return null
}

export function userHasClubAccess(
  clubs: Array<{ _id?: string; iClubId?: string }> | null | undefined,
  iClubId?: string
) {
  if (!iClubId || !clubs?.length) return false
  return clubs.some((club) => club._id === iClubId || club.iClubId === iClubId)
}

/** Show members-only nav items only when the user can access this club. */
export function filterMembersOnlyMenu<T extends NavMenuItem>(
  items: T[] | null | undefined,
  canAccessClub: boolean
): T[] {
  if (!items?.length) return []
  return items
    .filter((item) => canAccessClub || !isMembersOnly(item.bMembersOnly))
    .map((item) => ({
      ...item,
      aChildren: item.aChildren
        ? filterMembersOnlyMenu(item.aChildren, canAccessClub)
        : item.aChildren,
    }))
}

/** Server-side: clubs the logged-in user belongs to (my-club). */
export async function fetchMyClubs(token: string) {
  try {
    const base = (NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')
    const url = `${base}/user/auth/my-club?nSkip=0&nLimit=100`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: token.trim(),
      },
      cache: 'no-store',
    })
    if (!res.ok) return []
    const json = await res.json()
    const clubs = json?.data?.aMembersClubs
    return Array.isArray(clubs) ? clubs : []
  } catch {
    return []
  }
}
