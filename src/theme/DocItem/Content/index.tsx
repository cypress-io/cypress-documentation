import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/theme-common/internal';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import E2EOnlyBadge from "@site/src/components/e2e-only-badge"
import ComponentOnlyBadge from "@site/src/components/component-only-badge"
import s from "./style.module.css";

/**
 Title can be declared inside md content or declared through
 front matter and added manually. To make both cases consistent,
 the added title is added under the same div.markdown block
 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120

 We render a "synthetic title" if:
 - user doesn't ask to hide it with front matter
 - the markdown content does not already contain a top-level h1 heading
*/

function useSyntheticTitle() {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}
export default function DocItemContent({children}) {

const { frontMatter: {e2eSpecific, componentSpecific} } = useDoc();
const testTypePill = e2eSpecific && <E2EOnlyBadge /> || componentSpecific && <ComponentOnlyBadge />

const syntheticTitle = useSyntheticTitle();
return (
  <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <div className={s.mainContentHeader}>
            <div className={s.headerWrapper}>
              <Heading as="h1">{syntheticTitle}</Heading>
              {testTypePill}
            </div>
          </div>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
