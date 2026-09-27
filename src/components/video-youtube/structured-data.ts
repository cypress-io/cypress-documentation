/**
 * schema.org VideoObject JSON-LD for a YouTube embed, making it eligible for
 * Google video rich results and giving answer engines machine-readable facts
 * about the video. `name` and `embedUrl` come from the embed; `uploadDate`,
 * `description`, and `duration` come from `src/data/youtube-videos.json`,
 * keyed by video ID, because the same video is embedded on several pages.
 */

export interface VideoData {
  /** ISO 8601 date, required by Google. */
  uploadDate?: string
  description?: string
  /** ISO 8601 duration, e.g. PT4M13S. */
  duration?: string
}

export type VideoObjectResult =
  | { videoObject: Record<string, string>; missing?: never }
  | { videoObject?: never; missing: string[] }

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:Z|[+-]\d{2}:\d{2})?)?$/

/**
 * Pull the 11-character video ID out of a YouTube embed URL. Accepts both
 * `https://www.youtube.com/embed/<id>` and `https://youtube.com/embed/<id>`,
 * with or without a query string. Returns null for anything else.
 */
export function extractYouTubeId(src: string): string | null {
  const match = src.match(
    /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})(?:[?#&/]|$)/
  )
  return match ? match[1] : null
}

/**
 * Build the VideoObject for an embed with a valid video ID. Returns
 * { videoObject } when every field Google requires (name, thumbnailUrl,
 * uploadDate) is present, or { missing } listing what isn't, so the caller
 * can skip it and warn.
 */
export function buildVideoObject(
  id: string,
  src: string,
  title: string | undefined,
  data: VideoData = {}
): VideoObjectResult {
  const name = (title ?? '').trim()
  const uploadDate = (data.uploadDate ?? '').trim()
  const missing = []
  if (!name) missing.push('name (the title prop)')
  if (!ISO_DATE_RE.test(uploadDate)) {
    missing.push('uploadDate (in src/data/youtube-videos.json)')
  }
  if (missing.length) return { missing }

  const description = (data.description ?? '').trim()
  const duration = (data.duration ?? '').trim()
  return {
    videoObject: {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      uploadDate,
      embedUrl: src,
      contentUrl: `https://www.youtube.com/watch?v=${id}`,
      ...(description && { description }),
      ...(duration && { duration }),
    },
  }
}

/**
 * Serialize JSON-LD for a <script> tag. Escaping `<` keeps a value such as
 * `</script>` in a title or description from closing the tag early.
 */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
