import fs from 'fs'
import path from 'path'
import { runLlmExport } from './export-llm-docs'

/**
 * Docusaurus plugin that runs the LLM export after a successful build.
 *
 * This keeps the exported corpus in sync whenever you run `docusaurus build`.
 */
function llmExportPlugin(context: any, _options: any) {
  return {
    name: 'llm-export',
    async postBuild({ outDir }: { outDir: string }) {
      const cwdBefore = process.cwd()
      try {
        // Ensure we run from the site directory so the exporter resolves paths correctly
        const siteDir = (context as any).siteDir || path.resolve(__dirname, '../../..')
        process.chdir(siteDir)
        await runLlmExport()
      } finally {
        process.chdir(cwdBefore)
      }
    },
  }
}

// CommonJS export for Docusaurus
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(module as any).exports = llmExportPlugin
// Also re-export the runner for direct CLI usage if needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(module as any).exports.runLlmExport = runLlmExport

