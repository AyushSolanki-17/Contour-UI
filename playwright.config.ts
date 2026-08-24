import { defineConfig } from "@playwright/test";

const fixturePort = 18081;
const appPort = 3100;

export default defineConfig({
  testDir: "./test/browser",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "node test/fixtures/health-server.mjs",
      url: `http://127.0.0.1:${fixturePort}/health/ready`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `CONTOUR_API_URL=http://127.0.0.1:${fixturePort} npm run start -- -p ${appPort}`,
      url: `http://127.0.0.1:${appPort}`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
