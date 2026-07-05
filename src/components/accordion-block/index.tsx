import React from 'react'
import Accordion from '@cypress-design/react-accordion'

interface McpConfigBlockProps {
  title: string
  description?: string
  icon?: React.ReactNode
  open?: boolean
  children: React.ReactNode
}

export default function AccordionBlock({
  title,
  description,
  icon,
  open = false,
  children,
}: McpConfigBlockProps) {
  return (
    <Accordion
      title={title}
      description={description}
      iconEl={icon}
      separator
      fullWidthContent
      open={open}
      titleClassName='c-black'
      className="mt-[8px] mb-[8px]"
    >
      <div style={{ padding: '0.75rem 1rem 1rem' }}>{children}</div>
    </Accordion>
  )
}
