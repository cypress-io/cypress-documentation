import Link from 'next/link'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function MobileMenu({ navLinks, isMenuOpen }) {
  return (
    <>
      <div className={classNames(isMenuOpen ? 'block' : 'hidden', 'lg:hidden overflow-y-auto')}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map(({ label, path }) => (
            <Link href={path} key={label}>
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                {label}
              </a>
            </Link>
          ))}

          <Link href="https://github.com/cypress-io/cypress">
            <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              GitHub
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}
