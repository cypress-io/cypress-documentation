import path from 'path'
import { LlmExportConfig } from './types'
import { writeJsonFile } from './utils'

/**
 * Writes `/docs-manifest.json`: the project metadata and the machine-readable
 * list of the formats this site publishes its documentation in.
 *
 * This used to be a YAML block at the top of `/llms.txt`, which meant `/llms.txt`
 * was not in the [llmstxt.org](https://llmstxt.org) format that its consumers
 * parse. `/llms.txt` is now that format (see `LlmsTxtWriter`) and links here, so
 * nothing that read the metadata loses it — it moved from YAML to JSON at a
 * stable URL, and every `documentation` entry is also linked from `/llms.txt`
 * itself for agents that only read the index.
 */
export class ManifestWriter {
  constructor(private readonly distRoot: string) {}

  write(config: LlmExportConfig, generatedAt?: string): void {
    writeJsonFile(
      path.join(this.distRoot, 'docs-manifest.json'),
      this.buildManifest(config, generatedAt),
    )
  }

  private buildManifest(config: LlmExportConfig, generatedAt?: string) {
    const url = (config.url || '').replace(/\/+$/, '')

    return {
      name: 'Cypress',
      description:
        'Cypress is a modern end-to-end testing framework for web applications, designed for developers to write, run, and debug tests easily.',
      category: 'developer-tools',
      repository: 'https://github.com/cypress-io/cypress',
      license: 'MIT',
      company: 'Cypress.io, Inc.',
      tags: ['testing', 'e2e', 'automation', 'qa'],
      generated_at: generatedAt ?? null,
      key_features: [
        'End-to-end and component testing for web applications',
        'Time-travel debugging',
        'Automatic waiting',
        'Cross-browser testing',
        'Comprehensive test recording and analytics platform',
        'Accessibility and UI coverage testing',
      ],
      documentation: [
        {
          type: 'primary',
          format: 'html',
          audience: 'human',
          url: `${url}`,
          canonical: true,
        },
        {
          type: 'llms_txt',
          format: 'markdown',
          audience: ['human', 'llm'],
          url: `${url}/llms.txt`,
          description: 'Link index of every documentation page, in the llmstxt.org format.',
        },
        {
          type: 'llms_full',
          format: 'markdown',
          audience: 'llm',
          url: `${url}/llms-full.txt`,
          description: 'Every documentation page concatenated into one markdown file.',
        },
        {
          type: 'markdown',
          format: 'markdown',
          audience: ['human', 'llm'],
          url: `${url}/llm/markdown/index.md`,
        },
        {
          type: 'markdown_page',
          format: 'markdown',
          audience: ['human', 'llm'],
          url_pattern: `${url}/<page-path>.md`,
          example: `${url}/app/get-started/why-cypress.md`,
        },
        {
          type: 'markdown_section',
          format: 'markdown',
          audience: ['human', 'llm'],
          url_pattern: `${url}/<page-path>/<h2-slug>.md`,
          example: `${url}/app/get-started/why-cypress/features.md`,
        },
        ...(config.emit?.json
          ? [
              {
                type: 'json',
                format: 'json',
                audience: 'llm',
                url: `${url}/llm/json/full/index.json`,
              },
              {
                type: 'json_chunked',
                format: 'json',
                audience: 'llm',
                url: `${url}/llm/json/chunked/index.json`,
              },
            ]
          : []),
      ],
      llm_guidance: [
        'start from llms.txt: it links the markdown for every documentation page',
        'append .md to any documentation page URL to get that page\'s markdown',
        'for a single topic, fetch one section\'s markdown at <page-path>/<h2-slug>.md instead of the full page',
        'use llms-full.txt to ingest the whole corpus in one request',
        'use chunked JSON for retrieval and embeddings',
        'use full JSON for complete context',
        'use markdown for semantic understanding',
        'use HTML only as a fallback',
      ],
    }
  }
}
