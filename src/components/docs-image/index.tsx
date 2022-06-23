import React from "react";
import s from "./style.module.css";
import { DocsImageProps } from "./types";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DocsImage({
  alt,
  src,
  title,
  noBorder,
}: DocsImageProps) {
  return (
    <img
      className={classNames(
        `${s.docsImage}`,
        `${noBorder ? `${s.imageNoBorder}` : ""}`,
        "object-contain"
      )}
      src={src}
      alt={alt}
      title={title}
    />
  );
}
