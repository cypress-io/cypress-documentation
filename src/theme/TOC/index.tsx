import React from 'react'
import clsx from 'clsx'
import TOC from '@theme-original/TOC'
import CopyPageButton from 'docusaurus-plugin-copy-page-button/react'
import styles from './styles.module.css'

export default function TOCWrapper(props) {
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <CopyPageButton
          enabledActions={['copy', 'view', 'claude', 'chatgpt']}
          markdownUrl={(pageUrl) => {
            const {origin, pathname} = new URL(pageUrl)
            const rel = pathname.replace(/^\/+/, '').replace(/\/+$/, '')
            return `${origin}/llm/markdown/${rel ? `${rel}.md` : 'index.md'}`
          }}
          customStyles={{
            button: {className: styles.copyPageButton},
          }}
        />
      </div>
      <h2 className="border-l border-gray-1000/[.07] dark:border-gray-900 my-0 pb-[12px] pl-[1.5rem] text-gray-700 dark:text-gray-400 font-medium uppercase text-[16px]">
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
