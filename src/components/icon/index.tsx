import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// TODO: refactor this component to be more efficient
export default function Icon({ name, color, inline, url, callout, contentType }) {
  const iconName = name === "github" ? ["fab", "github"] : name;
  const space = inline ? '.25rem' : '0.5rem'

  let content;

  if (callout) {
    content = callout;
  } else if (contentType === "lesson")  {
    content = 'Get the completed code for this lesson on GitHub';
  } else if (contentType === "rwa") {
    content = 'Real World App (RWA)'
    url = 'https://github.com/cypress-io/cypress-realworld-app'
  } else {
    content = url;
  }

  return (
    <>
      <FontAwesomeIcon icon={iconName} color={color} />
      { url ? <a href={url} style={{ marginLeft: space }}>{ content }</a> : null}
    </>
  )
}
