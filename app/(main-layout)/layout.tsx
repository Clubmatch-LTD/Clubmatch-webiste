import React from 'react'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Header from '@/shared/components/header'
import Footer from '@/shared/components/footer'
import { getPageSeo } from '@/shared/lib/seo'
import { navigationApi } from '@/api/club-website/navigation.api'
import {
  AUTH_TOKEN_COOKIE,
  fetchMyClubs,
  filterMembersOnlyMenu,
  findMenuItemBySlug,
  hasAuthToken,
  isMembersOnly,
  userHasClubAccess,
} from '@/shared/lib/membersOnly'

async function Layout({ children }: { children: React.ReactNode }) {
  const seo = await getPageSeo<any>()
  const oDesign = seo?.oDesign || {}
  const iClubId = seo?.iClubId as string | undefined
  const isNotFound = !seo || seo.nf || seo.notFound

  // Middleware already turned denied members-only into nf (generic meta + private cache).
  if (isNotFound) return children

  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value
  const isLoggedIn = hasAuthToken(token)
  const sSlug = (seo?.sSlug as string) || 'home'

  let menuItems = seo?.aMenu || []
  if (iClubId) {
    const navRes = await navigationApi.getNavigationByClubId({ iClubId })
    menuItems = navRes?.data?.aMenu || menuItems
  }

  const currentPage = findMenuItemBySlug(menuItems, sSlug)
  const pageIsMembersOnly = isMembersOnly(currentPage?.bMembersOnly)
  if (pageIsMembersOnly) noStore()

  let canAccessClub = false
  if (isLoggedIn && iClubId) {
    const clubs = await fetchMyClubs(token!.trim())
    canAccessClub = userHasClubAccess(clubs, iClubId)
  }

  // Safety net if middleware could not resolve nav / membership.
  if (pageIsMembersOnly && (!isLoggedIn || !canAccessClub)) {
    notFound()
  }

  if (oDesign.bEnableFilesPage === 'false') {
    menuItems = menuItems.filter((item: { sSlug?: string }) => item.sSlug !== 'files')
  }
  menuItems = filterMembersOnlyMenu(menuItems, canAccessClub)

  return (
    <>
      <Header
        logo={oDesign.sClubMonoLogo}
        showLogo={oDesign.bShowClubLogoInHeader !== 'false'}
        siteSegment={seo?.sSiteSegment}
        menuItems={menuItems}
        isLoggedIn={isLoggedIn}
      />
      <main className="min-h-screen mxs:min-h-fit grow">{children}</main>
      <Footer
        logo={oDesign.sClubColorLogo || oDesign.sClubMonoLogo}
        hideLtaLogo={oDesign.bHideLtaFooterLogo === 'true'}
        hideClubmatchLogo={oDesign.bHideClubmatchFooterLogo === 'true'}
        contact={oDesign.oContact}
        socialLinks={oDesign.aSocialLinks}
        sponsors={oDesign.aSponsorship}
      />
    </>
  )
}

export default Layout
