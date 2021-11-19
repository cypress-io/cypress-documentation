const withCSS = require("@zeit/next-css")

module.exports = {
  /**
   * Redirects
   * https://nextjs.org/docs/api-reference/next.config.js/redirects
   */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/guides/overview/why-cypress',
        permanent: true
      },
      {
        source: '/guides',
        destination: '/guides/overview/why-cypress',
        permanent: true
      },
      {
        source: '/api',
        destination: '/api/table-of-contents',
        permanent: true
      },
      {
        source: '/plugins',
        destination: '/plugins/directory',
        permanent: true
      },
      {
        source: '/examples',
        destination: '/examples/examples/recipes',
        permanent: true
      },
      {
        source: '/faq',
        destination: '/faq/questions/using-cypress-faq',
        permanent: true
      }
    ]
  },
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "source.unsplash.com", "tailwindui.com"],
  },
  webpack: function (config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
          name: "[name].[ext]",
        },
      },
    })
    return config
  },
}
