import React from 'react'
import s from './style.module.css'
import { DocsImageProps } from './types'

// The current full width of the main content area on the largest screen
const FULL_WIDTH = 938;

export default function DocsImage({
  alt,
  caption,
  src,
  title,
  fullWidth,
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
  if (fullWidth) {
    style.width = FULL_WIDTH;
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
