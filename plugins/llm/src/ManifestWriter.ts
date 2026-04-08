import path from 'path'
import { LlmExportConfig } from './types'
import { ensureDir, writeJsonFile } from './utils'

export class ManifestWriter {
  constructor(private readonly distRoot: string) {}

  write(config: LlmExportConfig, generatedAt: string): void {
    const manifest = this.buildManifest(config, generatedAt)
    writeJsonFile(path.join(this.distRoot, 'llms.json'), manifest)
    ensureDir(path.join(this.distRoot, '.well-known'))
    writeJsonFile(path.join(this.distRoot, '.well-known', 'llms.json'), manifest)
  }

  private buildManifest(config: LlmExportConfig, generatedAt: string) { 
    const manifest = {
      site_name: 'Cypress Documentation',
      description:
        'Cypress is an open-source, JavaScript-based testing framework for anything that runs in a browser. It targets front-end developers and QA engineers building modern web applications. Unlike WebDriver-based tools, Cypress runs directly inside the browser alongside your application, giving it native access to the DOM, network layer, and application state.',
      last_updated: generatedAt,
      root_url: 'https://docs.cypress.io',
      files: [
        {
          url: '/',
          format: 'html',
          intended_for: ['human'],
          description: 'The index page of the Cypress Documentation.',
        },
        {
          url: '/llm/markdown/index.md',
          format: 'markdown',
          intended_for: ['human', 'llm'],
          description: 'The index page of the Cypress Documentation in markdown format.',
        },
      ],
    }
  
    if (config.emit?.json) {
      manifest.files.push(
        {
          url: '/llm/json/chunked/index.json',
          format: 'json',
          intended_for: ['llm'],
          description: 'Chunk-level index of the Cypress Documentation for retrieval / RAG-style use.',
        },
        {
          url: '/llm/json/full/index.json',
          format: 'json',
          intended_for: ['llm'],
          description: 'Per-document structured JSON index for the Cypress Documentation.',
        },
      )
    }

    return manifest
  }
}
