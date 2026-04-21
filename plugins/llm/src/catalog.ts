import fs from 'fs'
import path from 'path'

/**
 * Writes a `/.well-known/api-catalog` file that supplies additional pointers to alternate formats of our docs
 * @param url 
 * @param distRoot 
 */
export function writeApiCatalog(url: string, distRoot: string) {
  const normalizedUrl = url.replace(/\/$/, '')
  const catalog = {
    linkset: [
      {
        anchor: `${normalizedUrl}`,
        'service-doc': [
          {
            href: `${normalizedUrl}`,
            type: 'text/html',
          },
          {
            href: `${normalizedUrl}/llm/markdown/index.md`,
            type: 'text/markdown',
          },
          {
            href: `${normalizedUrl}/llm/json/chunked/index.json`,
            type: 'application/json',
          },
          {
            href: `${normalizedUrl}/llm/json/full/index.json`,
            type: 'application/json',
          },
        ],
      },
    ],
  }

  fs.mkdirSync(path.join(distRoot, '.well-known'), { recursive: true })

  // Walk all files under /llm, write all to a `catalog.txt` file.
  fs.writeFileSync(
    path.join(distRoot, '.well-known', 'api-catalog'),
    JSON.stringify(catalog, null, 2),
    'utf8'
  )
}
