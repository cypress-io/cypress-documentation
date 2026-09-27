import React from 'react';
import TOCInline from '@theme-original/TOCInline';
import type TOCInlineType from '@theme/TOCInline';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof TOCInlineType>;

export default function TOCInlineWrapper(props: Props) {

  return (
    <div className="inlineTOC">
      <TOCInline {...props} />
    </div>
  );
}
