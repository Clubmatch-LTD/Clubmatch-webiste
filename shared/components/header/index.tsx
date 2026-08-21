'use client'

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import MyImage from "@/shared/ui/myImage"
import logo from '@/assets/images/wstc.svg'
import Button from "@/shared/ui/button"
import IconMenu from "@/shared/icon/menu"
import IconClose from "@/shared/icon/close"
import IconChevronDown from "@/shared/icon/chevronDown"
import Link from "next/link"
import { NEXT_PUBLIC_DOMAIN } from "@/shared/constant"

type NavMenuItem = {
    sSlug: string
    sLabel: string
    aChildren?: NavMenuItem[]
}

type ResolvedMenuItem = {
    label: string
    href: string
    children: ResolvedMenuItem[]
}

function buildMenuItem(item: NavMenuItem, parentHref: string): ResolvedMenuItem {
    const label = item.sLabel || item.sSlug.charAt(0).toUpperCase() + item.sSlug.slice(1).replace(/-/g, ' ')
    const href = item.sSlug === 'home' ? parentHref : `${parentHref}/${item.sSlug}`
    return {
        label,
        href,
        children: (item.aChildren || []).map(child => buildMenuItem(child, href))
    }
}

function Header({ 
    logo: siteLogo, 
    showLogo = true,
    siteSegment, 
    menuItems: dynamicMenuItems 
}: { 
    logo?: string, 
    showLogo?: boolean,
    siteSegment?: string, 
    menuItems?: NavMenuItem[] 
}) {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const base = siteSegment ? `/${siteSegment}` : ""
    
    const menuItems: ResolvedMenuItem[] = (dynamicMenuItems && dynamicMenuItems.length > 0)
        ? dynamicMenuItems.map(item => buildMenuItem(item, base))
        : [{ label: 'Home', href: base, children: [] }]

    useEffect(() => {
        const html = document.documentElement
        const body = document.body
        const prev = {
            htmlOverflow: html.style.overflow,
            bodyOverflow: body.style.overflow,
        }
        if (isMenuOpen) {
            html.style.overflow = "hidden"
            body.style.overflow = "hidden"
        } else {
            html.style.overflow = prev.htmlOverflow
            body.style.overflow = prev.bodyOverflow
        }

        return () => {
            html.style.overflow = prev.htmlOverflow
            body.style.overflow = prev.bodyOverflow
        }
    }, [isMenuOpen])

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY >= 48)
        }

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [pathname])

    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const useSolidHeaderBg = isMenuOpen || isScrolled
    const portalBase = NEXT_PUBLIC_DOMAIN.replace(/\/$/, '')

    return (
        <header
            className={[
                'fixed top-0 left-0 w-full z-50 px-16 mxsm:px-3 flex items-center justify-between gap-10 transition-all duration-300 ease-out',
                isScrolled ? 'py-4 mxs:py-3' : 'py-10 mxs:py-4',
                useSolidHeaderBg ? 'main-bg' : 'bg-transparent',
            ].join(' ')}
        >
            <div>
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(v => !v)}
                    className={`mxsm:w-11 mxsm:h-11 mxsm:p-3 text-white relative border ${isMenuOpen ? 'border-white/20 bg-transparent backdrop-blur-[162px]' : 'border-transparent bg-white/20 backdrop-blur-[32px]'} z-[70] font-bold rounded-full flex items-center gap-3 transition-all duration-300 ease-out ${isScrolled ? 'py-2 px-4' : 'py-3 px-5'}`}
                >
                    <span className="w-6 h-6 block">
                        {isMenuOpen ? <IconClose /> : <IconMenu />}
                    </span>
                    <span className="mxsm:hidden">Menu</span>
                </button>
            </div>

            {/* Left slide panel */}
            <aside
                className={[
                    "fixed top-0 left-0 h-full w-full after:absolute after:inset-0 after:bg-gradient-overlay after:w-full after:h-full after:opacity-85 z-[60] shadow-2xl transition-transform duration-300 ease-out pt-[128px] mxs:pt-20",
                    isMenuOpen ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
            >
                <div className="flex flex-col gap-4 relative z-10 h-[calc(100dvh-128px)] mxs:h-[calc(100dvh-80px)] overflow-y-auto">
                    {menuItems.map(item => {
                        const hasChildren = item.children.length > 0
                        const isOpen = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <div key={item.href} className={hasChildren ? "group" : undefined}>
                                <div className={`px-20 mxs:px-5  relative after:absolute after:inset-0 after:bg-gradient-active after:w-full after:h-full after:opacity-0 aftre:transition-all after:duration-300 after:ease-out hover:after:opacity-20 ${pathname === item.href ? 'after:opacity-20' : ''}`}>
                                    <Link
                                        href={item.href}
                                        className="text-white text-xl mxs:text-base font-bold z-10 relative py-[25px] mxs:py-3 flex items-center gap-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                        {hasChildren && (
                                            <span className={`w-4 h-4 mxs:w-3.5 mxs:h-3.5 inline-block text-white/70 transition-transform duration-300 ease-out group-hover:rotate-180 ${isOpen ? 'rotate-180' : ''}`}>
                                                <IconChevronDown />
                                            </span>
                                        )}
                                    </Link>
                                </div>
                                {hasChildren && (
                                    <div className={`grid group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                        <div className="overflow-hidden flex flex-col gap-4">
                                            {item.children.map(child => (
                                                <div key={child.href} className={`px-24 mxs:px-8 relative after:absolute after:inset-0 after:bg-gradient-active after:w-full after:h-full after:opacity-0 aftre:transition-all after:duration-300 after:ease-out hover:after:opacity-20 ${pathname === child.href ? 'after:opacity-20' : ''}`}>
                                                    <Link
                                                        href={child.href}
                                                        className="text-white/70 text-xl mxs:text-base font-bold z-10 relative py-[25px] mxs:py-3 flex items-center"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </aside>
            {showLogo && (
                <Link href={siteSegment ? `/${siteSegment}` : "/"} onClick={() => setIsMenuOpen(false)}>
                    <MyImage
                        src={siteLogo || logo}
                        alt='logo'
                        height={500}
                        width={500}
                        className={[
                            'object-contain flex-shrink-0 transition-all duration-300 ease-out',
                            isScrolled
                                ? 'max-w-[110px] mxs:w-[64px] mxs:h-6'
                                : 'max-w-[150px] mxs:w-[80px] mxs:h-8',
                        ].join(' ')}
                    />
                </Link>
            )}
            <div className="flex items-center gap-4 mxs:gap-2">
                <Button
                    href={`${portalBase}` as any}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="lightWhite"
                    className={isScrolled ? 'py-2 px-4' : ''}
                >
                    Sign in
                </Button>
                <Button
                    href={`${portalBase}/walk-through` as any}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="white"
                    className={isScrolled ? 'py-2 px-4' : ''}
                >
                    Register
                </Button>
            </div>
        </header>
    )
}

export default Header
