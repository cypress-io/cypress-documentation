import * as React from 'react'
import Tag from '@cypress-design/react-tag'
import { IconGeneralSparkleDoubleSmall } from '@cypress-design/react-icon'
import Link from '@docusaurus/Link'

interface SidebarLinkProps {
  children: React.ReactNode
  customProps?: any
  className?: string
  href?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

/**
 * The AI icon and New/Deprecated tags that trail a sidebar entry's text.
 *
 * Shared by doc links and by category headings. The doc menu only routes doc
 * links through `LinkComponent`; it renders a category from its `label` alone,
 * so `utils.tsx` folds this into the label for those.
 */
export const SidebarAdornments: React.FC<{ customProps?: any }> = ({
  customProps,
}) => (
  <>
    {customProps?.ai_icon && (
      <IconGeneralSparkleDoubleSmall
        fillColor="transparent"
        className="inline mr-[4px] mt-[-2px]"
      />
    )}
    {customProps?.new_label ? (
      <Tag color="indigo" size="16" dark style={{ marginTop: '-2px' }}>
        New
      </Tag>
    ) : null}
    {customProps?.deprecated_label ? (
      <Tag color="red" size="16" dark style={{ marginTop: '-2px' }}>
        Deprecated
      </Tag>
    ) : null}
  </>
)

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  children,
  customProps,
  className,
  href,
  style,
  onClick,
}) => {
  return (
    <Link {...{ className, href, style, onClick }}>
      {children} <SidebarAdornments customProps={customProps} />
    </Link>
  )
}
