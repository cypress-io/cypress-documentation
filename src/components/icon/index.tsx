import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Note: Docusaurus/MDX v1 has parsing issues and some markdown renders statically when beside a component or
HTML tag while NOT in a section header or table, etc. https://github.com/mdx-js/mdx/issues/1571#issuecomment-853384939

Exact issue here is noted here https://docusaurus.io/docs/markdown-features/react#markdown-and-jsx-interoperability. 

This should be fixed when DS moves to MDX v2 https://github.com/facebook/docusaurus/issues/4029

For now, we we wrap the anchor in this component for reusability. Other in-line workarounds are add &nbsp; before the <Icon />
or replace markdown syntax with equivalient html tags. */

// TODO: refactor this component after DS moves to MDX v2.

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
