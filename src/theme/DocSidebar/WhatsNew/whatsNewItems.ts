import whatsNewData from './whats-new.json'
import {
  SURFACES,
  conversionLinkAttributes,
} from '@site/plugins/fullstory-conversion-links'

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

/**
 * The Fullstory attributes for a What's New link: its label, and its promo's
 * utm_campaign when the href has one. Every link gets this label, so its
 * clicks stay together in Fullstory, and a conversion link keeps its
 * placement property alongside the campaign.
 */
export function whatsNewLinkAttributes(href: string): Record<string, string> {
  const conversion = conversionLinkAttributes(href, SURFACES.sidebar)
  const campaign = new URL(href, 'https://docs.cypress.io').searchParams.get(
    'utm_campaign'
  )
  const schema = {
    ...JSON.parse(conversion['data-fs-properties-schema'] ?? '{}'),
    'data-promo-campaign': 'str',
  }
  return {
    ...conversion,
    'data-fs-element': 'Docs Sidebar - Whats New - Link',
    ...(campaign && { 'data-promo-campaign': campaign }),
    'data-fs-properties-schema': JSON.stringify(schema),
  }
}
