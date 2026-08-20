'use client'

import { useMemo } from 'react'
import {
  buildAvailabilityGrid,
  formatMinutesToHHMM,
  isSlotAvailable,
  type CourtAvailabilityData,
} from './utils'

type CourtAvailabilityCalendarProps = {
  availability: CourtAvailabilityData | null
  selectedCourtId: string
  isLoading?: boolean
  isFetching?: boolean
}

function CourtAvailabilityCalendar({
  availability,
  selectedCourtId,
  isLoading = false,
  isFetching = false,
}: CourtAvailabilityCalendarProps) {
  const grid = useMemo(
    () => (availability ? buildAvailabilityGrid(availability) : null),
    [availability]
  )

  if (isLoading) {
    return (
      <div className="min-h-[520px] flex items-center justify-center text-neutralLight font-medium">
        Loading court availability…
      </div>
    )
  }

  if (!grid || !grid.timeSlots.length) {
    return (
      <div className="min-h-[520px] flex items-center justify-center text-neutralLight font-medium">
        No availability to display.
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto mxsm:-mx-3">
      <div
        className={`mxsm:min-w-[900px] border border-light200 rounded-lg overflow-hidden bg-white transition-opacity ${
          isFetching ? 'opacity-60 pointer-events-none' : ''
        }`}
      >
        <div className="grid grid-cols-9 border-b border-light200 bg-white">
          <div className="bg-white" />
          {grid.dayColumns.map((day, idx) => (
            <div
              key={idx}
              className="px-3 py-[18px] font-bold text-sm text-center text-neutralLight border-l border-light200 bg-white"
            >
              {day?.label || ''}
            </div>
          ))}
          <div className="border-l border-light200 bg-white" />
        </div>

        <div className="max-h-[520px] overflow-y-auto overscroll-contain">
          {grid.timeSlots.map((startMinutes) => {
            const timeLabel = formatMinutesToHHMM(startMinutes)

            return (
              <div key={startMinutes} className="grid grid-cols-9">
                <div className="sticky left-0 z-[1] px-2 py-2.5 font-semibold text-sm text-center text-neutralLight border-t border-light200 bg-white">
                  {timeLabel}
                </div>

                {grid.dayColumns.map((day, dayColIdx) => {
                  if (!day) {
                    return (
                      <div
                        key={dayColIdx}
                        className="p-2 min-h-[40px] border-t border-l border-light200 bg-danger100"
                      />
                    )
                  }

                  const available = isSlotAvailable(
                    grid,
                    day,
                    startMinutes,
                    selectedCourtId
                  )

                  return (
                    <div
                      key={dayColIdx}
                      className={`p-2 min-h-[40px] border-t border-l border-light200 transition-colors ${
                        available ? 'bg-primary500' : 'bg-danger100'
                      }`}
                      aria-label={`${day.label} ${timeLabel} ${
                        available ? 'available' : 'unavailable'
                      }`}
                    />
                  )
                })}

                <div className="sticky right-0 z-[1] px-2 py-2.5 font-semibold text-sm text-center text-neutralLight border-t border-l border-light200 bg-white">
                  {timeLabel}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-neturalMedium bg-white/90 px-4 py-2 rounded-full">
            Updating…
          </span>
        </div>
      )}
    </div>
  )
}

export default CourtAvailabilityCalendar
