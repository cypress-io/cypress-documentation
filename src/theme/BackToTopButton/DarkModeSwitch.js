import React from 'react'
import clsx from 'clsx'
import {
  IconShapeSunLong,
  IconShapeMoonCrescent,
} from '@cypress-design/react-icon'
import { useColorMode } from '@docusaurus/theme-common'

export default function DarkModeSwitch() {
  const { colorMode, setColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <button
      className={clsx(
        'border border-solid rounded-full p-[3px] pl-[30px] transition duration-500 group',
        {
          'border-gray-100 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-100 hover:ring-indigo-100 hover:ring-2':
            !isDark,
          'border-gray-800 bg-gray-900 hover:border-indigo-400 hover:bg-indigo-800 hover:ring-indigo-800 hover:ring-2':
            isDark,
        }
      )}
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
    >
      <span
        className={clsx(
          'block rounded-full h-[32px] w-[32px] transition duration-500 p-[8px]',
          {
            'transform translate-x-[-27px] bg-gray-800': isDark,
            'bg-white': !isDark,
          }
        )}
      >
        <IconShapeSunLong
          interactiveColorsOnGroup
          stroke-color="gray-600"
          fill-color="gray-500"
          hover-stroke-color="indigo-500"
          hover-fill-color="indigo-400"
          className={clsx('absolute transition duration-500', {
            'opacity-0': isDark,
            'opacity-100': !isDark,
          })}
        />
        <IconShapeMoonCrescent
          interactiveColorsOnGroup
          stroke-color="gray-200"
          fill-color="gray-1000"
          hover-stroke-color="indigo-200"
          hover-fill-color="indigo-400"
          className={clsx('absolute transition duration-500', {
            'opacity-0': !isDark,
            'opacity-100': isDark,
          })}
        />
      </span>
    </button>
  )
}
