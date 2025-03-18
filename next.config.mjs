/** @type {import('next').NextConfig} */
import fs from 'fs';
import https from 'https';

const nextConfig = {
  reactStrictMode: true,
  devServer: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
  },
};

export default nextConfig;
