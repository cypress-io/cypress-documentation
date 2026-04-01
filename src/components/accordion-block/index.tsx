import React from 'react'
import Accordion from '@cypress-design/react-accordion'

interface McpConfigBlockProps {
  title: string
  description?: string
  open?: boolean
  children: React.ReactNode
}

export default function AccordionBlock({
  title,
  description,
  open = false,
  children,
}: McpConfigBlockProps) {
  return (
    <Accordion
      title={title}
      description={description}
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
