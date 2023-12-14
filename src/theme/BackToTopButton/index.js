import React from 'react'
import DarkModeSwitch from './DarkModeSwitch'
export default function BackToTopButton() {
  return (
    <div className="fixed bottom-[1rem] right-[6rem] z-[100]">
      <DarkModeSwitch />
    </div>
  )
}
