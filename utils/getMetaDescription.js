import remark from 'remark'
import strip from 'strip-markdown'


/**
 * For markdown files that do not have a `description` field in their
 * front matter, we need to generate a `description` for the page's meta
 * tag. This function parses markdown and removes all of its markdown-y
 * parts so we can use the raw text as the `description`.
 * 
 * @param {string} markdown 
 * @returns Promise<string>
 * 
 * @example
 * 
 * const [rawContent] = await $content({ text: true }).where({ path }).fetch()
 * const metaDesc = await getMetaDescription(rawContent.text)
 */
export const getMetaDescription = async (markdown) => {
  if (!markdown) {
    return ''
  }

  const sanitizedText = await remark().use(strip).process(markdown)
  const description = trimMetaDescription(sanitizedText.contents)

  return description
}

const RECOMMENDED_MAX_META_DESCRIPTION_LENGTH = 155

function trimMetaDescription(desc) {
  const trimmedDesc = desc.replace(/\n/g, ' ').replace(/[\ ]{2,}/g, ' ').trim().slice(0, RECOMMENDED_MAX_META_DESCRIPTION_LENGTH).trim()
  // The last word could've been cut in half, so we remove the last word
  const indexOfLastSpace = trimmedDesc.lastIndexOf(' ')

  return trimmedDesc.slice(0, indexOfLastSpace)
}