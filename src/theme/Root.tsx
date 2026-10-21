import React from 'react'
import { SupportAssistantProvider } from '@site/src/components/support-assistant'

// Wraps every page and survives client-side navigation, so the Support Assistant frame keeps its conversation.
export default function Root({ children }: { children: React.ReactNode }) {
  return <SupportAssistantProvider>{children}</SupportAssistantProvider>
}
