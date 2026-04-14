/* eslint-disable no-console */

/**
 * LLM-oriented export of the Docusaurus docs tree.
 *
 * Pipeline:
 * 1. Walk `docs/` for `.md`/`.mdx`, filter by configured sections.
 * 2. Normalize MDX (strip imports/exports, inline configured partials) and write flat markdown under `dist/llm/markdown/`.
 * 3. Optionally emit JSON under `dist/llm/json/`: chunked per-doc files + chunk index in `json/chunked/`, and full-document structured JSON in `json/full/`.
 * 4. Write `dist/llms.json` (site manifest) and per-directory `index.md` listings under the markdown export root.
 */

import path from 'path'
import {
  JsonExporter,
} from './JsonExporter'
import { ManifestWriter } from './ManifestWriter'
import { MarkdownExporter } from './MarkdownExporter'
import { LlmExportRunOptions } from './types'
import {
  DEFAULT_LLM_EXPORT_CONFIG,
  PARTIALS_SECTION,
  countMarkdownAndJsonFiles,
  getGitSha,
  toPosixPath,
  walkDocs,
} from './utils'
import { PartialsRegistry } from './PartialsRegistry'
import { writeSitemap } from './sitemap'

export async function runLlmExport(options?: LlmExportRunOptions): Promise<void> {
  console.log('Running LLM export...')
  const startedAt = performance.now()
  const config = { ...DEFAULT_LLM_EXPORT_CONFIG, ...(options ?? {}) }

  const siteDir = path.resolve(options?.siteDir ?? process.cwd())
  const distRoot = path.resolve(options?.outDir ?? path.join(siteDir, 'dist'))
  const docsRoot = path.join(siteDir, 'docs')
  const exportRoot = path.join(distRoot, 'llm')
  
  const partialsRegistry = new PartialsRegistry(docsRoot, siteDir)
  partialsRegistry.loadPartials(config)
  
  const generatedAt = new Date().toISOString()
  const gitSha = getGitSha(siteDir)
  
  const mdExporter = new MarkdownExporter(distRoot, exportRoot, partialsRegistry.getPartials())
  const jsonExporter = new JsonExporter(distRoot, exportRoot)

  const emitJson = Boolean(config.emit?.json)
  if (emitJson) {
    jsonExporter.prepareJsonOutputDirs()
  }
  
  const files = walkDocs(docsRoot)
  for (const absPath of files) {
    const relFromDocs = toPosixPath(path.relative(docsRoot, absPath))
    const section = relFromDocs.split('/')[0] || ''

    if (Array.isArray(config.includeSections) && config.includeSections.length > 0) {
      if (!config.includeSections.includes(section)) {
        continue
      }
    }
    if (config.partialsMode === 'inline' && section === PARTIALS_SECTION) {
      continue
    }

    const { bodyWithHeading, mdOutPath, metadata } = mdExporter.exportFile({
      section,
      siteDir,
      absPath,
      relFromDocs,
      generatedAt,
      gitSha,
    })

    if (emitJson) {
      jsonExporter.exportFile({ relFromDocs, metadata, mdOutPath, bodyWithHeading, config })
    }
  }

  mdExporter.buildMarkdownDirectoryIndexes()
  if (config.emit?.json) {
    jsonExporter.exportIndex({ gitSha, generatedAt })
  }

  const manifestWriter = new ManifestWriter(distRoot)
  manifestWriter.write(config, generatedAt)

  writeSitemap(config.url, distRoot)

  const elapsedMs = Math.round(performance.now() - startedAt)
  const { markdown: outMarkdown, json: outJson } = countMarkdownAndJsonFiles(exportRoot)
  const outTotal = outMarkdown + outJson
  const { chunkCount } = jsonExporter.getMetrics()
  console.log(
    [
      'LLM Export complete.',
      `Time: ${elapsedMs}ms`,
      `Source docs scanned: ${files.length}`,
      `Chunks indexed: ${chunkCount}`,
      `Output files under ${toPosixPath(path.relative(siteDir, exportRoot))}/: ${outTotal} total`,
      `  — ${outMarkdown} markdown (.md)`,
      `  — ${outJson} json (.json)`,
    ].join('\n'),
  )
}
