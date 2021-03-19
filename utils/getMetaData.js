const type = 'website'
const url = 'https://docs.cypress.io'
const title = 'Cypress Documentation'
const description = 'Cypress Documentation'
const mainImage = 'https://docs.cypress.io/img/guides/real-world-app.png'

export const getMetaData = (meta) => {
  return [  
    {
      hid: 'description',
      name: 'description',
      content: (meta && meta.description) || description,
    },
    // Open Graph
    {
      hid: 'og:locale',
      property: 'og:locale',
      content: 'en'
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: (meta && meta.description) || description
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: (meta && meta.type) || type
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: (meta && meta.url) || url
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: (meta && meta.title) || title
    },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: 'Cypress Documentation'
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: (meta && meta.mainImage) || mainImage 
    },
    {
      hid: 'fb:admins',
      property: 'fb:admins',
      content: '22600147'
    },
    {
      hid: 'fb:app_id',
      property: 'fb:app_id',
      content: '446223215719535'
    },
    // Twitter
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary'
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: (meta && meta.title) || title
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: (meta && meta.description) || description
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: (meta && meta.mainImage) || mainImage
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: (meta && meta.url) || url
    },
    {
      hid: 'twitter:creator',
      name: 'twitter:creator',
      content: '@Cypress_io'
    },
    {
      hid: 'twitter:site',
      name: 'twitter:site',
      content: 'Cypress_io'
    }
  ]
}