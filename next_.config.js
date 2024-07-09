// next.config.js

const { DefinePlugin } = require("webpack");

const contractAddresses = {
  development: "0x9055222122F974B7E6ac8eaAC952A6B6039d26e1",
  production: "0x9055222122F974B7E6ac8eaAC952A6B6039d26e1",
  test: "0x9055222122F974B7E6ac8eaAC952A6B6039d26e1",
};

module.exports = {
  reactStrictMode: true,
  compress: true,
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new DefinePlugin({
        "process.env.CONTRACT_ADDRESS": JSON.stringify(
          contractAddresses[process.env.NODE_ENV]
        ),
      })
    );

    if (isServer) {
      config.plugins.push(
        new DefinePlugin({
          "process.env.CONTRACT_ADDRESS": JSON.stringify(
            process.env.NODE_ENV === "production"
              ? contractAddresses.production
              : contractAddresses.development
          ),
        })
      );
    }

    return config;
  },
  // rewrites: async () => {
  //   const env = process.env.NODE_ENV;
  //   const testUrl = "http://44.214.134.96:8889";
  //   const prodUrl = "http://44.214.134.96:8889";
  //   // const prodUrl = "http://balance.game:8888";
  //   const destination = env === "production" ? prodUrl : testUrl;
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${destination}/api/:path*`, // 代理到后端API
  //       basePath: false
  //     },
  //   ];
  // },
};
