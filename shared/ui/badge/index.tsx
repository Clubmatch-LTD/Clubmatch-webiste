import React from 'react'

type BadgeProps = {
  children: React.ReactNode
  href?: string
  target?: string
  className?: string
}

function Badge({ children, href, target = '_blank', className = '' }: BadgeProps) {
  const classes = `bg-light-150 text-neturalDark font-medium text-sm py-2 px-5 rounded-full hover:bg-light-400 transition-colors ${className}`

  if (href) {
    const sLink = /^https?:\/\//i.test(href) ? href : `https://${href}`
    return (
      <a href={sLink} target={target} rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return <span className={classes}>{children}</span>
}

export default Badge
