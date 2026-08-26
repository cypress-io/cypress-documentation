/**
 * Every docs page's markdown is published at its own route plus `.md`
 * (`/app/get-started/why-cypress.md`), and each of its `##` sections at
 * `<page-route>/<h2-slug>.md`. The LLM export plugin mirrors the files there at
 * build time, so the path is derivable from the route alone.
 *
 * Shared by the `<link rel="alternate" type="text/markdown">` tag in
 * `src/theme/DocItem/Layout` and the reader-facing control in
 * `src/components/markdown-actions`, so the two never drift apart.
 */
export function markdownPathFor(pathname: string): string {
  const normalized = pathname.replace(/\/$/, '').replace(/^\//, '') || 'index'
  return `/${normalized}.md`
}
