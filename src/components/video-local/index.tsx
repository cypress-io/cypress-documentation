import React from "react";
import s from "./style.module.css";
import { VideoProps } from "./types";

export default function LocalVideo({ src, title, autoPlay = false, poster }: VideoProps) {
  return (
    <div className={s.docsVideo}>
      {autoPlay ? (
      <video
        controls
        autoPlay
        muted
        loop
        preload="metadata"
        poster={poster}
      >
        <source src={src} />
      </video>
      ) : (
        <video controls preload="metadata" poster={poster}>
          <source src={src} />
        </video>
      )}
    </div>
  );
}
