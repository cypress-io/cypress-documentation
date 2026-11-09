import React from 'react'
import Tabs from '@site/src/components/tabs'
import TabItem from '@theme/TabItem'

interface CypressLangTabsProps {
  children: React.ReactNode
}

// The copyTsToJs remark plugin emits the JS block first, then the TS block.
const CypressLangTabs: React.FC<CypressLangTabsProps> = ({ children }) => {
  const blocks = React.Children.toArray(children)
  return (
    <Tabs groupId="cypress-lang">
      <TabItem value="js" label="JavaScript">
        {blocks[0]}
      </TabItem>
      <TabItem value="ts" label="TypeScript">
        {blocks[1]}
      </TabItem>
    </Tabs>
  )
}

export default CypressLangTabs
