'use client'

import { useEffect, useRef } from 'react'
import { toRichTextHtml } from '@/shared/utils/rich-text'

type RichTextContentProps = {
  content?: string | null
  className?: string
  variant?: 'default' | 'inverse'
}

function RichTextContent({
  content,
  className = '',
  variant = 'default'
}: RichTextContentProps) {
  const html = toRichTextHtml(content)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !html) return
    // Re-apply after mount so browser HTML normalization cannot desync React hydration
    el.innerHTML = html
  }, [html])

  if (!html) return null

  const variantClass =
    variant === 'inverse' ? 'rich-text-content--inverse' : ''

  return (
    <div
      ref={ref}
      className={`rich-text-content ${variantClass} ${className}`.trim()}
      // Quill/ClubSpark HTML is often auto-repaired by the browser (e.g. <br>, nesting),
      // which triggers React #418 during hydration.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default RichTextContent
