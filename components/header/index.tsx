import React, { useState } from 'react'
import Link from 'next/link'
import Icon from '../icon'
import MobileMenu from '../mobile-menu'
import MobileMenuButton from '../mobile-menu-button'
import SearchAlgolia from '../search-algolia'

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

export default function AppHeader({ section, mobileMenuItems }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => {
    const [_empty, sectionInPath, ..._rest] = path.split('/')

    return sectionInPath === section
  }

  return (
    <>
      <nav
        className={classNames(
          isMenuOpen ? 'h-full' : '',
          'w-full bg-gray-800 fixed top-0 left-0 overflow-y-auto z-20'
        )}
      >
        <div className="mx-auto px-2 sm:px-4 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center px-2 lg:px-0">
              <div className="flex-shrink-0">
                <a href="/">
                  <img
                    className="block h-8 w-auto"
                    src="/cypress-logo.png"
                    alt="Cypress Docs Logo"
                  />
                </a>
              </div>

              <div className="hidden lg:block lg:ml-6">
                <div className="flex space-x-4">
                  {navLinks.map(({ label, path }) => (
                    <Link href={path} key={label}>
                      <a
                        className={classNames(
                          isActive(path)
                            ? 'bg-gray-700 text-white'
                            : 'hover:bg-gray-700 hover:text-white text-gray-300',
                          'px-3 py-2 rounded-md text-md font-bold'
                        )}
                      >
                        {label}
                      </a>
                    </Link>
                  ))}

                  <a
                    href="https://github.com/cypress-io/cypress"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-bold"
                  >
                    <span className="sr-only">GitHub</span>
                    <Icon name="github" />
                  </a>
                </div>
              </div>
            </div>

            <SearchAlgolia />

            <MobileMenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
        </div>

        <MobileMenu
          navLinks={navLinks}
          isMenuOpen={isMenuOpen}
          mobileMenuItems={mobileMenuItems}
          section={section}
        />
      </nav>
    </>
  )
}
