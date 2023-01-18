import React from "react";
import { VideoVimeoProps } from "./types";

export default function VideoVimeo({ src, title }: VideoVimeoProps) {
  const videoId = () => {
    const idStartIndex = src.lastIndexOf("/") + 1;
    return src.slice(idStartIndex);
  };

  return (
    <div className="embedContainer">
      <iframe
        src={`https://player.vimeo.com/video/${videoId()}`}
        title={title}
        allowFullScreen
      >
      </iframe>
    </div>
  );
}
