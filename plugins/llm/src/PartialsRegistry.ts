import fs from 'fs'
import path from 'path'
import { PARTIALS_SECTION } from './constants'
import { LlmExportConfig } from './types'
import matter from 'gray-matter'
import { normalizeContent } from './mdx-normalize'
import { loadPartialsFileToComponentName, walkDocs, stripMarkdownExtension } from './utils'

export class PartialsRegistry {
  private readonly partialsDir: string
  private readonly mdxComponentsPath: string
  private readonly partialsByComponentName: Record<string, string> = {}

  constructor(private readonly docsRoot: string, private readonly siteDir: string) {
    this.partialsDir = path.join(this.docsRoot, PARTIALS_SECTION)
    this.mdxComponentsPath = path.join(this.siteDir, 'src/theme/MDXComponents.js')
  }

  loadPartials(config: LlmExportConfig): void {
    if (config.partialsMode !== 'inline') {
        return
    }

    if (
      !Array.isArray(config.includeSections) ||
      (config.includeSections.length > 0 && !config.includeSections.includes(PARTIALS_SECTION))
    ) {
      return
    }
    if (!fs.existsSync(this.partialsDir)) {
      return
    }
  
    const fileToComponentName = loadPartialsFileToComponentName(this.mdxComponentsPath)
  
    for (const absPath of walkDocs(this.partialsDir)) {
      const parsed = matter(fs.readFileSync(absPath, 'utf8'))
      const normalized = normalizeContent(parsed.content, null)
      const fileName = path.basename(absPath)
      const baseName = stripMarkdownExtension(fileName)
      const stripped = baseName.replace(/^_+/, '')
      const fallbackName = stripped ? stripped.charAt(0).toUpperCase() + stripped.slice(1) : 'Partial'
      this.partialsByComponentName[fileToComponentName[fileName] ?? fallbackName] = normalized
    }
  }

  getPartials() {
    return this.partialsByComponentName
  }
}