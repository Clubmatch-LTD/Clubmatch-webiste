'use client'

import { useEffect, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import SubBanner from '@/shared/components/subBanner'
import Button from '@/shared/ui/button'
import CustomSelect from '@/shared/ui/customSelect'
import CourtAvailabilityCalendar from '@/shared/components/booking/courtAvailabilityCalendar'
import EmptyState from '@/shared/components/emptyState'
import { getCourtsByClubIdAction, getCourtAvailabilityByClubIdAction } from '@/api/club-website/club-website.actions'
import type { CourtAvailabilityData } from '@/shared/components/booking/courtAvailabilityCalendar/utils'

type PublishedSeo = Record<string, unknown> & {
  iClubId?: string
  isPreview?: boolean
  title?: string
  sClubName?: string
}

type Court = {
  _id: string
  sCourtName: string
  bIsFloodLight?: boolean
}

type CourtOption = { value: string; label: string }

export default function BookingPage({
  publishedSeo,
  bookingData,
}: {
  publishedSeo?: PublishedSeo
  bookingData?: any
}) {
  const iClubId = (publishedSeo as any)?.iClubId as string | undefined
  const isPreview = !!(publishedSeo as any)?.isPreview

  const oPage = bookingData?.oPage || bookingData || {}
  const oHeader = oPage?.oHeader || {}
  const aModules = oPage?.aModules || []
  const settingsModule = aModules.find((m: any) => m.sKey === 'settings')
  const settings = settingsModule?.oPayload || {}
  const bShowClubmatchButton = settings?.bShowClubmatchButton ?? true
  const bShowAvailabeCourts = settings?.bShowAvailableCourts ?? true

  const [selectedCourtId, setSelectedCourtId] = useState('')

  const {
    data: courts = [],
    isLoading: isLoadingCourts,
  } = useQuery({
    queryKey: ['club-courts', iClubId, isPreview],
    enabled: !!iClubId,
    queryFn: async () => {
      const res = await getCourtsByClubIdAction({
        iClubId: iClubId!,
        isPreview,
      })
      if (res?.error) throw new Error(res.error)
      return (res?.data as Court[]) || []
    },
  })

  useEffect(() => {
    if (!courts.length) return
    const stillValid = courts.some((court) => court._id === selectedCourtId)
    if (!selectedCourtId || !stillValid) {
      setSelectedCourtId(courts[0]._id)
    }
  }, [courts, selectedCourtId])

  const {
    data: availability = null,
    isLoading: isLoadingAvailability,
    isFetching: isFetchingAvailability,
  } = useQuery({
    queryKey: ['club-court-availability', iClubId, selectedCourtId, isPreview],
    enabled: !!iClubId && !!selectedCourtId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await getCourtAvailabilityByClubIdAction({
        iClubId: iClubId!,
        iCourtId: selectedCourtId,
        isPreview,
      })
      if (res?.error) throw new Error(res.error)
      return (res?.data as CourtAvailabilityData) || null
    },
  })

  const courtOptions: CourtOption[] = useMemo(() => {
    return courts.map((c) => ({ value: c._id, label: c.sCourtName }))
  }, [courts])

  const selectedOption = useMemo(() => {
    return courtOptions.find((o) => o.value === selectedCourtId) || null
  }, [courtOptions, selectedCourtId])

  const courtsTotal = courts.length

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

      {bShowAvailabeCourts && (
        <div className="max-w-[944px] mx-auto px-3 pt-[128px] mxs:pt-10 pb-[128px] mxs:pb-10">
          <div className="flex ssm:items-center ssm:justify-between mb-[72px] mxs:mb-6 mxsm:flex-col mxsm:gap-5">
            <h2 className="text-4xl mxs:text-2xl font-bold heading-font text-neturalDark uppercase">
              COURT AVAILABILITY
            </h2>
            {bShowClubmatchButton && (
            <Button
              className="mxs:w-full"
              href={
                'https://portal.clubmatch.co.uk/court-availability' as any
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Book with Clubmatch
            </Button>
            )}
          </div>

          {!isLoadingCourts && !courts.length ? (
            <EmptyState description="No courts are currently available." />
          ) : (
            <>
              <div className="flex ssm:items-end ssm:justify-between gap-4 mb-[72px] mxsm:mb-6 mxsm:flex-col">
                <div className="w-[256px] shrink-0">
                  <CustomSelect
                    options={courtOptions}
                    value={selectedOption}
                    placeholder="Select court"
                    className="w-[256px]"
                    isLoading={isLoadingCourts}
                    isClearable={false}
                    onChange={(selected: any) => {
                      const value = selected?.value
                      if (typeof value === 'string') setSelectedCourtId(value)
                    }}
                  />
                </div>
                {!!courtsTotal && (
                  <p className="text-neturalDark font-bold text-2xl mxs:text-center">
                    {courtsTotal} courts total
                  </p>
                )}
              </div>

              <CourtAvailabilityCalendar
                availability={availability}
                selectedCourtId={selectedCourtId}
                isLoading={isLoadingAvailability && !availability}
                isFetching={isFetchingAvailability && !!availability}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
