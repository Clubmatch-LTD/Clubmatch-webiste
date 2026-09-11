'use client'

import { useState } from 'react'
import MyImage from '@/shared/ui/myImage'
import notFoundArt from '@/assets/images/404-art.png'

function NotFoundPage({
  homeHref = '/',
  logo,
  clubName,
}: {
  homeHref?: string
  logo?: string | null
  clubName?: string | null
}) {
  const logoUrl = logo?.trim() || ''
  const name = clubName?.trim() || ''
  const [showLogo, setShowLogo] = useState(!!logoUrl)

  return (
    <main className="min-h-screen flex flex-col px-3 py-10 mxs:py-8">
      {(showLogo && logoUrl) || name ? (
        <div className="flex justify-center shrink-0 pt-4 mxs:pt-2">
          {showLogo && logoUrl ? (
            <a href={homeHref} className="inline-flex">
              <MyImage
                src={logoUrl}
                alt={name || 'Club logo'}
                height={80}
                width={200}
                className="max-h-16 mxs:max-h-12 w-auto max-w-[200px] object-contain"
                onError={() => setShowLogo(false)}
              />
            </a>
          ) : name ? (
            <a
              href={homeHref}
              className="text-xl mxs:text-lg font-bold text-neturalDark heading-font"
            >
              {name}
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <MyImage
          src={notFoundArt}
          alt="404"
          height={180}
          width={180}
          className="w-[180px] h-[180px] mxs:w-[140px] mxs:h-[140px] object-contain"
        />
        <h1 className="mt-10 mxs:mt-8 text-2xl mxs:text-xl font-bold text-neturalDark heading-font">
          404 – Page Not Found
        </h1>
        <p className="mt-3 max-w-md font-medium text-neutral-light text-lg mxs:text-base">
          We couldn’t find the page you were looking for. Try going back to homepage.
        </p>
        <a
          href={homeHref}
          className="mt-8 bg-light-100 text-neturalDark font-medium text-sm py-3 px-8 rounded-full hover:bg-light-200 transition-colors"
        >
          Go back to home
        </a>
      </div>
    </main>
  )
}

export default NotFoundPage
