import React from "react";
import s from "./style.module.css";
import { VideoProps } from "./types";

export default function LocalVideo({ src, title, autoPlay = false }: VideoProps) {
  return (
    <div className={s.docsVideo}>
      {autoPlay ? (
      <video 
        controls 
        autoPlay
        muted 
        loop
      >
        <source src={src} />
      </video>
      ) : (
        <video controls>
          <source src={src} />
        </video>
      )}
    </div>
  );
}
