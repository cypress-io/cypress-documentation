import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { IconProps } from "./types";

export default function Icon({ name }) {
  const iconName = name === "github" ? ["fab", "github"] : name;

  return <FontAwesomeIcon icon={iconName} />;
}
