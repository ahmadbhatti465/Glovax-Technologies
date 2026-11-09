import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    globalSetup: ["tests/unit/global-setup.ts"],
    fileParallelism: false,
    // A throwaway file, so tests can never reach a real database.
    env: {
      DATABASE_URL: "file:./.vitest.db",
      DATABASE_AUTH_TOKEN: "",
      JWT_SECRET: "test-secret-that-is-at-least-32-characters",
    },
  },
});
