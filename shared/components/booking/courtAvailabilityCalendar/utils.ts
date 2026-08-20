export type BookedSlot = Record<string, unknown>

export type CourtAvailabilityCourt = {
  _id: string
  sCourtName: string
  aBookedSlots?: BookedSlot[]
}

export type CourtAvailabilityData = {
  sClubTimeZone?: string
  nOpeningTime: number
  nClosingTime: number
  nBookingSlotDuration: number
  nRangeStartTime: number
  nRangeEndTime: number
  nCourtsTotal: number
  aCourts: CourtAvailabilityCourt[]
}

type YMD = { year: number; month: number; day: number }

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export function formatMinutesToHHMM(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${pad2(h)}:${pad2(m)}`
}

function getZonedYMD(ms: number, timeZone: string): YMD {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(ms))

  const map: Record<string, string> = {}
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
  }
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = dtf.formatToParts(date)
  const map: Record<string, string> = {}
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value
  }

  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  )
  return asUTC - date.getTime()
}

export function zonedTimeToUtcMs(
  ymd: YMD,
  hour: number,
  minute: number,
  timeZone: string
) {
  const utcGuess = Date.UTC(ymd.year, ymd.month - 1, ymd.day, hour, minute, 0)
  const offset = getTimeZoneOffsetMs(new Date(utcGuess), timeZone)
  return utcGuess - offset
}

function getWeekdayLabel(ms: number, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
  }).format(new Date(ms))
}

function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
) {
  return aStart < bEnd && aEnd > bStart
}

function getBookedRangeMs(
  slot: BookedSlot,
  fallbackDurationMs: number
): { startMs: number; endMs: number } | null {
  let startMs: number | undefined
  let endMs: number | undefined

  for (const [key, val] of Object.entries(slot)) {
    let numVal: number | null = null
    if (typeof val === 'number') numVal = val
    if (typeof val === 'string') {
      const parsed = Number(val)
      if (Number.isFinite(parsed)) numVal = parsed
    }
    if (numVal === null || numVal < 1e11) continue

    const k = key.toLowerCase()
    if (
      !startMs &&
      (k.includes('start') || k.includes('from') || k.includes('begin'))
    ) {
      startMs = numVal
    }
    if (
      !endMs &&
      (k.includes('end') || k.includes('to') || k.includes('finish'))
    ) {
      endMs = numVal
    }
  }

  if (typeof startMs !== 'number') return null
  if (typeof endMs !== 'number') endMs = startMs + fallbackDurationMs
  return { startMs, endMs }
}

function isBookedForCourt(
  court: CourtAvailabilityCourt,
  slotStartMs: number,
  slotEndMs: number,
  fallbackDurationMs: number
) {
  const bookedSlots = court.aBookedSlots || []
  if (!bookedSlots.length) return false

  return bookedSlots.some((slot) => {
    const range = getBookedRangeMs(slot, fallbackDurationMs)
    if (!range) return false
    return rangesOverlap(range.startMs, range.endMs, slotStartMs, slotEndMs)
  })
}

export function buildAvailabilityGrid(availability: CourtAvailabilityData) {
  const timeZone = availability.sClubTimeZone || 'UTC'
  const openingDate = new Date(availability.nOpeningTime)
  const closingDate = new Date(availability.nClosingTime)

  const openingHour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      hour12: false,
    }).format(openingDate)
  )
  const openingMinute = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      minute: '2-digit',
    }).format(openingDate)
  )
  const closingHour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      hour12: false,
    }).format(closingDate)
  )
  const closingMinute = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      minute: '2-digit',
    }).format(closingDate)
  )

  const openingMinutes = openingHour * 60 + openingMinute
  const closingMinutes = closingHour * 60 + closingMinute
  const slotDurationMin = availability.nBookingSlotDuration || 30
  const slotDurationMs = slotDurationMin * 60_000

  const timeSlots: number[] = []
  for (
    let m = openingMinutes;
    m + slotDurationMin <= closingMinutes;
    m += slotDurationMin
  ) {
    timeSlots.push(m)
  }

  const weekdayMap: Record<string, number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  }

  const dayColumns: Array<{ label: string; ymd: YMD } | null> = Array(7).fill(null)
  const ONE_DAY_MS = 86_400_000

  for (let i = 0; i < 7; i += 1) {
    const dayMs = availability.nRangeStartTime + i * ONE_DAY_MS
    const label = getWeekdayLabel(dayMs, timeZone)
    const col = weekdayMap[label]
    if (typeof col === 'number') {
      dayColumns[col] = { label, ymd: getZonedYMD(dayMs, timeZone) }
    }
  }

  return {
    timeZone,
    timeSlots,
    slotDurationMs,
    dayColumns,
    courtsTotal: availability.nCourtsTotal,
    aCourts: availability.aCourts || [],
  }
}

export function isSlotAvailable(
  grid: ReturnType<typeof buildAvailabilityGrid>,
  day: { label: string; ymd: YMD },
  startMinutes: number,
  selectedCourtId: string
) {
  const hour = Math.floor(startMinutes / 60)
  const minute = startMinutes % 60
  const slotStartMs = zonedTimeToUtcMs(day.ymd, hour, minute, grid.timeZone)
  const slotEndMs = slotStartMs + grid.slotDurationMs

  if (selectedCourtId === 'all') {
    return grid.aCourts.some(
      (court) =>
        !isBookedForCourt(court, slotStartMs, slotEndMs, grid.slotDurationMs)
    )
  }

  const court = grid.aCourts.find((c) => c._id === selectedCourtId)
  if (!court) return false
  return !isBookedForCourt(court, slotStartMs, slotEndMs, grid.slotDurationMs)
}
