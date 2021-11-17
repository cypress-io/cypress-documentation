import s from './style.module.css'
import Image from 'next/image'
import { DocsImageProps } from './types'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DocsImage({ alt, src, title, noBorder }: DocsImageProps) {
  return (
    <Image
      className={classNames(`${s.docsImage}`, `${noBorder ? `${s.imageNoBorder}` : ''}`)}
      src={src}
      alt={alt}
      title={title}
      layout="fill"
    />
  )
}
