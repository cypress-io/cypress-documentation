import React from "react";
import s from "./style.module.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComponentOnlyBadge() {
  return (
    <>
      <a href="/guides/core-concepts/testing-types#What-is-Component-Testing">
        <div className={classNames(`${s.badge}`, `${s["hint"]}`)}>
          Component Only
        </div>
      </a>
    </>
  );
}
