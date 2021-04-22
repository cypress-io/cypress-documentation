import { getClient } from '../../plugins/sanity-client'

const bannerFields = [
  'message',
  'publishedAt',
  'callToActionText',
  'callToActionUrl',
  'icon',
]

const NOW = new Date()
const query = `*[_type == "banner" && publishedAt <= "${NOW.toISOString()}"] {${bannerFields.join(
  ', '
)}}`

// Limit the amount of API requests made to Sanity.io
// during build time across the various pages
const once = (fn) => {
  let result

  return async () => {
    if (result) {
      return result
    }

    result = await fn()

    return result
  }
}

export const fetchBanner = once(async () => {
  const client = getClient()
  const results = await client.fetch(query)

  if (!results.length) {
    return undefined
  }

  const mostRecentBanner = findMostRecentlyPublished(results)

  return mostRecentBanner
})

const findMostRecentlyPublished = (banners) => {
  let mostRecentBanner

  for (let i = 0; i < banners.length; i++) {
    const current = banners[i]

    if (!mostRecentBanner) {
      mostRecentBanner = current
      continue
    }

    const currentPublishedAt = new Date(current.publishedAt)
    const mostRecentPublishedAt = new Date(mostRecentBanner.publishedAt)

    if (currentPublishedAt > mostRecentPublishedAt) {
      mostRecentBanner = current
    }
  }

  return mostRecentBanner
}
