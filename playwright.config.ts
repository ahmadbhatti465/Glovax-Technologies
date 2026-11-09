import { defineConfig } from "@playwright/test";

const PORT = 3200;

// Run `npm run e2e:prepare` first. Variables set here take priority over .env,
// so the smoke tests can only ever use the throwaway e2e.db file.
export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.CI ? undefined : "chrome",
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    env: {
      DATABASE_URL: "file:./e2e.db",
      DATABASE_AUTH_TOKEN: "",
      JWT_SECRET: "e2e-secret-that-is-at-least-32-characters",
      ADMIN_PASSWORD: "e2e-password",
    },
  },
});
