import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import DarkModeSwitch from './DarkModeSwitch'

// how long after the last scroll event the switch comes back
const SHOW_AFTER_SCROLL_MS = 600

// a scroll counts as the reader's own when it follows their input within this
// window, which also covers a key press's smooth scroll and a flick's momentum
const USER_SCROLL_WINDOW_MS = 1000

const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
])

export default function BackToTopButton() {
  const [scrolling, setScrolling] = useState(false)
  const containerRef = useRef(null)

  // the switch floats over the page, so on a phone it covers content; get it
  // out of the way while the reader scrolls. Scrolls the page makes on its own
  // (to the top on navigation, to a heading from the table of contents) don't
  // count, so the switch doesn't blink on every link click.
  useEffect(() => {
    let lastUserInput = -Infinity
    let timeout
    const markUserInput = () => {
      lastUserInput = Date.now()
    }
    const onKeyDown = (event) => {
      if (SCROLL_KEYS.has(event.key)) markUserInput()
    }
    // a press on the page's own scrollbar lands on the root element
    const onPointerDown = (event) => {
      if (event.target === document.documentElement) markUserInput()
    }
    const onScroll = () => {
      if (Date.now() - lastUserInput > USER_SCROLL_WINDOW_MS) return
      setScrolling(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setScrolling(false), SHOW_AFTER_SCROLL_MS)
    }

    const passive = { passive: true }
    window.addEventListener('wheel', markUserInput, passive)
    window.addEventListener('touchmove', markUserInput, passive)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('scroll', onScroll, passive)
    return () => {
      window.removeEventListener('wheel', markUserInput)
      window.removeEventListener('touchmove', markUserInput)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
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
