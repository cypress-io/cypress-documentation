const GithubSlugger = require('github-slugger')

let slugger

beforeEach(() => {
  slugger = new GithubSlugger()
})

describe('tagsToRemove', () => {
  it('should strip <E2EOnlyBadge/>', () => {
    expect(slugger.slug('Sample Header <E2EOnlyBadge/>')).toBe('Sample-Header')
  })

  it('should strip <E2EOnlyBadge />', () => {
    expect(slugger.slug('Sample Header <E2EOnlyBadge />')).toBe('Sample-Header')
  })

  it('should strip <ComponentOnlyBadge/>', () => {
    expect(slugger.slug('Sample Header <ComponentOnlyBadge/>')).toBe(
      'Sample-Header'
    )
  })

  it('should strip <ComponentOnlyBadge />', () => {
    expect(slugger.slug('Sample Header <ComponentOnlyBadge />')).toBe(
      'Sample-Header'
    )
  })
})
