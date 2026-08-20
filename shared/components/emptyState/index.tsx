import { ReactNode } from 'react'
import IconClub from '@/shared/icon/club'

type EmptyStateProps = {
    title?: string
    description?: string
    children?: ReactNode
    className?: string
}

function EmptyState({
    title,
    description = 'Nothing here yet',
    children,
    className = ''
}: EmptyStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center py-16 mxs:py-10 ${className}`}
            role="status"
        >
            <span className="w-28 h-28 mxs:w-20 mxs:h-20 block text-light-100" aria-hidden="true">
                <IconClub />
            </span>

            {title && (
                <h2 className="mt-6 text-2xl font-bold uppercase text-neturalDark heading-font mxs:text-xl">
                    {title}
                </h2>
            )}
            {description && (
                <p className="mt-2 max-w-lg font-medium text-neutral-light text-lg mxs:text-base">
                    {description}
                </p>
            )}
            {children && <div className="mt-6 flex justify-center">{children}</div>}
        </div>
    )
}

export default EmptyState
