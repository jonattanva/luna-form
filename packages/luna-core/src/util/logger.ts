export const logger = {
  error: (...args: unknown[]) => {
    if (isConsoleAvailable() && !isProduction()) {
      console.error('[Luna Form]', ...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (isConsoleAvailable() && !isProduction()) {
      console.warn('[Luna Form]', ...args)
    }
  },
  info: (...args: unknown[]) => {
    if (isConsoleAvailable() && !isProduction()) {
      console.info('[Luna Form]', ...args)
    }
  },
}

function isConsoleAvailable(): boolean {
  return typeof console !== 'undefined'
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}
