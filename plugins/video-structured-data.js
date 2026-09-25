const fs = require('fs')
const path = require('path')
const { loadPartialMap, inlinePartials } = require('./faq-structured-data')

/**
 * Per-video metadata that can't be read from an embed, keyed by YouTube video
 * ID. Each entry may set `uploadDate` (ISO 8601, required by Google),
 * `description`, and `duration` (ISO 8601, e.g. PT4M13S). One file rather than
 * props on <DocsVideo>, because the same video is embedded on several pages.
 */
const VIDEO_DATA_FILE = 'src/data/youtube-videos.json'

const LOG_PREFIX = '[video-structured-data]'

/**
 * Pull the 11-character video ID out of a YouTube embed URL. Accepts both
 * `https://www.youtube.com/embed/<id>` and `https://youtube.com/embed/<id>`,
 * with or without a query string. Returns null for anything else.
 */
function extractYouTubeId(src) {
  if (typeof src !== 'string') return null
  const match = src.match(
    /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})(?:[?#&/]|$)/
  )
  return match ? match[1] : null
}

/** Blank out fenced code blocks so example markup in them isn't scanned. */
function stripFencedCode(content) {
  return content.replace(/^\s*```[\s\S]*?^\s*```/gm, '')
}

/** Read the string-valued attributes of a JSX tag's attribute source. */
function parseAttributes(source) {
  const attrs = {}
  const attrRe =
    /([A-Za-z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)\s*\})/g
  let match
  while ((match = attrRe.exec(source))) {
    attrs[match[1]] = match.slice(2).find((value) => value !== undefined)
  }
  return attrs
}

/**
 * Find every YouTube <DocsVideo> embed in MDX content, in page order.
 * Returns [{ src, title }]; Vimeo and local video embeds are ignored.
 */
function findYouTubeEmbeds(content) {
  const embeds = []
  const scannable = stripFencedCode(content)
  const tagRe = /<DocsVideo\b([^>]*?)\/?>/g
  let match
  while ((match = tagRe.exec(scannable))) {
    const { src, title } = parseAttributes(match[1])
    if (src && src.includes('youtube')) embeds.push({ src, title })
  }
  return embeds
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:Z|[+-]\d{2}:\d{2})?)?$/

/**
 * Build a schema.org VideoObject for one embed. Returns { videoObject } when
 * every field Google requires (name, thumbnailUrl, uploadDate) is present, or
 * { missing } listing what isn't, so the caller can skip it and warn.
 */
function buildVideoObject(embed, videoData = {}) {
  const id = extractYouTubeId(embed.src)
  if (!id) return { missing: ['a YouTube video ID in src'] }

  const data = videoData[id] || {}
  const missing = []
  const name = (embed.title || '').trim()
  if (!name) missing.push('name (the title prop)')
  const uploadDate = (data.uploadDate || '').trim()
  if (!ISO_DATE_RE.test(uploadDate)) {
    missing.push(`uploadDate (in ${VIDEO_DATA_FILE})`)
  }
  if (missing.length) return { id, missing }

  const videoObject = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    uploadDate,
    embedUrl: embed.src,
    contentUrl: `https://www.youtube.com/watch?v=${id}`,
  }
  const description = (data.description || '').trim()
  if (description) videoObject.description = description
  const duration = (data.duration || '').trim()
  if (duration) videoObject.duration = duration

  return { id, videoObject }
}

/**
 * Build the VideoObjects for one page. A video embedded twice on the same page
 * is emitted once. `warn` receives a message for every embed that is skipped.
 */
function buildPageVideoObjects(
  content,
  videoData,
  { file = 'page', warn = () => {} } = {}
) {
  const videoObjects = []
  const seen = new Set()
  for (const embed of findYouTubeEmbeds(content)) {
    const { id, videoObject, missing } = buildVideoObject(embed, videoData)
    if (!videoObject) {
      warn(
        `${LOG_PREFIX} Skipped ${embed.src} in ${file}: missing ${missing.join(', ')}.`
      )
      continue
    }
    if (seen.has(id)) continue
    seen.add(id)
    videoObjects.push(videoObject)
  }
  return videoObjects
}

/**
 * Serialize JSON-LD for a <script> tag. Escaping `<` keeps a value such as
 * `</script>` in a title or description from closing the tag early.
 */
function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Normalize a permalink the same way the DocItem layout normalizes pathname. */
function toRouteKey(permalink) {
  return permalink.replace(/\/$/, '') || '/'
}

/**
 * Docusaurus plugin that emits VideoObject JSON-LD for the YouTube videos
 * embedded with <DocsVideo>, making them eligible for Google video rich
 * results and giving answer engines machine-readable facts about each video.
 * It reads the loaded docs to map each source file to its route, and exposes
 * the result as global data keyed by route: an array of serialized, escaped
 * JSON-LD strings per page, so the escaping is unit tested here. The swizzled
 * DocItem/Layout injects one <script type="application/ld+json"> per video
 * into <head>.
 */
module.exports = async function videoStructuredDataPlugin(context) {
  return {
    name: 'docusaurus-video-structured-data',
    async allContentLoaded({ allContent, actions }) {
      const { siteDir } = context
      const dataPath = path.join(siteDir, VIDEO_DATA_FILE)
      const videoData = fs.existsSync(dataPath)
        ? JSON.parse(fs.readFileSync(dataPath, 'utf8'))
        : {}
      const partialMap = loadPartialMap(siteDir)
      const docsContent = allContent['docusaurus-plugin-content-docs'] || {}

      const byRoute = {}
      for (const pluginContent of Object.values(docsContent)) {
        for (const version of pluginContent.loadedVersions || []) {
          for (const doc of version.docs) {
            const file = doc.source.replace(/^@site\//, '')
            const raw = fs.readFileSync(path.join(siteDir, file), 'utf8')
            const content = inlinePartials(raw, partialMap)
            if (!content.includes('youtube')) continue
            const videoObjects = buildPageVideoObjects(content, videoData, {
              file,
              warn: console.warn,
            })
            if (videoObjects.length) {
              byRoute[toRouteKey(doc.permalink)] =
                videoObjects.map(serializeJsonLd)
            }
          }
        }
      }
      actions.setGlobalData({ byRoute })
    },
  }
}

// Exported for standalone testing.
module.exports.extractYouTubeId = extractYouTubeId
module.exports.findYouTubeEmbeds = findYouTubeEmbeds
module.exports.buildVideoObject = buildVideoObject
module.exports.buildPageVideoObjects = buildPageVideoObjects
module.exports.serializeJsonLd = serializeJsonLd
module.exports.toRouteKey = toRouteKey
