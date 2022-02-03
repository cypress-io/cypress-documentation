import React, { useState } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const navLinks = [
  {
    label: 'Guides',
    path: '/guides/overview/why-cypress',
  },
  {
    label: 'API',
    path: '/api/table-of-contents',
  },
  {
    label: 'Plugins',
    path: '/plugins',
  },
  {
    label: 'Examples',
    path: '/examples/examples/recipes',
  },
  {
    label: 'FAQ',
    path: '/faq/questions/using-cypress-faq',
  },
]

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <nav
        className={classNames(
          isMenuOpen ? 'h-full' : '',
          'w-full bg-gray-800 fixed top-0 left-0 overflow-y-auto z-20'
        )}
      ></nav>
    </>
  )
}
