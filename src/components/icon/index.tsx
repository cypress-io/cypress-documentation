import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CypressIcon from "@cypress-design/react-icon";

interface IconProps {
  useCypressIcon?: boolean;
  name: string;
  color?: string;
  inline?: boolean;
  url?: string;
  callout?: string;
  contentType?: string;
  title?: string;
}

export default function Icon({ useCypressIcon, name, color, inline, url, callout, contentType, title, ...customProps }: IconProps) {
  if (useCypressIcon) {
    return <CypressIcon name={name as any} {...customProps} />
  }

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
      <FontAwesomeIcon icon={iconName} color={color} title={title}/>
      { url ? <a href={url} style={{ marginLeft: space }}>{ content }</a> : null}
    </>
  )
}
