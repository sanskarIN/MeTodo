import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  test: {
    environment: "node",
    exclude: ["node_modules", "dist"],
  },
});

// Vitest uses the same aliases as tsconfig.json so server and shared-module
// imports resolve identically in development, CI, and local test runs.
