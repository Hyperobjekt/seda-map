/**
 * Logger that uses console functions in development.
 * In production, most logs are supressed (only errors are logged)
 */

const DEBUG = true

const logger =
  process.env.NODE_ENV === 'development' && DEBUG
    ? console
    : {
        log: () => {},
        info: () => {},
        warn: () => {},
        error: console.error ? console.error : () => {},
        debug: () => {},
        table: () => {}
      }

export default logger
