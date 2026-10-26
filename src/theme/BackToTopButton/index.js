import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import DarkModeSwitch from './DarkModeSwitch'

// how long after the last scroll event the switch comes back
const SHOW_AFTER_SCROLL_MS = 600

export default function BackToTopButton() {
  const [scrolling, setScrolling] = useState(false)
  const containerRef = useRef(null)

  // the switch floats over the page, so on a phone it covers content; get it
  // out of the way while the reader scrolls
  useEffect(() => {
    let timeout
    const onScroll = () => {
      setScrolling(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setScrolling(false), SHOW_AFTER_SCROLL_MS)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timeout)
    }
  }, [])

  // never hide the switch out from under keyboard focus
  const hidden =
    scrolling && !containerRef.current?.contains(document.activeElement)

  return (
    <div
      ref={containerRef}
      className={clsx(
        'theme-back-to-top-button fixed bottom-[1rem] right-[1rem] z-[100]',
        hidden && 'theme-back-to-top-button--hidden'
      )}
    >
      <DarkModeSwitch />
    </div>
  )
}
