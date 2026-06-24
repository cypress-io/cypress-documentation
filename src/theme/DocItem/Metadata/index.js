import React from 'react'
import Metadata from '@theme-original/DocItem/Metadata'
import Head from '@docusaurus/Head'
import { useLocation } from '@docusaurus/router'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import sectionTitles from '@site/src/sectionTitles'

const { SECTION_TITLE_SUFFIX } = sectionTitles

/**
 * Wraps the default doc metadata. Docusaurus' <PageMetadata> appends the global
 * site title ("| Cypress Documentation"); for the sections in
 * SECTION_TITLE_SUFFIX we render a later <title> so the section-specific suffix
 * wins (react-helmet uses the last title). This keeps the SEO title correct in
 * both the server-rendered HTML and after hydration. The OG card is unaffected
 * — it always uses the bare page title.
 */
export default function MetadataWrapper(props) {
  const { metadata } = useDoc()
  const { pathname } = useLocation()
  const segment = pathname.replace(/^\//, '').split('/')[0]
  const suffix = SECTION_TITLE_SUFFIX[segment]
  const title = metadata.title

  return (
    <>
      <Metadata {...props} />
      {suffix && title ? (
        <Head>
          <title>{`${title} | ${suffix}`}</title>
        </Head>
      ) : null}
    </>
  )
}
