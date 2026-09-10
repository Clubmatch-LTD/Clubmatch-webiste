function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const ABSOLUTE_HREF = /^(https?:\/\/|\/|#|mailto:|tel:)/i

function resolveHref(raw: string): string | null {
  const href = raw.trim()
  if (!href || href === '#' || href === 'about:blank') return null
  if (ABSOLUTE_HREF.test(href)) return href
  return `https://${href.replace(/^\/+/, '')}`
}

function normalizeRichTextLinks(html: string): string {
  return html.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (_, attrs, inner) => {
      const hrefMatch = attrs.match(/\bhref\s*=\s*["']([^"']*)["']/i)
      if (!hrefMatch) return `<a${attrs}>${inner}</a>`

      const href = resolveHref(hrefMatch[1])
      if (!href) return `<a${attrs}>${inner}</a>`

      let nextAttrs = attrs.replace(
        /\bhref\s*=\s*["'][^"']*["']/i,
        `href="${href}"`
      )

      if (/^https?:\/\//i.test(href) && !/\btarget\s*=/i.test(nextAttrs)) {
        nextAttrs += ' target="_blank" rel="noopener noreferrer"'
      }

      return `<a${nextAttrs}>${inner}</a>`
    }
  )
}

/** Convert intro/section description to renderable HTML (supports Quill HTML and legacy plain text). */
export function toRichTextHtml(content: string | null | undefined): string {
  const trimmed = content?.trim() ?? ''
  if (!trimmed) return ''

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return normalizeRichTextLinks(trimmed)
  }

  return trimmed
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')
}
