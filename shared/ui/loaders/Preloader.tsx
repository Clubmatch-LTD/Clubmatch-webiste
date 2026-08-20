'use client'

import React, { useEffect, useState } from 'react'

const Preloader = () => {
  const [loading, setLoading] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    const removeTimer = setTimeout(() => {
      setShouldRender(false)
    }, 2600)
    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center transition-[opacity,visibility] duration-500 ease-in-out ${
        !loading ? 'opacity-0 invisible' : 'opacity-100 visible'
      }`}
    >
      {/* Background */}
      <div className="text-neutral-white h-full w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ffffff] to-[#ffffff]">

        {/* Inner content */}
        <div className="relative flex flex-col items-center gap-7 animate-cmFadeUp">

          {/* Logo wrap */}
          <div className="relative w-[120px] h-[120px] flex items-center justify-center">

            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border-2 border-[rgba(155,202,62,0.4)] animate-cmRingPulse" />
            <div className="absolute inset-0 rounded-full border-2 border-[rgba(155,202,62,0.4)] animate-cmRingPulse [animation-delay:1.1s]" />

            {/* Brand icon */}
            <svg
              className="w-[76px] h-[76px] animate-cmIconSpin drop-shadow-[0_0_18px_rgba(155,202,62,0.5)]"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.6668 7.58343C10.9497 11.487 6.5075 7.91917 4.07305 13.3591C2.60395 12.3113 1.58275 10.6924 1.34047 8.82813C7.11602 9.68943 7.24111 2.3045 11.9971 3.03982C13.4908 3.27074 14.567 5.89169 14.6668 7.58343ZM5.57794 14.1648C10.7747 16.146 13.7672 11.7401 14.3272 10.1057C10.756 12.451 7.46992 9.97585 5.57794 14.1648ZM9.68026 1.56002C5.50614 0.479406 1.79305 3.42507 1.3335 7.16672C5.37609 7.85823 6.01282 2.79734 9.68026 1.56002Z"
                fill="#9BCA3E"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preloader
