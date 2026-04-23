import sanitizeHtml, { IOptions } from 'sanitize-html'

// sanitize-html options: keep basic structural tags and safe attributes
const sanitizeOptions: IOptions = {
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowVulnerableTags: false,
  disallowedTagsMode: 'discard',
  exclusiveFilter: (element) => {
    // drop elements that have the data-sanitize attribute
    if (Boolean(element.attribs && 'data-sanitize' in element.attribs)) {
      return true
    }
    // drop product heading elements
    if (Boolean(element.attribs?.class?.includes('productHeading_'))) {
      return true
    }
    // drop mobile table of contents
    if (Boolean(element.attribs?.class?.includes('tocMobile_'))) {
      return true
    }
    // drop noPrint elements (namely the "Edit the page" link)
    if (Boolean(element.attribs?.class?.includes('noPrint_'))) {
      return true
    }
    // Drop "info", "success", etc invisible text
    if (Boolean(element.attribs?.class?.includes('admonitionHeading_'))) {
      return true
    }
    // Drop "last updated" text from footer, already available in frontmatter
    if (Boolean(element.attribs?.class?.includes('lastUpdated_'))) {
      return true
    }
    // drop empty anchor tags
    if (element.tag?.toLowerCase() === 'a') {
      const linkText = element.text
        // drop zero-width characters
        ?.replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
        // drop standard whitespace
        ?.trim()
      return !linkText
    }

    return false
  },
  transformTags: {
    a: (tagName, attribs) => {
      let href = attribs.href
      if (
        href &&
        (href.startsWith('/') ||
          href.startsWith('./'))
      ) {
        // rewrite root-relative and relative hrefs to be relative to the `llm/markdown` directory
        // ignoring any backtracking "../" as we shouldn't have any of these
        href = href
          .replace(/^\//, '')
          .replace(/^\.\//, '')

        // ensure the href points to the `.md` file - note that the href may:
        // - already point to an `.html` file
        // - already point to a `.md` file
        // - have query or hash components; these must be preserved
        try {
          const url = new URL(
            `/llm/markdown/${href}`,
            'https://dummy.cypress.io'
          )
          url.pathname = url.pathname.replace(/\.html$/, '.md')
          if (!url.pathname.endsWith('.md')) {
            url.pathname = `${url.pathname}.md`
          }
          href = url.toString().replace('https://dummy.cypress.io', '')
        } catch {}

        attribs.href = href
      }

      return {
        tagName,
        attribs,
      }
    },
  },
}

// Extract the content from the DOM:
// 1. <main data-cy="content"...>
// 2. <article...>
// 3. <main ...>
// 4. <body ...>
const extractContent = (h: string) =>
  h.match(/<main[^>]*data-cy=(["'])content\1[^>]*>([\s\S]*?)<\/main>/i)?.[2] ??
  h.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] ??
  h.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ??
  h.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ??
  h

// Remove any element that has the data-sanitize attribute, including its contents

export const normalizeHtml = (rawHtml: string) => {
  const content = extractContent(rawHtml)
  const sanitizedContent = sanitizeHtml(content, sanitizeOptions)
  return sanitizedContent
}
