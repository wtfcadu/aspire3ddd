/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly tell Next.js that src/ contains the app directory
  distDir: '.next',
  // Specify the source directory 
  experimental: {
    // This helps ensure Netlify properly recognizes the src directory structure
    outputFileTracingRoot: __dirname,
  }
}

module.exports = nextConfig
