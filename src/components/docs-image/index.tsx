import React from 'react'
import s from './style.module.css'
import { DocsImageProps } from './types'

export default function DocsImage({
  alt,
  caption,
  src,
  title,
  width,
  height,
}: DocsImageProps) {
  let style: Record<string, number | string> = { maxWidth: '100%' }
  if (width) {
    style.width = width
  }
  if (height) {
    style.height = height
  }

  return (
    <div className={s.docsImage}>
      <img
        src={src}
        alt={alt || title || caption}
        title={title}
        style={style}
      />
      {caption && (
        <p className={s.caption} style={width && { width, maxWidth: '100%' }}>
          {caption}
        </p>
      )}
    </div>
  )
}
