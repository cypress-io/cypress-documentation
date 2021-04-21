import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-04-19',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})
