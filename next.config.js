/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    if (!isServer) {
      // 在客户端构建时不包含 canvas 相关的模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }

    return config;
  },
  // 配置输出独立模式，这样可以更好地处理原生模块
  output: "standalone",
};

module.exports = nextConfig;
