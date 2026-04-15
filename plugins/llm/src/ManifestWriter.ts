import path from 'path'
import { LlmExportConfig } from './types'
import { ensureDir, writeFile } from './utils'

export class ManifestWriter {
  constructor(private readonly distRoot: string) {}

  write(config: LlmExportConfig): void {
    const manifest = this.buildManifest(config)
    writeFile(path.join(this.distRoot, 'llms.txt'), manifest)
  }

  private buildManifest(config: LlmExportConfig) { 
const manifest = `---
name: Cypress
description: Cypress is a modern end-to-end testing framework for web applications, designed for developers to write, run, and debug tests easily.
category: developer-tools
repository: https://github.com/cypress-io/cypress
license: MIT
company: Cypress.io, Inc.

tags: [testing, e2e, automation, qa]

documentation:
  - type: primary
    format: html
    audience: human
    url: https://docs.cypress.io
    canonical: true

  - type: markdown
    format: markdown
    audience: [human, llm]
    url: ${config.url}/llm/markdown/index.md
${config.emit?.json ? `
  - type: json
    format: json
    audience: llm
    url: ${config.url}/llm/json/full/index.json

  - type: json_chunked
    format: json
    audience: llm
    url: ${config.url}/llm/json/chunked/index.json
` : ''}
llm_guidance:
  - use chunked JSON for retrieval and embeddings
  - use full JSON for complete context
  - use markdown for semantic understanding
  - use HTML only as a fallback
---

## Key Features
- End-to-end and component testing for web applications
- Time-travel debugging
- Automatic waiting
- Cross-browser testing
- Comprehensive test recording and analytics platform
- Accessibility and UI coverage testing
`

    return manifest
  }
}
