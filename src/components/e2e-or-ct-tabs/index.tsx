import React from 'react'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

interface E2eOrCtTabsProps {
  children: React.ReactNode;
}

const E2EOrCtTabs: React.FC<E2eOrCtTabsProps> = ({children}) => {
  // The remark directive always emits the end-to-end block first.
  const blocks = children as React.ReactNode[]
  return (
    <Tabs groupId="e2e-or-ct-tabs">
      <TabItem value="e2e" label="End-to-End Test">
        {blocks[0]}
      </TabItem>
      <TabItem value="ct" label="Component Test">
        {blocks[1]}
      </TabItem>
    </Tabs>
  )
}

export default E2EOrCtTabs
