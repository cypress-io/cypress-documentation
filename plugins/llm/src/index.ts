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
    injectHtmlTags({ content }) {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'alternate',
              type: 'application/json',
              href: '/llms.json',
            },
          },
        ],
      }
    },
    async postBuild({ outDir }: { outDir: string }) {
      const siteDir = (context as { siteDir?: string }).siteDir ?? path.resolve(__dirname, '../../..')
      await runLlmExport({ siteDir, outDir })
    },
  }
}

// CommonJS export for Docusaurus
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(module as any).exports = llmExportPlugin
// Also re-export the runner for direct CLI usage if needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(module as any).exports.runLlmExport = runLlmExport

