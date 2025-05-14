/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static output for better Netlify compatibility
  output: 'export',
  // Don't generate source maps in production
  productionBrowserSourceMaps: false,
  // Static export settings
  images: {
    unoptimized: true,
  },
  // The base path for your deployment
  basePath: '',
  // Explicitly tell Next.js that files are served from root
  assetPrefix: '',
  // Other settings from before
  distDir: 'out',
  experimental: {
    // This helps ensure Netlify properly recognizes the src directory structure
    outputFileTracingRoot: __dirname,
  }
}

module.exports = nextConfig
