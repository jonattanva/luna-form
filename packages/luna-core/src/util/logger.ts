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

// `process` belongs to the bundler of whoever installs this, and the build
// leaves the expression for it to answer rather than answering it here. Where
// nothing defines it -- a browser with no bundler at all -- reading it would
// throw, so nothing is production there and the warnings come through.
const isProduction = () =>
  typeof process !== 'undefined' && process.env.NODE_ENV === 'production'

const getConsole = () => globalThis.console
