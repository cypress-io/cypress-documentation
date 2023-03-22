import React from 'react';
import TOCInline from '@theme-original/TOCInline';
import {useDoc} from '@docusaurus/theme-common/internal';

export default function TOCInlineWrapper(props) {
  const { frontMatter: {inlineErrorsTable} } = useDoc();
  const inlineTOCErrorStyle = inlineErrorsTable &&
    ["inlineTOC", "errorsInlineTOC"].join(' ');

  return (
    <>
      <div className={inlineTOCErrorStyle || "inlineTOC"}>
        <TOCInline {...props} />
      </div>
    </>
  );
}
