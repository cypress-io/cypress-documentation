import path from 'path'
import { runLlmExport } from './export-llm-docs'
import { Plugin } from '@docusaurus/types';

/**
 * Docusaurus plugin that runs the LLM export after a successful build.
 *
 * This keeps the exported corpus in sync whenever you run `docusaurus build`.
 */
function llmExportPlugin(context: any, _options: any) {
  return {
    name: 'llm-export',
    injectHtmlTags({ content }) {
      // add a `link` tag to the document head to indicate the llms.txt file is available
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'alternate',
              type: 'text/plain',
              href: '/llms.txt',
            },
          },
        ],
      }
    },
    async postBuild({ outDir, siteConfig: { url } }) {
      const siteDir = (context as { siteDir?: string }).siteDir ?? path.resolve(__dirname, '../../..')
      await runLlmExport({ url, siteDir, outDir })
    },
  } as Plugin<any>;
} 

// CommonJS export for Docusaurus
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(module as any).exports = llmExportPlugin
// Also re-export the runner for direct CLI usage if needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(module as any).exports.runLlmExport = runLlmExport

