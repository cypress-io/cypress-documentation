import whatsNewData from './whats-new.json'

export interface WhatsNewItem {
  label: string
  href: string
  description?: string
  isNew?: boolean
  showAISparkle?: boolean
}

type DocsSection = keyof typeof whatsNewData

export function getWhatsNewItems(path: string): WhatsNewItem[] {
  const section = path.split('/').filter(Boolean)[0] as DocsSection
  return whatsNewData[section] ?? []
}
