import React from 'react'
import s from './style.module.css'
import { DocsImageProps } from './types'

export default function DocsImage({
  alt,
  caption,
  src,
  title,
  width
}: DocsImageProps) {
  return (
    <div className={s.docsImage}>
      <img
        src={src}
        alt={alt || title || caption}
        title={title}
        style={width && {width}}
      />
      {caption && <p className={s.caption}>{caption}</p>}
    </div>
  )
}
