// Compile-time checks for the FullStoryEvents registry, run by
// `npm run typecheck`. Nothing imports this file and nothing calls the
// function, so it never runs: each @ts-expect-error fails the typecheck if the
// line below it ever starts compiling.
import { trackFullStoryEvent } from './fullstory'

export function fullStoryEventTypeCases(): void {
  trackFullStoryEvent('AI Prompt Copied', {
    promptTitle: 'Fix a failing test',
    pagePath: '/app/tooling/cypress-tap',
    promptWasVisible: true,
  })
  trackFullStoryEvent('Page Markdown Opened', {
    pagePath: '/api/commands/blur',
    destination: 'Claude',
  })

  // An event name the registry doesn't list
  // @ts-expect-error
  trackFullStoryEvent('Copied AI Prompt', { promptTitle: 'x', pagePath: '/' })

  // A missing property
  // @ts-expect-error
  trackFullStoryEvent('AI Prompt Copied', { promptTitle: 'x', pagePath: '/' })

  trackFullStoryEvent('AI Prompt Expanded', {
    promptTitle: 'x',
    pagePath: '/',
    // An extra property
    // @ts-expect-error
    promptWasVisible: true,
  })

  trackFullStoryEvent('Page Markdown Copied', {
    // A property under the wrong name
    // @ts-expect-error
    markdown_url: 'https://docs.cypress.io/api/commands/blur.md',
  })

  trackFullStoryEvent('AI Prompt Copied', {
    promptTitle: 'x',
    pagePath: '/',
    // A wrong type
    // @ts-expect-error
    promptWasVisible: 'false',
  })

  trackFullStoryEvent('Page Markdown Opened', {
    pagePath: '/',
    // A label outside the fixed set
    // @ts-expect-error
    destination: 'Gemini',
  })

  // No properties at all
  // @ts-expect-error
  trackFullStoryEvent('Page Markdown Viewed')
}
