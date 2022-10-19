import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Note: Docusaurus/MDX has parsing issues and some markdown renders statically when beside a component or HTML tag while NOT in a section header or table, etc. https://github.com/facebook/docusaurus/discussions/6886#discussioncomment-2328085 For now, we we wrap the anchor in this component for reusability.

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
      <a href={url} style={{ marginLeft: space }}>
        { content }
      </a>
    </>
  )
}
