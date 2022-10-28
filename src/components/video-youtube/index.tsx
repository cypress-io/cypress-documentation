import React from "react";
import { VideoYouTubeProps } from "./types";

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

export default function VideoYouTube({ src, title }: VideoYouTubeProps) {
  const videoId = () => {
    const idStartIndex = src.lastIndexOf("/") + 1;

    return src.slice(idStartIndex);
  };

  return (
    // <div className="embedContainer">
    //   <iframe src={src} title={title} allowFullScreen></iframe>
    // </div>
    <div className="embedContainer">
      <LiteYouTubeEmbed 
        id={videoId()} title={title}
      />
    </div>

  );
}
