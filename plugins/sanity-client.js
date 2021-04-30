import sanityClient from '@sanity/client'

export const getClient = () => {
  if (process.env.SANITY_PROJECT_ID && process.env.SANITY_AUTH_TOKEN) {
    return sanityClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: 'production',
      apiVersion: '2021-04-19',
      token: process.env.SANITY_AUTH_TOKEN,
      useCdn: false,
    })
  }

  const mockClient = {
    fetch: async () => [],
  }

  return mockClient
}
