import whatsNewData from './whats-new.json'
import {
  SURFACES,
  conversionLinkAttributes,
} from '../../../../plugins/fullstory-conversion-links'

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
 * utm_campaign when the href has one. A conversion link keeps its conversion
 * label, so it stays in the funnels built on that name, and carries the
 * campaign alongside its placement.
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
    'data-fs-element': 'Docs Sidebar - Whats New - Link',
    ...conversion,
    ...(campaign && { 'data-promo-campaign': campaign }),
    'data-fs-properties-schema': JSON.stringify(schema),
  }
}
