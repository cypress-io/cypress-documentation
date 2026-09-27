import React from 'react';
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

interface CypressConfigFileTabsProps {
  children: React.ReactNode;
}

const CypressConfigFileTabs: React.FC<CypressConfigFileTabsProps> = ({ children }) => {
  // The remark directive always emits the JS block first, then the TS block.
  const blocks = children as React.ReactNode[]
  return (
    <Tabs groupId="config-file-tabs">
      <TabItem value="js" label="cypress.config.js">
        {blocks && blocks[0]}
      </TabItem>
      <TabItem value="ts" label="cypress.config.ts">
        {blocks && blocks[1]}
      </TabItem>
    </Tabs>
  )
};

export default CypressConfigFileTabs;