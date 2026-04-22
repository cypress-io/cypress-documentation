import React, {type ReactNode} from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  const { pathname } = useLocation();
  // Add LLM alternate links to all pages - using this swizzled layout wrapper is a workaround
  // since Docusaurus don't support adding route-dynamic tags from inside a plugin
  const normalized = pathname.replace(/\/$/, '').replace(/^\//, '') || 'index'
  const fullJsonHref = `/llm/json/full/${normalized}.json`
  const markdownHref = `/llm/markdown/${normalized}.md`
  return (
    <>
      <Head>
        <link rel="alternate" type="application/json" href={fullJsonHref} />
        <link rel="alternate" type="text/markdown" href={markdownHref} />
      </Head>
      <Layout {...props} />
    </>
  );
}
