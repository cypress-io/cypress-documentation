import React from "react";
import { ListProps } from "./types";

export default function List({ children }: ListProps) {
  return <ul>{children}</ul>;
}
