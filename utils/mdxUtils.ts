import fs from 'fs'
import path from 'path'
import glob from 'glob'
import toc from 'markdown-toc-unlazy'

export const GUIDES_PATH = path.join(process.cwd(), 'content/guides')

export const GET_PATH = (pathStr: string) => path.join(process.cwd(), pathStr)

export const allContentFilePaths = (pathStr: string) =>
  glob
    .sync(pathStr)
    .filter((path) => /\.md$/.test(path))
    .map((path) => path.replace(/^content/, ''))

export const getToCForMarkdown = (markdown) => {
  const tableOfContents = toc(markdown).json

  tableOfContents.forEach((item, index) => {
    const removeIconAndBackTicks = item.content.replace(/^<.*>/g, '').replace(/`/g, '')
    const removeStartingHyphen = item.slug.replace(/^-/, '')
    tableOfContents[index].content = removeIconAndBackTicks
    tableOfContents[index].slug = removeStartingHyphen
  })

  return tableOfContents
}
