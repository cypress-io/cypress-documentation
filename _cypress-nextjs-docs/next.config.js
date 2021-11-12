const withCSS = require("@zeit/next-css")

module.exports = {
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
