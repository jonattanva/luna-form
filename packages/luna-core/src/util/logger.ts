export const logger = {
  error: (...args: unknown[]) => {
    if (isConsoleAvailable() && !isProduction()) {
      getConsole().error('[Luna Form]', ...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (isConsoleAvailable() && !isProduction()) {
      getConsole().warn('[Luna Form]', ...args)
    }
  },
  info: (...args: unknown[]) => {
    if (isConsoleAvailable() && !isProduction()) {
      getConsole().info('[Luna Form]', ...args)
    }
  },
}

const isConsoleAvailable = () => typeof getConsole() !== 'undefined'

const isProduction = () => process.env.NODE_ENV === 'production'

const getConsole = () => globalThis.console
