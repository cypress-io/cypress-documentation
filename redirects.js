const redirects = [
  {
    source: '/',
    destination: '/guides/overview/why-cypress',
    permanent: true,
  },
  {
    source: '/guides',
    destination: '/guides/overview/why-cypress',
    permanent: true,
  },
  {
    source: '/api',
    destination: '/api/table-of-contents',
    permanent: true,
  },
  {
    source: '/api/assertions',
    destination: '/guides/references/assertions',
    permanent: true,
  },
  {
    source: '/api/table-of-contents',
    destination: '/api-docs/table-of-contents',
    permanent: true,
  },
  {
    source: '/api/:slug(events|commands|utilities|cypress-api|plugins)/:path*',
    destination: '/api-docs/:slug/:path*',
    permanent: true,
  },
  {
    source: '/plugins',
    destination: '/plugins/directory',
    permanent: true,
  },
  {
    source: '/examples',
    destination: '/examples/examples/recipes',
    permanent: true,
  },
  {
    source: '/faq',
    destination: '/faq/questions/using-cypress-faq',
    permanent: true,
  },
]

module.exports = redirects
