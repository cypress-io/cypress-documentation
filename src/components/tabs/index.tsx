import React from 'react'
import OriginalTabs from '@theme/Tabs'

type TabsProps = React.ComponentProps<typeof OriginalTabs>
type TabAttributes = { [key: string]: unknown } | undefined

/**
 * Docusaurus's `<Tabs>`, with each tab's `groupId` and `value` written onto its
 * `role="tab"` element (through `TabItem`'s `attributes`), where the rendered
 * markup otherwise has neither. `src/clientModules/fullstoryEvents.ts` reads
 * them to send `Tab Selected` for the reader's own clicks only, so a tab set
 * that switches to match through `groupId` sends nothing.
 *
 * MDX resolves `<Tabs>` to this through `src/theme/MDXComponents.js`, and the
 * tab components in `src/components/*-tabs` import it in place of
 * `@theme/Tabs`.
 */
export default function Tabs(props: TabsProps) {
  const groupId = props.groupId ?? ''
  const withTabData = (value: string, attributes: TabAttributes) => ({
    ...attributes,
    'data-tab-group-id': groupId,
    'data-tab-value': value,
  })

  if (props.values) {
    return (
      <OriginalTabs
        {...props}
        values={props.values.map((tab) => ({
          ...tab,
          attributes: withTabData(tab.value, tab.attributes),
        }))}
      />
    )
  }

  const children = React.Children.map(props.children, (child) => {
    if (
      !React.isValidElement<{ value?: string; attributes?: TabAttributes }>(
        child
      )
    ) {
      return child
    }
    const { value, attributes } = child.props
    return value === undefined
      ? child
      : React.cloneElement(child, {
          attributes: withTabData(value, attributes),
        })
  })

  return <OriginalTabs {...props}>{children}</OriginalTabs>
}
