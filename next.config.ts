import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  // Phone / tunnel previews send Origin: *.ngrok-free.app. Next blocks
  // /_next scripts from unknown hosts, so Framer never hydrates and
  // hero copy stays at opacity 0.
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok-free.dev",
    "*.ngrok.io",
  ],
};

export default nextConfig;
