import s from './style.module.css'
import { VideoProps } from './types'

export default function Video({ src }: VideoProps) {
  return (
    <div className={s.docsVideo}>
      <video controls>
        <source src={src} />
      </video>
    </div>
  )
}
