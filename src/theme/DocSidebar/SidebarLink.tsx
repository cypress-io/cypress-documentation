import * as React from 'react'
import Tag from '@cypress-design/react-tag'
import Link from '@docusaurus/Link'

interface SidebarLinkProps {
  children: React.ReactNode
  customProps?: any
  className?: string
  href?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

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
      {children}{' '}
      {customProps?.new_label ? (
        <Tag color="indigo" size="16" dark style={{ marginTop: '-2px' }}>
          New
        </Tag>
      ) : null}
    </Link>
  )
}
