import { describe, expect, test, vi } from 'vitest'
import videoPlugin from './video-structured-data.js'

const {
  extractYouTubeId,
  findYouTubeEmbeds,
  findInvalidYouTubeEmbeds,
  invalidEmbedsError,
  buildVideoObject,
  buildPageVideoObjects,
  serializeJsonLd,
  toRouteKey,
} = videoPlugin

const VIDEO_DATA = {
  TD0u9ayqXXE: {
    uploadDate: '2026-09-24',
    description: 'Agentic testing walkthrough.',
    duration: 'PT12M30S',
  },
  vFLShoCM8pA: {
    uploadDate: '2023-08-29',
    description: '',
    duration: '',
  },
  noUploadDat: {
    uploadDate: '',
    description: 'Has a description but no date.',
    duration: '',
  },
}

// ---------------------------------------------------------------------------
// extractYouTubeId
// ---------------------------------------------------------------------------

describe('extractYouTubeId', () => {
  test('reads the ID from a www.youtube.com embed URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/TD0u9ayqXXE')).toBe(
      'TD0u9ayqXXE'
    )
  })

  test('reads the ID from a youtube.com embed URL without www', () => {
    expect(extractYouTubeId('https://youtube.com/embed/vFLShoCM8pA')).toBe(
      'vFLShoCM8pA'
    )
  })

  test('ignores a query string after the ID', () => {
    expect(
      extractYouTubeId(
        'https://www.youtube.com/embed/hnDPz7dognY?si=PRRy4f5n6f1jzfVJ'
      )
    ).toBe('hnDPz7dognY')
  })

  test('accepts IDs containing - and _', () => {
    expect(extractYouTubeId('https://youtube.com/embed/Oqq-_QZWzhg')).toBe(
      'Oqq-_QZWzhg'
    )
  })

  test('returns null for an ID that is not 11 characters', () => {
    expect(extractYouTubeId('https://youtube.com/embed/dwU5gUG2')).toBeNull()
  })

  test('returns null for Vimeo, local, and watch URLs', () => {
    expect(extractYouTubeId('https://player.vimeo.com/video/123')).toBeNull()
    expect(extractYouTubeId('/img/app/demo.mp4')).toBeNull()
    expect(
      extractYouTubeId('https://www.youtube.com/watch?v=TD0u9ayqXXE')
    ).toBeNull()
    expect(extractYouTubeId(undefined)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// findYouTubeEmbeds
// ---------------------------------------------------------------------------

describe('findYouTubeEmbeds', () => {
  test('finds a multi-line <DocsVideo> and reads src and title', () => {
    const mdx = [
      '<DocsVideo',
      '  src="https://www.youtube.com/embed/TD0u9ayqXXE"',
      '  title="Agentic Testing with Cypress"',
      '/>',
    ].join('\n')
    expect(findYouTubeEmbeds(mdx)).toEqual([
      {
        src: 'https://www.youtube.com/embed/TD0u9ayqXXE',
        title: 'Agentic Testing with Cypress',
      },
    ])
  })

  test('reads single-quoted and JSX-expression attribute values', () => {
    const mdx =
      "<DocsVideo src={'https://youtube.com/embed/vFLShoCM8pA'} title='Demo' />"
    expect(findYouTubeEmbeds(mdx)).toEqual([
      { src: 'https://youtube.com/embed/vFLShoCM8pA', title: 'Demo' },
    ])
  })

  test('skips local and Vimeo videos', () => {
    const mdx = [
      '<DocsVideo src="/img/app/demo.mp4" title="Local" />',
      '<DocsVideo src="https://player.vimeo.com/video/1" title="Vimeo" />',
    ].join('\n')
    expect(findYouTubeEmbeds(mdx)).toEqual([])
  })

  test('ignores embeds inside fenced code blocks', () => {
    const mdx = [
      '```jsx',
      '<DocsVideo src="https://youtube.com/embed/vFLShoCM8pA" title="Example" />',
      '```',
    ].join('\n')
    expect(findYouTubeEmbeds(mdx)).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// findInvalidYouTubeEmbeds
// ---------------------------------------------------------------------------

describe('findInvalidYouTubeEmbeds', () => {
  test('reports a truncated ID with the line its tag starts on', () => {
    const mdx = [
      '# Videos',
      '',
      '<DocsVideo',
      '  src="https://youtube.com/embed/dwU5gUG2"',
      '  title="Check code coverage"',
      '/>',
    ].join('\n')
    expect(findInvalidYouTubeEmbeds(mdx)).toEqual([
      { line: 3, src: 'https://youtube.com/embed/dwU5gUG2' },
    ])
  })

  test('reports IDs that are too long or not embed URLs', () => {
    const mdx = [
      '<DocsVideo src="https://youtube.com/embed/dwU5gUG2-EMx" title="Long" />',
      '<DocsVideo src="https://www.youtube.com/watch?v=dwU5gUG2-EM" title="Watch" />',
    ].join('\n')
    expect(findInvalidYouTubeEmbeds(mdx)).toEqual([
      { line: 1, src: 'https://youtube.com/embed/dwU5gUG2-EMx' },
      { line: 2, src: 'https://www.youtube.com/watch?v=dwU5gUG2-EM' },
    ])
  })

  test('passes valid IDs in both URL forms, with or without a query string', () => {
    const mdx = [
      '<DocsVideo src="https://youtube.com/embed/dwU5gUG2-EM" title="A" />',
      '<DocsVideo src="https://www.youtube.com/embed/hnDPz7dognY?si=x" title="B" />',
    ].join('\n')
    expect(findInvalidYouTubeEmbeds(mdx)).toEqual([])
  })

  test('ignores local and Vimeo videos and fenced code examples', () => {
    const mdx = [
      '<DocsVideo src="/img/app/demo.mp4" title="Local" />',
      '```jsx',
      '<DocsVideo src="https://youtube.com/embed/bad" title="Example" />',
      '```',
    ].join('\n')
    expect(findInvalidYouTubeEmbeds(mdx)).toEqual([])
  })

  test('keeps line numbers accurate after a fenced code block', () => {
    const mdx = [
      '```js',
      'const a = 1',
      '```',
      '',
      '<DocsVideo src="https://youtube.com/embed/bad" title="After code" />',
    ].join('\n')
    expect(findInvalidYouTubeEmbeds(mdx)).toEqual([
      { line: 5, src: 'https://youtube.com/embed/bad' },
    ])
  })
})

// ---------------------------------------------------------------------------
// invalidEmbedsError
// ---------------------------------------------------------------------------

describe('invalidEmbedsError', () => {
  test('returns null when every embed is valid', () => {
    expect(invalidEmbedsError([])).toBeNull()
  })

  test('lists every invalid embed as file:line', () => {
    const error = invalidEmbedsError([
      {
        file: 'docs/app/run-tests/code-coverage.mdx',
        line: 891,
        src: 'https://youtube.com/embed/dwU5gUG2',
      },
      {
        file: 'docs/partials/_video.mdx',
        line: 3,
        src: 'https://www.youtube.com/watch?v=dwU5gUG2-EM',
      },
    ])
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain('Found 2 YouTube <DocsVideo> embed(s)')
    expect(error.message).toContain(
      'docs/app/run-tests/code-coverage.mdx:891: "https://youtube.com/embed/dwU5gUG2"'
    )
    expect(error.message).toContain(
      'docs/partials/_video.mdx:3: "https://www.youtube.com/watch?v=dwU5gUG2-EM"'
    )
  })
})

// ---------------------------------------------------------------------------
// buildVideoObject
// ---------------------------------------------------------------------------

describe('buildVideoObject', () => {
  test('builds a complete VideoObject from the embed and the data file', () => {
    const { id, videoObject } = buildVideoObject(
      {
        src: 'https://www.youtube.com/embed/TD0u9ayqXXE',
        title: 'Agentic Testing with Cypress',
      },
      VIDEO_DATA
    )
    expect(id).toBe('TD0u9ayqXXE')
    expect(videoObject).toEqual({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'Agentic Testing with Cypress',
      thumbnailUrl: 'https://i.ytimg.com/vi/TD0u9ayqXXE/hqdefault.jpg',
      uploadDate: '2026-09-24',
      embedUrl: 'https://www.youtube.com/embed/TD0u9ayqXXE',
      contentUrl: 'https://www.youtube.com/watch?v=TD0u9ayqXXE',
      description: 'Agentic testing walkthrough.',
      duration: 'PT12M30S',
    })
  })

  test('omits blank optional fields', () => {
    const { videoObject } = buildVideoObject(
      { src: 'https://youtube.com/embed/vFLShoCM8pA', title: 'Test Replay' },
      VIDEO_DATA
    )
    expect(videoObject).not.toHaveProperty('description')
    expect(videoObject).not.toHaveProperty('duration')
    expect(videoObject.uploadDate).toBe('2023-08-29')
  })

  test('reports a missing uploadDate instead of building', () => {
    const result = buildVideoObject(
      { src: 'https://youtube.com/embed/noUploadDat', title: 'No date' },
      VIDEO_DATA
    )
    expect(result.videoObject).toBeUndefined()
    expect(result.missing).toEqual([
      'uploadDate (in src/data/youtube-videos.json)',
    ])
  })

  test('reports a video that has no entry in the data file', () => {
    const result = buildVideoObject(
      { src: 'https://youtube.com/embed/AAAAAAAAAAA', title: 'Unknown' },
      VIDEO_DATA
    )
    expect(result.videoObject).toBeUndefined()
    expect(result.missing).toEqual([
      'uploadDate (in src/data/youtube-videos.json)',
    ])
  })

  test('reports a missing title', () => {
    const result = buildVideoObject(
      { src: 'https://youtube.com/embed/vFLShoCM8pA' },
      VIDEO_DATA
    )
    expect(result.videoObject).toBeUndefined()
    expect(result.missing).toEqual(['name (the title prop)'])
  })

  test('reports an uploadDate that is not ISO 8601', () => {
    const result = buildVideoObject(
      { src: 'https://youtube.com/embed/vFLShoCM8pA', title: 'Test Replay' },
      { vFLShoCM8pA: { uploadDate: 'Aug 29, 2023' } }
    )
    expect(result.videoObject).toBeUndefined()
    expect(result.missing).toEqual([
      'uploadDate (in src/data/youtube-videos.json)',
    ])
  })

  test('reports a src with no extractable video ID', () => {
    const result = buildVideoObject(
      { src: 'https://youtube.com/embed/dwU5gUG2', title: 'Broken' },
      VIDEO_DATA
    )
    expect(result.videoObject).toBeUndefined()
    expect(result.missing).toEqual(['a YouTube video ID in src'])
  })
})

// ---------------------------------------------------------------------------
// buildPageVideoObjects
// ---------------------------------------------------------------------------

describe('buildPageVideoObjects', () => {
  test('emits one VideoObject per video on a page with two videos', () => {
    const mdx = [
      '# Page',
      '',
      '<DocsVideo',
      '  src="https://www.youtube.com/embed/TD0u9ayqXXE"',
      '  title="Agentic Testing"',
      '/>',
      '',
      'Some prose between the videos.',
      '',
      '<DocsVideo src="https://youtube.com/embed/vFLShoCM8pA" title="Test Replay" />',
    ].join('\n')
    const objects = buildPageVideoObjects(mdx, VIDEO_DATA)
    expect(objects.map((o) => o.name)).toEqual([
      'Agentic Testing',
      'Test Replay',
    ])
    expect(objects.map((o) => o.embedUrl)).toEqual([
      'https://www.youtube.com/embed/TD0u9ayqXXE',
      'https://youtube.com/embed/vFLShoCM8pA',
    ])
  })

  test('emits a video embedded twice on one page once', () => {
    const embed =
      '<DocsVideo src="https://youtube.com/embed/vFLShoCM8pA" title="Test Replay" />'
    const objects = buildPageVideoObjects(`${embed}\n\n${embed}`, VIDEO_DATA)
    expect(objects).toHaveLength(1)
  })

  test('skips a video missing required fields and warns', () => {
    const warn = vi.fn()
    const mdx = [
      '<DocsVideo src="https://youtube.com/embed/noUploadDat" title="No date" />',
      '<DocsVideo src="https://youtube.com/embed/vFLShoCM8pA" title="Test Replay" />',
    ].join('\n')
    const objects = buildPageVideoObjects(mdx, VIDEO_DATA, {
      file: 'docs/example.mdx',
      warn,
    })
    expect(objects.map((o) => o.name)).toEqual(['Test Replay'])
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toBe(
      '[video-structured-data] Skipped https://youtube.com/embed/noUploadDat in docs/example.mdx: missing uploadDate (in src/data/youtube-videos.json).'
    )
  })

  test('returns an empty list for a page without YouTube embeds', () => {
    expect(
      buildPageVideoObjects('<DocsVideo src="/img/a.mp4" />', VIDEO_DATA)
    ).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// serializeJsonLd
// ---------------------------------------------------------------------------

describe('serializeJsonLd', () => {
  test('escapes < so a value cannot close the <script> tag', () => {
    const { videoObject } = buildVideoObject(
      {
        src: 'https://youtube.com/embed/vFLShoCM8pA',
        title: 'Break out </script><script>alert(1)</script>',
      },
      VIDEO_DATA
    )
    const json = serializeJsonLd(videoObject)
    expect(json).not.toContain('<')
    expect(json).toContain('\\u003c/script>')
    // The escaped form still parses back to the original value.
    expect(JSON.parse(json).name).toBe(
      'Break out </script><script>alert(1)</script>'
    )
  })
})

// ---------------------------------------------------------------------------
// toRouteKey
// ---------------------------------------------------------------------------

describe('toRouteKey', () => {
  test('drops a trailing slash to match the DocItem layout lookup', () => {
    expect(toRouteKey('/app/ai/overview/')).toBe('/app/ai/overview')
    expect(toRouteKey('/app/ai/overview')).toBe('/app/ai/overview')
    expect(toRouteKey('/')).toBe('/')
  })
})
