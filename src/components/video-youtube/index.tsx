import React from "react";
// import s from "./style.module.css";
import { VideoYouTubeProps } from "./types";

export default function VideoYouTube({ src, title }: VideoYouTubeProps) {
  return (
    <div className="embedContainer">
      <iframe src={src} title={title} allowFullScreen></iframe>
    </div>
  );
}
