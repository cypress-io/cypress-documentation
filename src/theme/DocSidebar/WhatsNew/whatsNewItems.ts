import whatsNewData from './whats-new.json'

export interface WhatsNewItem {
  label: string
  href: string
  description?: string
  isNew?: boolean
  showAISparkle?: boolean
}

type DocsSection = keyof typeof whatsNewData

export function getSection(path: string): string {
  return path.split('/').filter(Boolean)[0] || 'global'
}

export function getWhatsNewItems(path: string): WhatsNewItem[] {
  const section = getSection(path) as DocsSection
  return whatsNewData[section] ?? []
}
