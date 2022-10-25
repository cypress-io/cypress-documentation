import React from "react";
import s from "./style.module.css";
import { VideoProps } from "./types";

export default function LocalVideo({ src }: VideoProps) {
  return (
    <div className={s.docsVideo}>
      <video controls>
        <source src={src} />
      </video>
    </div>
  );
}
