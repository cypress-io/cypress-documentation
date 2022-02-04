import Link from 'next/link'

export default function MobileSection({ section, title, folder, parentSection, groupChildren }) {
  return (
    <>
      <h3 className="text-gray-300 block px-3 py-2 rounded-md text-base font-extrabold">{title}</h3>
      <ul>
        {groupChildren.map((child, childIndex) => (
          <li key={childIndex}>
            {child.children && (
              <MobileSection
                section={parentSection ? section.concat('/').concat(parentSection) : section}
                title={child.title}
                folder={child.slug}
                parentSection={child.slug}
                groupChildren={child.children}
              />
            )}

            {child.redirect && (
              <Link href={child.redirect}>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  {child.title}
                </a>
              </Link>
            )}

            {!child.children && !child.redirect && (
              <Link href={`/${section}/${folder}/${child.slug}`}>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  {child.title}
                </a>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
