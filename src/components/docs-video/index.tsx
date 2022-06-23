import React from "react";
import { DocsVideoProps } from "./types";
import Video from "@site/src/components/video";
import VideoYouTube from "@site/src/components/video-youtube";
import VideoVimeo from "@site/src/components/video-vimeo";

export default function DocsVideo({ src, title }: DocsVideoProps) {
  const isYouTube = src.includes("youtube");
  const isVimeo = src.includes("vimeo");
  const isLocalVideo = !src.includes("youtube") && !src.includes("vimeo");

  return (
    <>
      {isYouTube && <VideoYouTube src={src} title={title} />}
      {isVimeo && <VideoVimeo src={src} title={title} />}
      {isLocalVideo && <Video src={src} title={title} />}
    </>
  );
}
