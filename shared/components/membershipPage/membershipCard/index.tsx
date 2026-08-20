import IconUser from '@/shared/icon/user'
import IconSucess from '@/shared/icon/sucess'

export type MembershipPlan = {
  _id: string
  sName: string
  ePlanType?: string | null
  eTermLength?: string | null
  nCostPerPeriod?: number
  nCapacity?: number
  aGender?: string[]
  nMinAge?: number
  nMaxAge?: number
  bWaitingList?: boolean
  bIsFull?: boolean
}

const PLAN_TYPE_LABEL: Record<string, string> = {
  ct: 'Continuous',
  fd: 'Fixed duration',
}

const GENDER_LABEL: Record<string, string> = {
  m: 'Men',
  f: 'Women',
}

function formatPrice(value?: number) {
  const amount = typeof value === 'number' ? value : 0
  return `£${amount.toFixed(2)}`
}

function formatAudience(plan: MembershipPlan) {
  const genders = (plan.aGender || [])
    .map((g) => GENDER_LABEL[g] || g)
    .filter(Boolean)

  let audience = 'Adults'
  if (genders.length === 1) audience = genders[0]
  else if (genders.length > 1) audience = 'Adults'

  const capacity =
    typeof plan.nCapacity === 'number' ? `Up to ${plan.nCapacity} members` : null

  return [capacity, audience].filter(Boolean).join(' • ')
}

function MembershipCard({
  plan,
  joinHref,
}: {
  plan: MembershipPlan
  joinHref?: string
}) {
  const isWaitlist = !!(plan.bWaitingList || plan.bIsFull)
  const typeLabel = PLAN_TYPE_LABEL[plan.ePlanType || ''] || 'Membership'
  const meta = formatAudience(plan)

  return (
    <div
      className={`flex items-center gap-5 justify-between rounded-lg px-7 py-6 ${
        isWaitlist ? 'bg-[#F5F9F9]' : 'bg-light-100'
      }`}
    >
      <div className="min-w-0">
        <span
          className={`w-8 h-8 block ${
            isWaitlist ? 'text-neutral-medium' : 'text-primary'
          }`}
        >
          {isWaitlist ? <IconUser /> : <IconSucess />}
        </span>
        <p className="mt-2 text-base font-medium text-neutral-medium">{typeLabel}</p>
        <p className="text-neutral-dark font-medium text-2xl mxsm:text-xl truncate">
          {plan.sName}
        </p>
        {meta && (
          <p className="text-neutral-light font-medium mxsm:text-sm">{meta}</p>
        )}
      </div>
      <div className="text-center flex-shrink-0">
        <p className="text-2xl font-bold text-neutral-dark">
          {formatPrice(plan.nCostPerPeriod)}
        </p>
        {joinHref ? (
          <a
            href={joinHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center font-medium text-sm py-1.5 px-7 rounded-full mt-14 text-white ${
              isWaitlist ? 'bg-neturalDark' : 'bg-primary'
            }`}
          >
            {isWaitlist ? 'Join waitlist' : 'Join'}
          </a>
        ) : (
          <button
            type="button"
            className={`font-medium text-sm py-1.5 px-7 rounded-full mt-14 text-white ${
              isWaitlist ? 'bg-neturalDark' : 'bg-primary'
            }`}
          >
            {isWaitlist ? 'Join waitlist' : 'Join'}
          </button>
        )}
      </div>
    </div>
  )
}

export default MembershipCard
