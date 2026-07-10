import React from 'react'

/**
 * Markdown tables render as `<table>` elements that Infima styles with
 * `display: block; overflow: auto`, so a table wider than its container
 * becomes a horizontally scrollable region. Without a tab stop, keyboard
 * users cannot scroll it, which fails the axe-core
 * `scrollable-region-focusable` rule.
 *
 * Adding `tabIndex={0}` makes the scrollable table focusable and keyboard
 * scrollable, mirroring how Docusaurus already renders code blocks as
 * `<pre tabindex="0">`.
 */
export default function ScrollableTable(
  props: React.TableHTMLAttributes<HTMLTableElement>
): JSX.Element {
  return <table tabIndex={0} {...props} />
}
