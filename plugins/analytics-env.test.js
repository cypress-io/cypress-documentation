import { describe, expect, test } from 'vitest'
import { isProductionDeploy } from './analytics-env.js'

describe('isProductionDeploy', () => {
  test('is false for the dev server', () => {
    expect(isProductionDeploy({ NODE_ENV: 'development' })).toBe(false)
  })

  test('is false for a local production build (no deploy context)', () => {
    expect(isProductionDeploy({ NODE_ENV: 'production' })).toBe(false)
  })

  test('is false for the CI build the Cypress specs run against', () => {
    expect(isProductionDeploy({ NODE_ENV: 'production', CI: 'true' })).toBe(
      false
    )
  })

  test('is true for the Netlify production context', () => {
    expect(
      isProductionDeploy({ NODE_ENV: 'production', CONTEXT: 'production' })
    ).toBe(true)
  })

  test.each(['deploy-preview', 'branch-deploy', 'dev'])(
    'is false for the Netlify %s context',
    (context) => {
      expect(
        isProductionDeploy({ NODE_ENV: 'production', CONTEXT: context })
      ).toBe(false)
    }
  )

  test('is true for the Vercel production environment', () => {
    expect(
      isProductionDeploy({ NODE_ENV: 'production', VERCEL_ENV: 'production' })
    ).toBe(true)
  })

  test.each(['preview', 'development'])(
    'is false for the Vercel %s environment',
    (vercelEnv) => {
      expect(
        isProductionDeploy({ NODE_ENV: 'production', VERCEL_ENV: vercelEnv })
      ).toBe(false)
    }
  )

  test('ANALYTICS_ENABLED=true opts a preview build in', () => {
    expect(
      isProductionDeploy({
        NODE_ENV: 'production',
        CONTEXT: 'deploy-preview',
        ANALYTICS_ENABLED: 'true',
      })
    ).toBe(true)
  })

  test('ANALYTICS_ENABLED=false opts the production deploy out', () => {
    expect(
      isProductionDeploy({
        NODE_ENV: 'production',
        CONTEXT: 'production',
        ANALYTICS_ENABLED: 'false',
      })
    ).toBe(false)
  })
})
