/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: false,
  images: {
    domains: ["via.placeholder.com"]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    // Firebase node builds pull in undici, which webpack 5 in Next 13 can't parse.
    // Node 18+ has global fetch, so stub it.
    config.resolve.alias = { ...config.resolve.alias, undici: false };

    return config;
  }

}


module.exports = nextConfig
