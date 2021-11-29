import s from './style.module.css'
import { TableOfContentsProps } from './types'
import Icon from '../icon'

export default function TableOfContents({ toc, hasBanner }: TableOfContentsProps) {
  return (
    <div className="hidden xl:block xl:col-span-2 mt-16">
      <nav>
        <h3 className="font-semibold mb-4">ON THIS PAGE</h3>
        {toc.map((item, index) => (
          <ul key={index}>
            {item.lvl < 4 && (
              <li
                className={`text-gray-500 dark:text-gray-300 ${
                  item.lvl === 2 && index !== 0 && toc[index - 1].lvl === 3 ? 'pt-4' : ''
                } ${item.lvl === 2 ? 'pb-1' : ''}`}
              >
                <a
                  href={`#${item.slug}`}
                  className={`block text-sm scrollactive-item pl-1 hover:text-green transition-colors ${
                    item.lvl === 2 ? 'py-1 pb-2 pl-2 font-bold' : ''
                  } ${item.lvl === 3 ? 'ml-4 py-1 pl-2 border-l-2 border-gray-200' : ''}`}
                >
                  {item.content}
                </a>
              </li>
            )}
          </ul>
        ))}
        <a href="#" className="text-blue text-sm back-to-top-arrow">
          <Icon name="long-arrow-alt-up" /> Back to Top
        </a>
      </nav>
    </div>
  )
}
