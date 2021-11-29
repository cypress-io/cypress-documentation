import s from './style.module.css'
import { VideoVimeoProps } from './types'

export default function VideoYouTube({ src, title }: VideoVimeoProps) {
  const videoId = () => {
    const idStartIndex = src.lastIndexOf('/') + 1

    return src.slice(idStartIndex)
  }

  return (
    <div className={s.embedContainer}>
      <iframe
        src={`https://player.vimeo.com/video/${videoId()}`}
        title={title}
        allowFullScreen
      ></iframe>
    </div>
  )
}
