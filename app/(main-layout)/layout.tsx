import React from 'react'
import Header from '@/shared/components/header'
import Footer from '@/shared/components/footer'
import { getPageSeo } from '@/shared/lib/seo'
import { navigationApi } from '@/api/club-website/navigation.api'

async function Layout({ children }: { children: React.ReactNode }) {
    const seo = await getPageSeo<any>()
    const oDesign = seo?.oDesign || {}
    const iClubId = seo?.iClubId
    const isNotFound = !seo || seo.nf || seo.notFound

    if (isNotFound) {
        return children
    }
    let menuItems = seo?.aMenu || []
    if (iClubId) {
        const navRes = await navigationApi.getNavigationByClubId({ iClubId })
        menuItems = navRes?.data?.aMenu || menuItems
    }
    if (oDesign.bEnableFilesPage === 'false') {
        menuItems = menuItems.filter((item: { sSlug?: string }) => item.sSlug !== 'files')
    }
    return (

        <>
            <Header
                logo={oDesign.sClubMonoLogo}
                showLogo={oDesign.bShowClubLogoInHeader !== 'false'}
                siteSegment={seo?.sSiteSegment}
                menuItems={menuItems}
            />
            <div className="min-h-screen mxs:min-h-fit">
                {children}
            </div>
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
