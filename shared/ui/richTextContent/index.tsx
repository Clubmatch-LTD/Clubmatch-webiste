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
  if (!html) return null

  const variantClass =
    variant === 'inverse' ? 'rich-text-content--inverse' : ''

  return (
    <div
      className={`rich-text-content ${variantClass} ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default RichTextContent
