'use client'
import React from 'react'
import Link from 'next/link'
import { ButtonLoader } from '../loaders'
import { Url } from 'next/dist/shared/lib/router/router'
const variantClasses = {
  primary: 'main-bg text-white hover:bg-bg-4 hover:text-white font-bold',
  white: 'bg-white border-white text-main hover:bg-white/20 font-bold hover:text-white ',
  lightWhite: 'bg-white/20 text-white hover:bg-white font-bold text-hover'
}

const loadingClasses = 'opacity-1 cursor-wait'

type ButtonProps = {
  className?: string,
  children: React.ReactNode,
  href?: Url,
  target?: string,
  variant?: 'primary' | 'white' | 'lightWhite',
  disabled?: boolean,
  isLoading?: boolean,
}
function Button({ className = '', children, href, target = '_self', variant = 'primary', disabled, isLoading = false, ...props }: ButtonProps & React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>) {
  const Tag = href ? Link : 'button'
  const variantClass = variantClasses[variant as keyof typeof variantClasses] || variantClasses.primary

  const disabledClasses = '!bg-gray-20 !text-gray-60 !cursor-not-allowed pointer-events-none'

  return (
    <Tag
      href={href as Url}
      target={target}
      className={`${className} ${variantClass} ${disabled ? disabledClasses : ''} ${isLoading ? loadingClasses : ''} py-3 px-5 mxsm:px-3 mxsm:py-2 rounded-full flex items-center justify-center relative  transition-all duration-300 text-center focus-within:outline-0 w-fit group mxsm:text-sm`}
      {...props}
    >
      <span className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">{isLoading && <ButtonLoader />}</span>
      <span className={isLoading ? 'opacity-0 flex items-center justify-center gap-2' : 'flex items-center justify-center gap-2.5'}>
        {children}
      </span>
    </Tag>
  )
}
export default Button
