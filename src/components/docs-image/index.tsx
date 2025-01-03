import React from 'react'
import s from './style.module.css'
import { DocsImageProps } from './types'

export default function DocsImage({
  alt,
  caption,
  src,
  title,
  width,
  noBorder,
  style,
}: DocsImageProps) {
  return (
    <div style={style} className={s.docsImageContainer}>
      <img
        src={src}
        alt={alt || title || caption}
        title={title}
        style={width && { width }}
        className={noBorder ? s.noBorder : s.docsImage}
      />
      {caption && (
        <p className={s.caption} style={width && { width, maxWidth: '100%' }}>
          {caption}
        </p>
      )}
    </div>
  )
}
