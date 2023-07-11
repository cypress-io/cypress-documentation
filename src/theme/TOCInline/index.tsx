import React from 'react';
import TOCInline from '@theme-original/TOCInline';

export default function TOCInlineWrapper(props) {

  return (
    <div className="inlineTOC">
      <TOCInline {...props} />
    </div>
  );
}
