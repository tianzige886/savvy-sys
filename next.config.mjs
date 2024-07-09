/** @type {import('next').NextConfig} */
import withAntdLess from 'next-plugin-antd-less';
// import createNextIntlPlugin from 'next-intl/plugin';

const CORS_HEADERS = [
    {
      key: "Access-Control-Allow-Credentials",
      value: "true"
    },
    {
      key: "Access-Control-Allow-Origin",
      value: "*"
    },
    {
      key: "Access-Control-Allow-Methods",
      value: "GET,DELETE,PATCH,POST,PUT"
    },
    {
      key: "Access-Control-Allow-Headers",
      value: "Content-Type, Authorization",
    },
  ];

const nextConfig = {
    env: {
      "JWT_SECRET": "balance-game",
        "BASE_API_URL": "http://44.214.134.96:8889/api"
    },
    async headers() {
        // 跨域配置
        return [
          {
            source: "/favicon.ico",
            headers: [
              {
              key: "Cache-Control",
              value: "public, max-age=86400",
              },
            ],
          },
          {
              source: "/api/:path*", // 为访问 /api/** 的请求添加 CORS HTTP Headers
              headers: CORS_HEADERS
            },
          {
            source: "/specific", // 为特定路径的请求添加 CORS HTTP Headers,
            headers: CORS_HEADERS
          }
        ];
    },
    swcMinify: true,
    // fastRefresh: true,
    // concurrentFeatures: true
    rewrites: async () => {
        const env = process.env.NODE_ENV;
        const testUrl = "http://44.214.134.96:9000";
        const prodUrl = "http://44.214.134.96:9000";
        // const prodUrl = "http://balance.game:8888";
        const destination = env === "production" ? prodUrl : testUrl;
        return [
            {
                source: "/api/:path*",
                destination: `${destination}/api/:path*`, // 代理到后端API
                // basePath: false
            },
        ];
    },
};

// const withNextIntl = createNextIntlPlugin()(nextConfig);
// const withNextIntl = createNextIntlPlugin()(nextConfig);

export default withAntdLess(nextConfig);
