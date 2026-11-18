import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html'], ['junit', { outputFile: 'test-results/junit-report.xml' }]]
    : 'html',
  expect: {
    timeout: 15000,
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    ignoreHTTPSErrors: true,
    viewport: {
      width: 1280,
      height: 720,
    },
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
  projects: [
    {
      name: 'chromium',
      grepInvert: /@webmcp/,
      use: { ...devices['Desktop Chrome'] },
    },
    // WebMCP, behind the flag Chrome's `chrome://flags/#enable-webmcp-testing`
    // sets: the tests tagged `@webmcp` drive `document.modelContext` itself.
    {
      name: 'chromium-webmcp',
      grep: /@webmcp/,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { args: ['--enable-features=WebMCPTesting'] },
      },
    },
    // `@chromium` is for a test that needs what only Chromium offers, such as
    // slowing the CPU down through the DevTools protocol.
    {
      name: 'firefox',
      grepInvert: /@webmcp|@chromium/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      grepInvert: /@webmcp|@chromium/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
})
