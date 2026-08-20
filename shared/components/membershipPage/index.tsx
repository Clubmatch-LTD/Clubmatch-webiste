'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import SubBanner from '@/shared/components/subBanner'
import Button from '@/shared/ui/button'
import EmptyState from '@/shared/components/emptyState'
import MembershipCard, {
  type MembershipPlan,
} from '@/shared/components/membershipPage/membershipCard'
import { clubWebsiteApi } from '@/api/club-website/club-website.api'
import Loader from '@/shared/ui/loaders'


type PublishedSeo = Record<string, unknown> & {
  iClubId?: string
  isPreview?: boolean
  title?: string
  sClubName?: string
}

type PlansPage = {
  nTotal: number
  aPlans: MembershipPlan[]
}

export default function MembershipPage({
  publishedSeo,
  membershipData,
}: {
  publishedSeo?: PublishedSeo
  membershipData?: any
}) {
  const iClubId = (publishedSeo as any)?.iClubId as string | undefined
  const isPreview = !!(publishedSeo as any)?.isPreview

  const oPage = membershipData?.oPage || membershipData || {}
  const oHeader = oPage?.oHeader || {}
  const aModules = oPage?.aModules || []
  const settingsModule = aModules.find((m: any) => m.sKey === 'settings')
  const settings = settingsModule?.oPayload || {}
  const bShowClubmatchButton = settings?.bShowClubmatchButton ?? true
  const bShowAvailableMemberships = settings?.bShowAvailableMemberships ?? true
  const sMembershipSecretaryEmail = settings?.sMembershipSecretaryEmail?.trim()

  const listRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['club-membership-plans', iClubId, isPreview],
    enabled: !!iClubId && bShowAvailableMemberships,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await clubWebsiteApi.getMembershipPlansByClubId({
        iClubId: iClubId!,
        nSkip: pageParam,
        nLimit: 10,
        isPreview,
      })
      if (res?.error) throw new Error(res.error)
      const page = (res?.data || {}) as PlansPage
      return {
        nTotal: page.nTotal || 0,
        aPlans: page.aPlans || [],
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.aPlans.length, 0)
      return loaded < lastPage.nTotal ? loaded : undefined
    },
  })

  const plans = useMemo(
    () => data?.pages.flatMap((page) => page.aPlans) || [],
    [data]
  )

  useEffect(() => {
    const root = listRef.current
    const target = loadMoreRef.current
    if (!root || !target) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { root, rootMargin: '120px' }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, plans.length])

  return (
    <>
      <SubBanner
        title={oHeader?.sTitle || (publishedSeo?.title as string)}
        description={
          oHeader?.sSubtitle ||
          (publishedSeo?.sClubName as string) ||
          'Woburn Sands Tennis Club'
        }
        bgImage={oHeader?.oHeaderImage?.sFileUrl}
      />

      {bShowAvailableMemberships && (
        <div className="max-w-[944px] mx-auto px-3 pt-[128px] mxs:pt-10 pb-[128px] mxs:pb-10">
          <div className="flex ssm:items-center ssm:justify-between mb-[72px] mxs:mb-6 mxsm:flex-col mxsm:gap-5">
            <h2 className="text-4xl mxs:text-2xl font-bold heading-font text-neturalDark uppercase">
              MEMBERSHIP PLANS
            </h2>
            {bShowClubmatchButton && (
              <Button
                className="mxs:w-full"
                href={'https://portal.clubmatch.co.uk/settings/my-clubs' as any}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join with Clubmatch
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="min-h-[720px] flex items-center justify-center text-neutral-light font-medium">
              Loading membership plans…
            </div>
          ) : !plans.length ? (
            <EmptyState description="No membership plans are currently available." />
          ) : (
            <div
              ref={listRef}
              className="max-h-[720px] overflow-y-auto overscroll-contain space-y-4 pr-1"
            >
              {plans.map((plan) => (
                <MembershipCard
                  key={plan._id}
                  plan={plan}
                  joinHref={'https://portal.clubmatch.co.uk/settings/my-clubs' as any}
                />
              ))}

              <div ref={loadMoreRef} className="h-8" />

              {isFetchingNextPage && (
                <div className="flex justify-center py-3">
                  <Loader type="spinner" size="sm" color="green" />
                </div>
              )}
            </div>
          )}

          {sMembershipSecretaryEmail && (
            <div className="flex justify-center mt-16 mxs:mt-10">
              <Button
                href={`mailto:${sMembershipSecretaryEmail}`}
                className="mxs:w-full"
              >
                Contact membership secretary
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
