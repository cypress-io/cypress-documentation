import React from "react";
import s from "./style.module.css";
import { BadgeProps } from "./types";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Badge({ type, path, children }: BadgeProps) {
  return (
    <>
      {path && (
        <a href={path}>
          <div className={classNames(`${s.badge}`, `${s[type]}`)}>
            {children}
          </div>
        </a>
      )}

      {!path && (
        <div className={classNames(`${s.badge}`, `${s[type]}`)}>{children}</div>
      )}
    </>
  );
}
