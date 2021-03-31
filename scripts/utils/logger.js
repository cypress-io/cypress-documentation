/* eslint-disable no-console */
const chalk = require('chalk')

module.exports.logger = {
  log: (...args) => {
    console.log(`${chalk.yellow(`[${new Date().toISOString()}]:`)} `, ...args)
  },
  error: (...args) => {
    console.error(
      `${chalk.bgRed(`[${new Date().toISOString()}]: ⛔️ ERROR:`)} `,
      ...args
    )
  },
}
