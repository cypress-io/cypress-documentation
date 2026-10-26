import React from 'react'

/**
 * Infima styles `<table>` as `display: block; overflow: auto`, which makes a
 * wide table scroll but also shrinks every table to fit its content, so a
 * short table (a two-row History table) stops short of the column. Instead,
 * the table fills the column (`display: table; width: 100%` in custom.scss)
 * and this wrapper scrolls it when it's wider than the column.
 *
 * Without a tab stop, keyboard users cannot scroll that region, which fails
 * the axe-core `scrollable-region-focusable` rule. `tabIndex={0}` on the
 * wrapper makes it focusable and keyboard scrollable, mirroring how Docusaurus
 * already renders code blocks as `<pre tabindex="0">`.
 */
export default function ScrollableTable(
  props: React.TableHTMLAttributes<HTMLTableElement>
): React.JSX.Element {
  return (
    <div className="table-scroll" tabIndex={0}>
      <table {...props} />
    </div>
  )
}
