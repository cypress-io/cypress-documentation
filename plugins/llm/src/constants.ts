import { LlmExportConfig } from './types'

export const PARTIALS_SECTION = 'partials'

export const DEFAULT_LLM_EXPORT_CONFIG: LlmExportConfig = {
  includeSections: ['accessibility', 'api', 'app', 'cloud', 'ui-coverage', 'partials'],
  partialsMode: 'inline',
  emit: { json: true },
  chunk: { minHeadingLevel: 2, minContentWords: 30 },
}
