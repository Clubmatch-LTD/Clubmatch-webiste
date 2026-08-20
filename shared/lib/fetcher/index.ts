import { NEXT_PUBLIC_API_URL } from '@/shared/constant'
import Fetcher from './fetcher'

export { default as Fetcher } from './fetcher'

export const fetcherClient = new Fetcher((NEXT_PUBLIC_API_URL || '').replace(/\/+$/, ''))


// Default client-side auth header injection (safe on SSR).
if (typeof window !== 'undefined') {
  fetcherClient.requestMiddleware((payload) => {
    const token = window.localStorage?.getItem('token')

    const headers = new Headers(payload.headers)
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', token)
    }

    return { ...payload, headers }
  })
}
