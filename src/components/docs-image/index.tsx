import React from 'react'
import s from './style.module.css'
import { DocsImageProps } from './types'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DocsImage({
  alt,
  caption,
  src,
  title,
}: DocsImageProps) {
  return (
    <div className={s.docsImage}>
      <img
        src={src}
        alt={alt || title || caption}
        title={title}
      />
      {caption && <p className={s.caption}>{caption}</p>}
    </div>
  )
}
