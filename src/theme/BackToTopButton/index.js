import React from 'react'
import DarkModeSwitch from './DarkModeSwitch'
export default function BackToTopButton() {
  return (
    <div className="theme-back-to-top-button fixed bottom-[1rem] right-[1rem] z-[100]">
      <DarkModeSwitch />
    </div>
  )
}
