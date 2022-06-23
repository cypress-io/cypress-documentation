import React from "react";
import s from "./style.module.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function E2EOnlyBadge() {
  return (
    <>
      <a href="/guides/core-concepts/testing-types#What-is-E2E-Testing">
        <div className={classNames(`${s.badge}`, `${s["hint"]}`)}>
          End-to-End Only
        </div>
      </a>
    </>
  );
}
