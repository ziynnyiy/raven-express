/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 確保在生產環境中禁用 strict mode !
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
