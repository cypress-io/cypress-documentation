import fs from "fs"
import path from "path"
import glob from "glob"
import toc from "markdown-toc-unlazy"

export const GUIDES_PATH = path.join(process.cwd(), "content/guides")

export const contentFilePaths = fs
  .readdirSync(GUIDES_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path))

export const allContentFilePaths = glob
  .sync("content/guides/**/*")
  .filter((path) => /\.mdx?$/.test(path))
  .map((path) => path.replace(/^content/, ""))

export const getToCForMarkdown = (markdown) => {
  const tableOfContents = toc(markdown).json

  tableOfContents.forEach((item, index) => {
    const removeIconAndBackTicks = item.content
      .replace(/^<.*>/g, "")
      .replace(/`/g, "")
    const removeStartingHyphen = item.slug.replace(/^-/, "")
    tableOfContents[index].content = removeIconAndBackTicks
    tableOfContents[index].slug = removeStartingHyphen
  })

  return tableOfContents
}
