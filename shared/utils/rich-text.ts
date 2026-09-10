import DOMPurify from 'isomorphic-dompurify'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Safe tags for club website intro/section HTML (Quill-compatible allow-list). */
const RICH_TEXT_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'ul',
  'ol',
  'li',
  'a',
  'h2',
  'h3',
  'h4'
]

const RICH_TEXT_ALLOWED_ATTR = ['href', 'target', 'rel', 'title']

/**
 * Sanitise club-authored rich text before rendering.
 * Strips script, event handlers, svg, iframe, object, embed, style, and javascript: URLs.
 */
export function sanitizeRichTextHtml(html: string): string {
  if (!html?.trim()) return ''

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: RICH_TEXT_ALLOWED_TAGS,
    ALLOWED_ATTR: RICH_TEXT_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // http(s) only for links (blocks javascript:, data:, etc.)
    ALLOWED_URI_REGEXP: /^(?:(?:https?):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'svg', 'iframe', 'object', 'embed', 'style', 'form', 'input', 'img'],
    FORBID_ATTR: ['style', 'class', 'src', 'srcdoc']
  })
}

const ABSOLUTE_HREF = /^(https?:\/\/|\/|#|mailto:|tel:)/i

function resolveHref(raw: string): string | null {
  const href = raw.trim()
  if (!href || href === '#' || href === 'about:blank') return null
  if (/^javascript:/i.test(href)) return null
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
      if (!href) {
        // Drop unsafe / empty links; keep inner text
        return inner
      }

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
    return normalizeRichTextLinks(sanitizeRichTextHtml(trimmed))
  }

  return trimmed
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')
}
