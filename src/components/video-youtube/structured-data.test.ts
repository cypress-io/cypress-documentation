import { describe, expect, test } from 'vitest'
import {
  buildVideoObject,
  extractYouTubeId,
  serializeJsonLd,
} from './structured-data'

describe('extractYouTubeId', () => {
  test.each([
    ['https://www.youtube.com/embed/TD0u9ayqXXE', 'TD0u9ayqXXE'],
    ['https://youtube.com/embed/vFLShoCM8pA', 'vFLShoCM8pA'],
    [
      'https://www.youtube.com/embed/hnDPz7dognY?si=PRRy4f5n6f1jzfVJ',
      'hnDPz7dognY',
    ],
    ['https://youtube.com/embed/Oqq-_QZWzhg', 'Oqq-_QZWzhg'],
  ])('reads the ID from %s', (src, id) => {
    expect(extractYouTubeId(src)).toBe(id)
  })

  test.each([
    ['a truncated ID', 'https://youtube.com/embed/dwU5gUG2'],
    ['an ID that is too long', 'https://youtube.com/embed/dwU5gUG2-EMx'],
    ['a watch URL', 'https://www.youtube.com/watch?v=TD0u9ayqXXE'],
    ['a Vimeo URL', 'https://player.vimeo.com/video/123'],
    ['a local file', '/img/app/demo.mp4'],
  ])('returns null for %s', (_, src) => {
    expect(extractYouTubeId(src)).toBeNull()
  })
})

describe('buildVideoObject', () => {
  const src = 'https://www.youtube.com/embed/TD0u9ayqXXE'

  test('builds a complete VideoObject from the embed and the data', () => {
    const { videoObject } = buildVideoObject(
      'TD0u9ayqXXE',
      src,
      'Agentic Testing with Cypress',
      {
        uploadDate: '2026-09-24',
        description: 'Agentic testing walkthrough.',
        duration: 'PT12M30S',
      }
    )
    expect(videoObject).toEqual({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'Agentic Testing with Cypress',
      thumbnailUrl: 'https://i.ytimg.com/vi/TD0u9ayqXXE/hqdefault.jpg',
      uploadDate: '2026-09-24',
      embedUrl: src,
      contentUrl: 'https://www.youtube.com/watch?v=TD0u9ayqXXE',
      description: 'Agentic testing walkthrough.',
      duration: 'PT12M30S',
    })
  })

  test('omits blank optional fields', () => {
    const { videoObject } = buildVideoObject('TD0u9ayqXXE', src, 'Demo', {
      uploadDate: '2023-08-29',
      description: '',
      duration: '',
    })
    expect(videoObject).not.toHaveProperty('description')
    expect(videoObject).not.toHaveProperty('duration')
  })

  test.each([
    ['blank', { uploadDate: '' }],
    ['not ISO 8601', { uploadDate: 'Aug 29, 2023' }],
    ['absent because the video has no data entry', undefined],
  ])('reports an uploadDate that is %s', (_, data) => {
    expect(buildVideoObject('TD0u9ayqXXE', src, 'Demo', data)).toEqual({
      missing: ['uploadDate (in src/data/youtube-videos.json)'],
    })
  })

  test('reports a missing title', () => {
    expect(
      buildVideoObject('TD0u9ayqXXE', src, undefined, {
        uploadDate: '2023-08-29',
      })
    ).toEqual({ missing: ['name (the title prop)'] })
  })
})

describe('serializeJsonLd', () => {
  test('escapes < so a value cannot close the <script> tag', () => {
    const name = 'Break out </script><script>alert(1)</script>'
    const json = serializeJsonLd({ name })
    expect(json).not.toContain('<')
    expect(json).toContain('\\u003c/script>')
    // The escaped form still parses back to the original value.
    expect(JSON.parse(json).name).toBe(name)
  })
})
