import type { NextConfig } from "next";

// No GitHub Pages o site fica em usuario.github.io/<repo>, não na raiz do
// domínio — basePath/assetPrefix só entram nesse build (GITHUB_PAGES=true
// setado no workflow), mantendo o build local e o deploy no domínio raiz
// (ex.: Firebase Hosting) sem prefixo.
const repoBasePath = process.env.GITHUB_PAGES === "true" ? "/bezalel-sistema-igreja" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repoBasePath,
  assetPrefix: repoBasePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
