import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages on a custom domain (served from the root).
 * `next build` writes the whole site to ./out, which the workflow deploys.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // GitHub Pages has no image optimizer. Notion assets are downloaded at
    // build time into public/cms, so every image is a local static file.
    unoptimized: true,
  },
};

export default nextConfig;
