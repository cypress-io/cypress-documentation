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
  noBorder,
}: DocsImageProps) {
  return (
    <div className={s.docsImage}>
      <img
        className={classNames(
          `${noBorder ? `${s.imageNoBorder}` : ''}`,
          'object-contain'
        )}
        src={src}
        alt={alt || title || caption}
        title={title}
      />
      {caption && <p className={s.caption}>{caption}</p>}
    </div>
  )
}
