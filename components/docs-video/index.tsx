import { DocsVideoProps } from './types'
import Video from '../video'
import VideoYouTube from '../video-youtube'
import VideoVimeo from '../video-vimeo'

export default function DocsVideo({ src, title }: DocsVideoProps) {
  const isYouTube = src.includes('youtube')
  const isVimeo = src.includes('vimeo')
  const isLocalVideo = !src.includes('youtube') && !src.includes('vimeo')

  return (
    <>
      {isYouTube && <VideoYouTube src={src} title={title} />}
      {isVimeo && <VideoVimeo src={src} title={title} />}
      {isLocalVideo && <Video src={src} title={title} />}
    </>
  )
}
