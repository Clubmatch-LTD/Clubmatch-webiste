/* eslint-disable react/no-children-prop */
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader
        color="var(--primary-color)"
        height={4}
        showSpinner={false}
        shadow="0 0 8px var(--primary-color)"
        zIndex={100}
      />
      {children}
    </QueryClientProvider>
  )
}
