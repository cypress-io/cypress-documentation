import React from "react";

export default function Logo({ alt, src, title }) {
  return (
    <img
      className="logo"
      src={ src }
      title={ title }
      alt={ alt || title }
    />
  )
}