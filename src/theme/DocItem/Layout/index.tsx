import React, {type ReactNode} from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';

type Props = WrapperProps<typeof LayoutType>;

type FaqStructuredData = {
  byRoute: Record<string, unknown>;
};

export default function LayoutWrapper(props: Props): ReactNode {
  const { pathname } = useLocation();
  // Add LLM alternate links to all pages - using this swizzled layout wrapper is a workaround
  // since Docusaurus don't support adding route-dynamic tags from inside a plugin
  const normalized = pathname.replace(/\/$/, '').replace(/^\//, '') || 'index'
  const fullJsonHref = `/llm/json/full/${normalized}.json`
  const markdownHref = `/llm/markdown/${normalized}.md`

  // FAQPage JSON-LD structured data generated at build time by the
  // docusaurus-faq-structured-data plugin, keyed by route. Injected into the
  // page <head> for the matching FAQ routes so the Q&As are eligible for rich
  // results and AI citations.
  const faqData = usePluginData('docusaurus-faq-structured-data') as
    | FaqStructuredData
    | undefined;
  const route = pathname.replace(/\/$/, '') || '/';
  const faqJsonLd = faqData?.byRoute?.[route];

  return (
    <>
      <Head>
        <link rel="alternate" type="application/json" href={fullJsonHref} />
        <link rel="alternate" type="text/markdown" href={markdownHref} />
        {faqJsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(faqJsonLd).replace(/</g, '\\u003c')}
          </script>
        )}
      </Head>
      <Layout {...props} />
    </>
  );
}
