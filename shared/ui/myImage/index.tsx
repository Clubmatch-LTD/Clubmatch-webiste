'use client'
import { useState } from 'react'
import Image, { type ImageProps, type StaticImageData } from 'next/image'
import Placeholder from '@/assets/images/placeholder.svg'

type MyImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | StaticImageData
  alt?: string
  errorSrc?: string | StaticImageData
}

function MyImage({ src, className, alt, errorSrc, ...rest }: MyImageProps) {
  const fallback: string | StaticImageData = errorSrc ?? (Placeholder as unknown as string | StaticImageData)
  const [url, setUrl] = useState<string | StaticImageData>(src ?? fallback)

  return (
    <Image
      src={url}
      alt={alt || ''}
      className={className}
      {...rest}
      onError={e => {
        setUrl(fallback)
        if (typeof (rest as any)?.onError === 'function') (rest as any).onError(e)
      }}
    />
  )
}

export default MyImage
