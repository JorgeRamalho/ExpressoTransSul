import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 375, height: 812 }, isMobile: true },
    },
    {
      name: 'tablet',
      use: { viewport: { width: 768, height: 1024 } },
    },
  ],
  webServer: [
    {
      command:
        process.platform === 'win32'
          ? 'powershell -NoProfile -ExecutionPolicy Bypass -Command "$env:Path=\'./.tools/node;\'+$env:Path; npm run api"'
          : 'npm run api',
      url: 'http://127.0.0.1:3001/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command:
        process.platform === 'win32'
          ? 'powershell -NoProfile -ExecutionPolicy Bypass -Command "$env:Path=\'./.tools/node;\'+$env:Path; npm run dev"'
          : 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
