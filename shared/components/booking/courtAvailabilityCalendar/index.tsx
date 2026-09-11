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
      <div className="min-h-[520px] flex items-center justify-center text-neturalMedium font-medium" role="status">
        Loading court availability…
      </div>
    )
  }

  if (!grid || !grid.timeSlots.length) {
    return (
      <div className="min-h-[520px] flex items-center justify-center text-neturalMedium font-medium">
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
        <div
          className="max-h-[520px] overflow-y-auto overscroll-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          tabIndex={0}
          role="region"
          aria-label="Court availability schedule"
        >
          <table className="w-full border-collapse">
            <caption className="sr-only">
              Court availability by day and time. Green cells are available; red cells are unavailable.
            </caption>
            <thead className="sticky top-0 z-[2] bg-white">
              <tr className="border-b border-light200">
                <th scope="col" className="bg-white w-[11%] p-0">
                  <span className="sr-only">Time</span>
                </th>
                {grid.dayColumns.map((day, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className="px-3 py-[18px] font-bold text-sm text-center text-neturalDark border-l border-light200 bg-white"
                  >
                    {day?.label || ''}
                  </th>
                ))}
                <th scope="col" className="border-l border-light200 bg-white w-[11%] p-0">
                  <span className="sr-only">Time</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {grid.timeSlots.map((startMinutes) => {
                const timeLabel = formatMinutesToHHMM(startMinutes)

                return (
                  <tr key={startMinutes}>
                    <th
                      scope="row"
                      className="sticky left-0 z-[1] px-2 py-2.5 font-semibold text-sm text-center text-neturalDark border-t border-light200 bg-white"
                    >
                      {timeLabel}
                    </th>

                    {grid.dayColumns.map((day, dayColIdx) => {
                      if (!day) {
                        return (
                          <td
                            key={dayColIdx}
                            className="p-0 min-h-[40px] border-t border-l border-light200 bg-danger100"
                          >
                            <span className="sr-only">No day</span>
                          </td>
                        )
                      }

                      const available = isSlotAvailable(
                        grid,
                        day,
                        startMinutes,
                        selectedCourtId
                      )
                      const slotLabel = `${day.label} ${timeLabel} ${
                        available ? 'available' : 'unavailable'
                      }`

                      return (
                        <td
                          key={dayColIdx}
                          className="p-0 border-t border-l border-light200"
                        >
                          <button
                            type="button"
                            aria-label={slotLabel}
                            className={`block w-full min-h-[40px] p-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neturalDark ${
                              available ? 'bg-primary500' : 'bg-danger100'
                            }`}
                          />
                        </td>
                      )
                    })}

                    <td
                      aria-hidden="true"
                      className="sticky right-0 z-[1] px-2 py-2.5 font-semibold text-sm text-center text-neturalDark border-t border-l border-light200 bg-white"
                    >
                      {timeLabel}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center" aria-live="polite">
          <span className="text-sm font-medium text-neturalMedium bg-white/90 px-4 py-2 rounded-full">
            Updating…
          </span>
        </div>
      )}
    </div>
  )
}

export default CourtAvailabilityCalendar
