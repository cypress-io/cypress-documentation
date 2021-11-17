import s from './style.module.css'
import { VideoYouTubeProps } from './types'

export default function VideoYouTube({ src, title }: VideoYouTubeProps) {
  return (
    <div className={s.embedContainer}>
      <iframe src={src} title={title} allowFullScreen></iframe>
    </div>
  )
}
