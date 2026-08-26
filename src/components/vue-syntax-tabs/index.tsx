import React from 'react'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

interface VueSyntaxTabsProps {
  children: React.ReactNode;
}

const VueSyntaxTabs: React.FC<VueSyntaxTabsProps> = ({children}) => {
  // JSX syntax is authored first, VTU syntax second.
  const blocks = children as React.ReactNode[]
  return (
    <Tabs groupId="vue-syntax-tabs">
      <TabItem value="vuejsx" label="JSX Syntax">
        {blocks[0]}
      </TabItem>
      <TabItem value="vuevtu" label="VTU Syntax">
        {blocks[1]}
      </TabItem>
    </Tabs>
  )
}

export default VueSyntaxTabs
