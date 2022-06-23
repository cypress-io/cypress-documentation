import React from 'react'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

interface E2eOrCtTabsProps {
  children: React.ReactNode;
}

const E2EOrCtTabs: React.FC<E2eOrCtTabsProps> = ({children}) => {
  return (
    <Tabs groupId="e2e-or-ct-tabs">
      <TabItem value="e2e" label="End-to-End Test">
        {children[0]}
      </TabItem>
      <TabItem value="ct" label="Component Test">
        {children[1]}
      </TabItem>
    </Tabs>
  )
}

export default E2EOrCtTabs
