import React, {type ReactNode} from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import {markdownPathFor} from '@site/src/utils/markdown-url';

type Props = WrapperProps<typeof LayoutType>;

type FaqStructuredData = {
  byRoute: Record<string, unknown>;
};

type VideoStructuredData = {
  byRoute: Record<string, string[]>;
};

export default function LayoutWrapper(props: Props): ReactNode {
  const { pathname } = useLocation();
  // Add LLM alternate links to all pages - using this swizzled layout wrapper is a workaround
  // since Docusaurus don't support adding route-dynamic tags from inside a plugin
  const normalized = pathname.replace(/\/$/, '').replace(/^\//, '') || 'index'
  const fullJsonHref = `/llm/json/full/${normalized}.json`
  // Every doc page's markdown is also published at its own route plus `.md`,
  // so point the alternate at that rather than at the `/llm/markdown/` copy.
  // Shared with the reader-facing <MarkdownActions> control on the page.
  const markdownHref = markdownPathFor(pathname)

  // FAQPage JSON-LD structured data generated at build time by the
  // docusaurus-faq-structured-data plugin, keyed by route. Injected into the
  // page <head> for the matching FAQ routes so the Q&As are eligible for rich
  // results and AI citations.
  const faqData = usePluginData('docusaurus-faq-structured-data') as
    | FaqStructuredData
    | undefined;
  const route = pathname.replace(/\/$/, '') || '/';
  const faqJsonLd = faqData?.byRoute?.[route];

  // VideoObject JSON-LD for each YouTube <DocsVideo> on the page, generated at
  // build time by the docusaurus-video-structured-data plugin. Each entry is
  // already serialized and escaped.
  const videoData = usePluginData('docusaurus-video-structured-data') as
    | VideoStructuredData
    | undefined;
  const videoJsonLd = videoData?.byRoute?.[route] ?? [];

  return (
    <>
      <Head>
        <link rel="alternate" type="application/json" href={fullJsonHref} />
        <link rel="alternate" type="text/markdown" href={markdownHref} />
        {faqJsonLd ? (
          <script type="application/ld+json">
            {JSON.stringify(faqJsonLd).replace(/</g, '\\u003c')}
          </script>
        ) : null}
        {videoJsonLd.map((json, index) => (
          <script key={index} type="application/ld+json">
            {json}
          </script>
        ))}
      </Head>
      <Layout {...props} />
    </>
  );
}
