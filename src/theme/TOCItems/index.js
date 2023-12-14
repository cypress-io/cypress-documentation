import React from 'react'
import TOCItems from '@theme-original/TOCItems'

export default function TOCItemsWrapper(props) {
  return (
    <>
      <h2 className="border-l border-gray-100 dark:border-gray-900 my-0 pb-[12px] pl-[40px] text-gray-500 font-medium uppercase text-[16px]">
        Contents
      </h2>
      <TOCItems
        {...props}
        className="pt-[.1rem] table-of-contents table-of-contents__left-border"
      />
    </>
  )
}
