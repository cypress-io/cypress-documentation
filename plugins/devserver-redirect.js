module.exports = function (context, options) {
    return {
      name: 'devserver-redirect',
      configureWebpack(config, isServer, utils) {
        return {
          devServer: {
            open: '/guides/overview/why-cypress', // Opens localhost:3000/guides/overview/why-cypress instead of localhost:3000/
          },
        };
      },
    };
  };
