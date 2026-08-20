/**
 * Lightweight fetch wrapper with request/response middleware.
 */
type FetcherOptions = RequestInit & {
  headers?: Record<string, string>
  responseType?: 'blob'
}

type RequestMiddleware = (payload: RequestInit, url: string) => RequestInit
type ResponseMiddleware = <T>(payload: T, url: string) => T

class Fetcher {
  baseurl: string
  options: FetcherOptions
  interceptor: {
    request: RequestMiddleware
    response: ResponseMiddleware
  }

  constructor(baseurl: string, options: FetcherOptions = {}) {
    this.baseurl = baseurl
    this.options = options
    this.interceptor = { request: (e) => e, response: (e) => e }
  }

  config(baseurl: string, options: FetcherOptions = {}) {
    this.baseurl = baseurl
    this.options = options
  }

  requestMiddleware(callback: RequestMiddleware) {
    this.interceptor.request = callback
  }

  responseMiddleware(callback: ResponseMiddleware) {
    this.interceptor.response = callback
  }

  async commonRequest({
    method,
    url,
    data,
    options
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'Delete'
    url: string
    data?: unknown
    options?: FetcherOptions
  }): Promise<any> {
    const payload: RequestInit = {
      method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      ...options
    }

    if (data) {
      ;(payload as RequestInit & { body: string }).body = JSON.stringify(data)
    }

    const response = await fetch(url, this.interceptor.request(payload, url))

    if (options?.responseType === 'blob') {
      const blob = await response.blob()
      if (!response.ok) {
        const error = new Error(response.statusText) as Error & { status?: number; data?: unknown }
        error.status = response.status
        error.data = blob
        this.interceptor.response(error, url)
        throw error
      }
      return this.interceptor.response(blob, url)
    }

    const parseJsonSafely = async () => {
      if (response.status === 204 || response.status === 205) return null
      const text = await response.text()
      if (!text) return null
      try {
        return JSON.parse(text)
      } catch {
        return text
      }
    }

    const result = await parseJsonSafely()

    if (!response.ok) {
      const message = (() => {
        if (typeof result !== 'object' || !result) return undefined
        const r = result as Record<string, unknown>
        const sMessage = r['sMessage']
        if (typeof sMessage === 'string' && sMessage) return sMessage
        const error = r['error']
        if (typeof error === 'object' && error) {
          const e = error as Record<string, unknown>
          const nested = e['sMessage']
          if (typeof nested === 'string' && nested) return nested
        }
        return undefined
      })()

      const messageOrFallback = message || response.statusText
      const error = new Error(messageOrFallback) as Error & { status?: number; data?: unknown }
      error.status = response.status
      error.data = result
      this.interceptor.response(error, url)
      throw error
    }

    return this.interceptor.response(result, url)
  }

  async get(url: string, options?: FetcherOptions): Promise<any> {
    return await this.commonRequest({ method: 'GET', url: this.baseurl + url, options })
  }

  async post(url: string, data?: unknown, options?: FetcherOptions): Promise<any> {
    return await this.commonRequest({ method: 'POST', url: this.baseurl + url, data, options })
  }

  async put(url: string, data?: unknown, options?: FetcherOptions): Promise<any> {
    return await this.commonRequest({ method: 'PUT', url: this.baseurl + url, data, options })
  }

  async delete(url: string, data?: unknown, options?: FetcherOptions): Promise<any> {
    return await this.commonRequest({ method: 'Delete', url: this.baseurl + url, data, options })
  }
}

export default Fetcher

