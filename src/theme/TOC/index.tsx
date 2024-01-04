import React from 'react'
import clsx from 'clsx'
import TOC from '@theme-original/TOC'

export default function TOCWrapper(props) {
  return (
    <>
      <h2 className="border-l border-gray-1000/[.07] dark:border-gray-900 my-0 pb-[12px] pl-[3rem] text-gray-500 font-medium uppercase text-[16px]">
        Contents
      </h2>
      <TOC
        {...props}
        className={clsx(
          props.className,
          'table-of-contents__left-border pt-[.1rem] table-of-contents'
        )}
      />
    </>
  )
}
